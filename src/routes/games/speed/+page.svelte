<script lang="ts">
    import SpeedGame from "./SpeedGame.svelte";
</script>

<canvas tabindex="0" id="canvas" width="800" height="800"></canvas>

<section>
    <SpeedGame />
</section>

<style>
    canvas {
        background-color: lightblue;
    }
</style>