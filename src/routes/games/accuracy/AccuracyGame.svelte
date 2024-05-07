<script lang="ts">
    import { onMount } from 'svelte';
    import { Collider2d, Vector, Polygon } from 'collider2d';
	import type CollisionDetails from 'collider2d/build/collision_details';
    import config from "../config.json"
    
    export const standard: themeConfig = {
        name: "standard",
        colors: [],
        scene: {
            name: "scene",
            images: [],
            animationSpeed: 2,
            offset: { x: 0, y: 0 }
        },
        obstacles: [],
        players: [
            {
                default: {
                    name: "p1",
                    images: ["/sprites/spaceship.png"],
                    animationSpeed: 2,
                    offset: { x: 0, y: 0 }
                }
            }
        ],
        turnSprites: false
    }

    export const themes = {
        standard
    }
    
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
        collider: Collider2d
        obstacles: Obstacle[] = []
        scene: Scene | undefined
        characters: Character[] = []
        theme: Theme | undefined
        renderer: Renderer

        constructor(canvas: HTMLCanvasElement) {
            if (!canvas || !canvas.getContext("2d")) {
                console.error("canvas is missing");
            } else {
                console.log("canvas successfully loaded")
            }
            this.ctx = canvas.getContext("2d")!;
            this.collider = new Collider2d()
            this.initializeTheme(themes.standard)
            this.renderer = new Renderer(this.ctx);
        }

        getTheme() {
            const themeSelect = document.querySelector('#theme') as HTMLSelectElement;
            return themeSelect.value as keyof typeof themes;
        }

        initializeTheme(theme: themeConfig) {
            this.theme = new Theme(this.ctx, theme)
            this.obstacles = []
            this.scene = new Scene(this, this.theme)
            this.characters = []
            const player = new Character(this, 0, this.theme)
            this.characters.push(player)
            player.setActive(true)
            console.log("theme successfully initialized")
        }
    }

    export class Character {
        game: Game
        ctx: CanvasRenderingContext2D
        theme: Theme
        active: boolean
        collider: Collider2d
        characters: Character[]
        obstacles: Obstacle[]
        playerNumber: number
        size: number
        position: coordinates
        orientation: number
        speed: number
        maxVelocity: number
        range: number
        velocity: coordinates
        obstacle: Obstacle
        action: {
            movingX: number
            movingY: number
        }

        constructor(game: Game, playerNumber: number, theme: Theme) {
            this.game = game
            this.ctx = game.ctx
            this.theme = theme
            this.active = false
            this.collider = game.collider
            this.characters = game.characters
            this.obstacles = game.obstacles
            this.playerNumber = playerNumber
            this.size = 100
            this.position = this.getInitialPosition()
            this.orientation = 0
            this.speed = 1
            this.range = 150
            this.maxVelocity = 20
            this.velocity = {
                x: 0,
                y: 0
            }
            this.obstacle = this.createObstacle(`player${this.playerNumber}`)
            this.action = {
                movingX: 0,
                movingY: 0
            }

            this.registerControls()

            console.log("Initial position: " + this.position.x + " " + this.position.y)

            window.requestAnimationFrame(() => {
                this.move()
            })

            this.ctx.canvas.addEventListener("tick", (event: TickEvent) => {
                this.onNextTick(event)
            })
        }

        private getInitialPosition(): {x: number, y: number} {
           return {
            x: this.ctx.canvas.width - 50 - this.size,
            y: this.ctx.canvas.height - 50 - this.size
           }
        }

        private createObstacle(id: string): Obstacle {
            return new Obstacle(this.collider, this.obstacles, id, {
			    a: { x: this.position.x, y: this.position.y },
			    b: { x: this.position.x + this.size, y: this.position.y },
			    c: {
				    x: this.position.x + this.size,
				    y: this.position.y + this.size,
			    },
			    d: { x: this.position.x, y: this.position.y + this.size },
		    });
        }

        private registerControls(): void {
            // move left
		    config.controls[this.playerNumber].left.forEach((key: string) => {
			    document.addEventListener("keydown", (event: KeyboardEvent) => {
				    this.captureEvent(event);
				    if (event.code === key && event.repeat === false) {
					    this.action.movingX = -1;
				    }
			    });
			    document.addEventListener("keyup", (event: KeyboardEvent) => {
				    this.captureEvent(event);
				    if (event.code === key) {
					    this.action.movingX = 0;
				    }
			    });
		    });

		    // move right
            config.controls[this.playerNumber].right.forEach((key: string) => {
                document.addEventListener("keydown", (event: KeyboardEvent) => {
                    this.captureEvent(event);
                    if (event.code === key && event.repeat === false) {
                        this.action.movingX = 1;
                    }
                });
                document.addEventListener("keyup", (event: KeyboardEvent) => {
                    this.captureEvent(event);
                    if (event.code === key) {
                        this.action.movingX = 0;
                    }
                });
            });
        }

        private captureEvent(event: KeyboardEvent): void {
		    if (
			    event.target === this.ctx.canvas &&
			    config.controls.find((x) =>
				    Object.values(x).some((y) => y.includes(event.code))
			    )
		    ) {
			    event.preventDefault();
		    }
	    }

        public setActive(active: boolean): void {
            this.active = active
        }

        private collide(): void {
            const obstacles = this.obstacles.filter(
			    (obstacle) => obstacle.getId() !== this.obstacle.getId()
		    );

		    obstacles.forEach((obstacle) => {
			    const collision = this.obstacle.collidesWith(obstacle);
			    const friction = 0.8;

			    if (!collision) {
				    return;
			    }

			    this.velocity.x = (this.velocity.x + collision.overlapV.x * -1) * friction;
			    this.velocity.y = (this.velocity.y + collision.overlapV.y * -1) * friction;
		    });
        }

        private move(): void {
            const { position, velocity, action } = this;
		    const newX = position.x + action.movingX * this.speed + velocity.x * this.speed;
		    const newY = position.y + action.movingY * this.speed + velocity.y * this.speed;

		    position.x = newX;
		    position.y = newY;

		    if (position.x < 0) {
			    position.x = 0;
		    } else if (newX > this.ctx.canvas.width - this.size) {
			    position.x = this.ctx.canvas.width - this.size;
		    }

		    if (position.y < 0) {
			    position.y = 0;
		    } else if (newY > this.ctx.canvas.height - this.size) {
			    position.y = this.ctx.canvas.height - this.size;
		    }

		    this.obstacle.editObstacle({
			    a: { x: position.x, y: position.y },
			    b: { x: position.x + this.size, y: position.y },
			    c: { x: position.x + this.size, y: position.y + this.size },
			    d: { x: position.x, y: position.y + this.size },
		    });

		    this.velocity.x = clamp(
			    (action.movingX
				    ? this.velocity.x + action.movingX
				    : this.velocity.x * 0.8) * this.speed,
			        this.maxVelocity * -1,
			        this.maxVelocity
		    );

		    this.velocity.y = clamp(
			    (action.movingY
				    ? this.velocity.y + action.movingY
				    : this.velocity.y * 0.8) * this.speed,
			        this.maxVelocity * -1,
			        this.maxVelocity
		    );
        }

        private draw(frameCount: number): void {
            this.ctx.save();

		    this.ctx.translate(
			    Math.round(this.position.x + this.size / 2),
			    Math.round(this.position.y + this.size / 2)
		    );
            
            //debug hitbox
            //this.ctx.fillRect(this.size / -2, this.size / -2, this.size, this.size);

            this.theme.drawSprite(
			    this.ctx,
			    this.getSprite().name,
			    { x: this.size / -2, y: this.size / -2 },
			    frameCount
		    );

		    this.ctx.restore();
        }

        private getSprite(): Sprite {
		    let action = "default";
		    if (
			    this.active &&
			    (this.action.movingX || this.action.movingY)
		    ) {
			    action = "move";
		    }

		    return this.theme.config.players[this.playerNumber].default;
	    }

        private executeCharacterActions(): void {
            if (this.active) {
                this.move()
                this.collide()
            }
        }

        private onNextTick(tick: TickEvent): void {
            this.executeCharacterActions();

		    for (let i = 0; i < tick.detail!.frameSkip; i++) {
			    this.executeCharacterActions();
		    }

		    this.draw(tick.detail!.frameCount);
        }
    }

    export class Obstacle {
        private collider: Collider2d;
	    private obstacles: Obstacle[];
	    private id: string;
	    private object: rectangle;

	    constructor(
		    collider: Collider2d,
		    obstacles: Obstacle[],
		    id: string,
		    object: rectangle
	    ) {
		    this.collider = collider;
		    this.obstacles = obstacles;
		    this.id = id;
		    this.object = object;

		    this.obstacles.push(this);
	    }

	    public getId(): string {
		    return this.id;
	    }

	    public getObject(): rectangle {
		    return this.object;
	    }

	    public editObstacle(payload: rectangle) {
		    this.object = payload;
	    }

	    public removeObstacle() {
		    this.obstacles = this.obstacles.filter(
			    (obstacle) => obstacle.id !== this.id
		    );
	    }

	    public collidesWith(obstacle: Obstacle): CollisionDetails {
		    const thisPolygon = new Polygon(new Vector(0, 0), [
			    new Vector(this.object.a.x, this.object.a.y),
			    new Vector(this.object.b.x, this.object.b.y),
			    new Vector(this.object.c.x, this.object.c.y),
			    new Vector(this.object.d.x, this.object.d.y),
		    ]);

		    const otherPolygon = new Polygon(new Vector(0, 0), [
			    new Vector(obstacle.object.a.x, obstacle.object.a.y),
			    new Vector(obstacle.object.b.x, obstacle.object.b.y),
			    new Vector(obstacle.object.c.x, obstacle.object.c.y),
			    new Vector(obstacle.object.d.x, obstacle.object.d.y),
		    ]);

		    return this.collider.testPolygonPolygon(
			    thisPolygon,
			    otherPolygon,
			    true
		    ) as CollisionDetails;
	    }
    }

    export class Theme {
        ctx: CanvasRenderingContext2D
        config: themeConfig
        assetsLoaded: boolean = false
        images: HTMLImageElement[] = []
        sprites: Sprite[] = []

        constructor(ctx: CanvasRenderingContext2D, config: themeConfig) {
            this.ctx = ctx
            this.config = config

            this.loadAssets()
        }

        private loadImage(src: string): Promise<HTMLImageElement> {
		    const url = `${src}`;
		    return fetch(url).then(() => {
			    const img = new Image();
			    img.src = url;
			    if (!this.images.includes(img)) {
				    this.images.push(img);
			    }
			    return img;
		    });
	    }

        public loadAssets() {
		    const toLoad: HTMLImageElement[] = [];

		    this.config.scene.images.forEach(async (image) => {
			    const imageResp = await this.loadImage(image);
			    if (toLoad.includes(imageResp)) {
				    return;
			    }
			    imageResp.onload = () => {
				    this.onAssetLoaded(toLoad);
			    };
			    toLoad.push(imageResp);
		    });
		    this.sprites.push(this.config.scene);

		    this.config.players.forEach((player) => {
				player.default.images.forEach(async (image: string) => {
					const imageResp = await this.loadImage(image);
					if (toLoad.includes(imageResp)) {
						return;
					}
					imageResp.onload = () => {
						this.onAssetLoaded(toLoad);
					};
					toLoad.push(imageResp);
				});
				this.sprites.push(player.default);
		    });
	    }

        private onAssetLoaded(assetList: HTMLImageElement[]) {
		    const loadComplete = assetList.every((x) => x.complete);
		    const progress = Math.floor(
			    ((assetList.length - assetList.filter((x) => !x.complete).length) / assetList.length) * 100
		    );
		    const loadingEvent: LoadingEvent = new CustomEvent("loadingEvent", {
			    detail: {
				    progress,
			    },
		    });
		    this.ctx.canvas.dispatchEvent(loadingEvent);

		    if (loadComplete) {
			    this.assetsLoaded = true;
		    }
	    }

        public drawSprite(ctx: CanvasRenderingContext2D, name: string, pos: coordinates, frameCount = 0) {
		    const sprite = this.sprites.find((x) => x.name === name);
		    if (!sprite) {
			    return;
		    }

		    const spriteFrame = Math.floor((frameCount / sprite.animationSpeed) % sprite.images.length);

		    const img = this.images.find((x) => x.src.endsWith(`${sprite.images[spriteFrame]}`));

		    if (!img) {
                return;
		    }

		    ctx.drawImage(img, pos.x + sprite.offset.x, pos.y + sprite.offset.y, 100, 100);
	    }
    }

    export class Scene {
        game: Game
        ctx: CanvasRenderingContext2D
        theme: Theme
        width: number
        height: number
        obstacles: Obstacle[]

        constructor(game: Game, theme: Theme) {
            this.game = game;
		    this.ctx = game.ctx;
		    this.theme = theme;
		    this.width = this.ctx.canvas.width;
		    this.height = this.ctx.canvas.height;
		    this.obstacles = this.getObstacles();

		    this.ctx.canvas.addEventListener("tick", (event: TickEvent) => {
			    this.draw(event?.detail?.frameCount || 0);
		    });
	    }

        private draw(frameCount: number) {
		    this.theme.drawSprite(
			    this.ctx,
			    this.theme.config.scene.name,
			    { x: 0, y: 0 },
			    frameCount
		    );
	    }

        private getObstacles(): Obstacle[] {
            return this.theme.config.obstacles.map(
			    (obstacle, i) =>
				    new Obstacle(
					    this.game.collider,
					    this.game.obstacles,
					    `scene${i}`,
					    obstacle
				    )
		    );
        }
    }

    type coordinates = {
	    x: number;
	    y: number;
    };

    type rectangle = {
	    a: coordinates;
	    b: coordinates;
	    c: coordinates;
	    d: coordinates;
    };

    type themeConfig = {
        name: string; // has to match folder name
	    scene: Sprite; // scene image, 1920x1080
	    colors: string[];
	    obstacles: rectangle[]; // outline obsacles within the scene
	    players: {
		    default: Sprite; // player when standing still, 100x100
	    }[]; // provide sprites for each player, else player 1 sprites will be re-used
	    turnSprites?: boolean;
    };

    interface LoadingEvent extends Event {
	    readonly detail: {
		    progress: number;
	    };
    }

    type Sprite = {
        [key: string]: any
        name: string;
	    images: string[];
	    animationSpeed: number; // use next image every N frames, max 60
	    offset: coordinates;
    };

    export function clamp(num: number, min: number, max: number) {
	    return Math.min(Math.max(num, min), max);
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