<script lang="ts">
export class Renderer {
	ctx: CanvasRenderingContext2D;
	fps: number;
	counter: number;
	oldTimeStamp: number = 0;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.fps = 60; // aim for 60fps
		this.counter = 0;
		this.initTicker();
	}

	private initTicker() {
		window.requestAnimationFrame(() => {
			this.tick();
			this.initTicker();
		});
	}

	private tick() {
		const timeStamp = performance.now();
		const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
		this.oldTimeStamp = timeStamp;

		// Calculate fps
		const fps = Math.round(1 / secondsPassed);
		const frameSkip = this.clamp(Math.round((60 - fps) / fps), 0, 30);

		// to allow for animations lasting 1s
		if (this.counter >= this.fps * 2) {
			this.counter = 0;
		}

		const tick: TickEvent = new CustomEvent("tick", {
			bubbles: true,
			cancelable: true,
			composed: false,
			detail: {
				frameCount: this.counter,
				frameSkip: frameSkip,
			},
		});
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.canvas.dispatchEvent(tick);

		this.counter++;
	}

    private clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max);
    }
}

interface TickEvent extends Event {
	readonly detail?: {
		frameCount: number;
		frameSkip: number;
	};
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
});

let ctx: CanvasRenderingContext2D
let renderer: Renderer

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas || !canvas.getContext("2d")) {
	console.error("canvas is missing");
} else {
    console.log("canvas loaded successfully")
    ctx = canvas.getContext("2d")!;
    renderer = new Renderer(ctx);
}
</script>