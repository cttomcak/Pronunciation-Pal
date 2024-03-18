<script lang='ts'>
    export let viseme: any;
    export let phoneme: any;
    import { viseme_description_dict } from '../lib/PhonemeVisemeDict';
</script>

<div class="image_div">
    <!-- The viseme image -->
    <img src={`visemes/${viseme}.jpg`} class="viseme-image" alt={`Viseme ${viseme}`}>
    <!-- The angled viseme image -->
    <img src={`visemes/${viseme}45.jpg`} class="viseme-image" alt={`Viseme ${viseme} Angled`}>
    <div>
        <strong>From phoneme: "{phoneme}"</strong>
    </div>
    <div>
        <strong>Viseme: {viseme}</strong>
    </div>
    <div>
        <strong>Description: {viseme_description_dict[viseme]}</strong>
    </div>
</div>

<style>
    .viseme-image {
        width: 100%; /* Set width of images */
        height: auto; /* Maintain aspect ratio */
    }

    .image_div {
        width: 20%;
        min-width: 200px;
        margin: 5px; /* Add some space between images */
        background-color: rgb(160, 193, 230);;
        padding: 10px;
    }
</style>