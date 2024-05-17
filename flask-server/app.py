import os
from flask import Flask, request, redirect
from transformers import AutoProcessor, AutoModelForCTC, Wav2Vec2Processor
import librosa
import torch
from itertools import groupby

# Model setup
checkpoint = "bookbot/wav2vec2-ljspeech-gruut"
model = AutoModelForCTC.from_pretrained(checkpoint)
processor = AutoProcessor.from_pretrained(checkpoint)
sr = processor.feature_extractor.sampling_rate

# Helper function to decode phoneme IDs to phonemes from the model results
def decode_phonemes(
    ids: torch.Tensor, processor: Wav2Vec2Processor, ignore_stress: bool = False
) -> str:
    """CTC-like decoding. First removes consecutive duplicates, then removes special tokens."""
    # removes consecutive duplicates
    ids = [id_ for id_, _ in groupby(ids)]

    special_token_ids = processor.tokenizer.all_special_ids + [
        processor.tokenizer.word_delimiter_token_id
    ]
    # converts id to token, skipping special tokens
    phonemes = [processor.decode(id_) for id_ in ids if id_ not in special_token_ids]

    # joins phonemes
    prediction = " ".join(phonemes)

    # removes IPA stress marks if desired
    if ignore_stress == True:
        prediction = prediction.replace("ˈ", "").replace("ˌ", "")

    return prediction

# Flask setup
upload_folder = 'uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = upload_folder

# Allow cross-origin requests
@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Main route
@app.route('/api/phonemes', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        # read a single audio file
        audio_array, _ = librosa.load(filename, sr=sr)

        inputs = processor(audio_array, return_tensors="pt", padding=True)

        with torch.no_grad():
            logits = model(inputs["input_values"]).logits

        predicted_ids = torch.argmax(logits, dim=-1)
        prediction = decode_phonemes(predicted_ids[0], processor, ignore_stress=True)
        os.remove(filename)
        return prediction

# Health check route so record button can be hidden if the server is down
@app.route('/api/health', methods=['GET'])
def health():
    return "", 200