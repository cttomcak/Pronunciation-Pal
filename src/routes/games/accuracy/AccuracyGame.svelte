<script lang="ts">
    import { onMount } from 'svelte';
    
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

    export class Game {
        ctx: CanvasRenderingContext2D
        //characters: Character[]
        renderer: Renderer

        constructor(canvas: HTMLCanvasElement) {
            if (!canvas || !canvas.getContext("2d")) {
                console.error("canvas is missing");
            } else {
                console.log("canvas successfully loaded")
            }
            this.ctx = canvas.getContext("2d")!;
            this.renderer = new Renderer(this.ctx);
        }
    }

    export class Character {
        
    }

    let canvas: HTMLCanvasElement

    onMount(() => {
        new Game(canvas)
    })

</script>

<canvas bind:this={canvas} width="800" height="800"></canvas>

<style>
    canvas {
        background-color: rgb(0, 40, 87);
    }
</style>