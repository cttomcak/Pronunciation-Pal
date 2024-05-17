python run_speech_recognition_ctc.py \
    --dataset_name="w11wo/ljspeech_phonemes" \
    --text_column_name="phonemes" \
    --train_split_name="train" \
    --model_name_or_path="facebook/wav2vec2-base" \
    --output_dir="./wav2vec2-ljspeech-gruut" \
    --overwrite_output_dir \
    --num_train_epochs="30" \
    --per_device_train_batch_size="16" \
    --gradient_accumulation_steps="2" \
    --learning_rate="1e-4" \
    --warmup_steps="1000" \
    --weight_decay="0.005" \
    --evaluation_strategy="epoch" \
    --eval_metrics wer cer \
    --save_strategy="epoch" \
    --layerdrop="0.0" \
    --save_total_limit="3" \
    --freeze_feature_encoder \
    --gradient_checkpointing \
    --chars_to_ignore , ? . ! - \; \: \" “ % ‘ ” � ˈ ˌ \
    --fp16 \
    --group_by_length \
    --report_to="tensorboard" \
    --push_to_hub \
    --do_train --do_eval \
    --hub_model_id="bookbot/wav2vec2-ljspeech-gruut" \
    --hub_private_repo="True" \
    --use_auth_token="True"