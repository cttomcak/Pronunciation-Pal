<script lang="ts">
    let parrotDialogue: string = "Hello!"
</script>

<div class="game-menu">
    <div class="parrot-header">
        <div class="parrot-speech">
            <div class="parrot-name">Otto</div>
            {parrotDialogue}
        </div>
        <img src="/sprites/parrot_left.png" alt="parrot mascot" style="width: 30%; justify-content: flex-end;">
    </div>
    <div class="game-mode-buttons">
        <a href="/games/speed">
            <button>
                <img src="/sprites/racing.png" alt="castle" style="width: 100px; height: auto;">
                Speed (coming soon!)
            </button>
        </a>
        <a href="/games/accuracy">
            <button>
                <img src="/sprites/spaceship.png" alt="castle" style="width: 100px; height: auto;">
                Accuracy
            </button>
        </a>
        <a href="/games/range">
            <button>
                <img src="/sprites/castle.png" alt="castle" style="width: 100px; height: auto;">
                Word Range (coming soon!)
            </button>
        </a>
    </div>
</div>

<style>
    .game-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    .parrot-header {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .parrot-speech {
        justify-content: flex-start;
        min-width: 300px;
        max-width: 300px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
        border: 3px solid #11009E;
		border-radius: 5px;
        padding: 10px;
        background-color: #faf9f6;
    }
    .parrot-name {
        font-weight: bold;
        color: #fd4755;
        text-decoration: underline;
    }
    .game-mode-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
    }
    button:hover {
		border-color: darkmagenta;
		background-color: darkviolet;
	}
    button {
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
	}
</style>