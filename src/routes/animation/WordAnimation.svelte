<script lang="ts">
	import { onMount } from 'svelte';
	import { aa } from '$lib/word_animation/aa';
	import { CH } from '$lib/word_animation/CH';
	import { DD } from '$lib/word_animation/DD';
	import { E } from '$lib/word_animation/E';
	import { FF } from '$lib/word_animation/FF';
	import { I } from '$lib/word_animation/I';
	import { kk } from '$lib/word_animation/kk';
	import { nn } from '$lib/word_animation/nn';
	import { O } from '$lib/word_animation/O';
	import { PP } from '$lib/word_animation/PP';
	import { RR } from '$lib/word_animation/RR';
	import { sil } from '$lib/word_animation/sil';
	import { SS } from '$lib/word_animation/SS';
	import { TH } from '$lib/word_animation/TH';
	import { U } from '$lib/word_animation/U';
	import { FACEMESH_TESSELATION } from '$lib/word_animation/facemesh_tesselation';
	import { FACEMESH_LIPS } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_LEFT_EYE } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_LEFT_IRIS } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_LEFT_EYEBROW } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_RIGHT_EYE } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_RIGHT_EYEBROW } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_RIGHT_IRIS } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_FACE_OVAL } from '$lib/word_animation/facemesh_features';
	import { FACEMESH_NOSE } from '$lib/word_animation/facemesh_features';

	const visemeDictionary: { [id: string]: [number, number, number][] } = {
		aa: aa,
		CH: CH,
		DD: DD,
		E: E,
		FF: FF,
		I: I,
		kk: kk,
		nn: nn,
		O: O,
		PP: PP,
		RR: RR,
		sil: sil,
		SS: SS,
		TH: TH,
		U: U
	};

	const facemeshFeatures: [number, number][][] = [
		FACEMESH_LIPS,
		FACEMESH_LEFT_EYE,
		FACEMESH_LEFT_IRIS,
		FACEMESH_LEFT_EYEBROW,
		FACEMESH_RIGHT_EYE,
		FACEMESH_RIGHT_EYEBROW,
		FACEMESH_RIGHT_IRIS,
		FACEMESH_FACE_OVAL,
		FACEMESH_NOSE
	];

	export let visemesProp: string[];
	export let phonemesProp: string[];
	let currentVisemeText = 'sil';
	let currentPhonemeText = 'silence';

	let trueVisemes: [number, number, number][][] = [];
	let currentPosition: [number, number, number][] = [];
	let increment: number = 0;
	let numInterpolationFrames: number = 16;
	let currentInterpolation: number = 0;
	let frameRate: number = 1 / 60;

	function main() {
		for (let i = 0; i < sil.length; i++) {
			currentPosition.push([sil[i][0], sil[i][1], sil[i][2]]);
		}

		// Check if window is defined (running on the client side)
		if (typeof window !== 'undefined') {
			const canvas = document.getElementById('canvas');
			if (canvas) {
				const ctx = (canvas as HTMLCanvasElement).getContext('2d');
				if (ctx) {
					console.log('Drawing coordinates');
					beginAnimation(canvas as HTMLCanvasElement, ctx);
				} else {
					console.error('CTX is null for some reason');
				}
			} else {
				console.error("Canvas isn't supported on your browser?");
			}
		}
	}

	function beginAnimation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		visemesProp.forEach((viseme) => {
			trueVisemes.push(visemeDictionary[viseme]);
		});

		setInterval(mainLoop, frameRate * 1000, canvas, ctx);
	}

	function mainLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		let currentViseme = trueVisemes[increment % trueVisemes.length];
		let nextViseme = trueVisemes[(increment + 1) % trueVisemes.length];

		currentViseme.forEach((coordinate, index) => {
			currentPosition[index][0] += (nextViseme[index][0] - coordinate[0]) / numInterpolationFrames;
			currentPosition[index][1] += (nextViseme[index][1] - coordinate[1]) / numInterpolationFrames;
			currentPosition[index][2] += (nextViseme[index][2] - coordinate[2]) / numInterpolationFrames;
		});

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawCurrentPossiton(canvas, ctx, currentPosition);

		currentPhonemeText = phonemesProp[increment % phonemesProp.length];
		currentVisemeText = visemesProp[increment % phonemesProp.length];

		// Set font properties
		ctx.font = '30px Arial'; // Font size and type
		ctx.fillStyle = 'black'; // Text color

		ctx.fillText('/' + currentPhonemeText + '/', 20, 425)
		ctx.fillText(currentVisemeText, 20, 460)

		currentInterpolation++;
		if (currentInterpolation == numInterpolationFrames) {
			currentInterpolation = 0;
			increment++;
			deepCopyViseme(currentPosition, trueVisemes[increment % trueVisemes.length]);
		}
	}

	function deepCopyViseme(current: [number, number, number][], next: [number, number, number][]) {
		current.forEach((coordinate, index) => {
			coordinate[0] = next[index][0];
			coordinate[1] = next[index][1];
			coordinate[2] = next[index][2];
		});
	}

	// Function to draw normalized coordinates as dots on the canvas
	function drawCurrentPossiton(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		coordinates: [number, number, number][]
	) {
		ctx.fillStyle = 'blue';
		coordinates.forEach((coord: [number, number, number]) => {
			const x = coord[0] * canvas.width;
			const y = coord[1] * canvas.height;
			ctx.beginPath();
			ctx.arc(x, y, 1, 0, Math.PI * 2);
			ctx.fill();
		});

		ctx.strokeStyle = 'grey';
		ctx.lineWidth = 0.5;
		FACEMESH_TESSELATION.forEach((pair) => {
			ctx.moveTo(coordinates[pair[0]][0] * canvas.width, coordinates[pair[0]][1] * canvas.height);
			ctx.lineTo(coordinates[pair[1]][0] * canvas.width, coordinates[pair[1]][1] * canvas.height);
		});
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		facemeshFeatures.forEach((featureList) => {
			featureList.forEach((pair) => {
				ctx.moveTo(coordinates[pair[0]][0] * canvas.width, coordinates[pair[0]][1] * canvas.height);
				ctx.lineTo(coordinates[pair[1]][0] * canvas.width, coordinates[pair[1]][1] * canvas.height);
			});
		});
		ctx.stroke();

		let topTeethLineY = currentPosition[19][1] * 480 + 55;
		let bottomTeethLineY = currentPosition[152][1] * 480 - 100;

		let topTeethWidthHalf = ((currentPosition[270][0] - currentPosition[40][0]) * 640) / 2;
		let bottomTeethWidthHalf = ((currentPosition[321][0] - currentPosition[91][0]) * 640) / 2;
		let screenMidPointX = 640 / 2;

		drawCurvedLine(
			ctx,
			[screenMidPointX - topTeethWidthHalf, topTeethLineY],
			[screenMidPointX + topTeethWidthHalf, topTeethLineY],
			[screenMidPointX, topTeethLineY + 15],
			'blue',
			2
		);

		drawCurvedLine(
			ctx,
			[screenMidPointX - bottomTeethWidthHalf, bottomTeethLineY],
			[screenMidPointX + bottomTeethWidthHalf, bottomTeethLineY],
			[screenMidPointX, bottomTeethLineY + 15],
			'blue',
			2
		);

		ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 2;
		ctx.moveTo(screenMidPointX, topTeethLineY + 8);
		ctx.lineTo(screenMidPointX, topTeethLineY - 8);
		ctx.moveTo(screenMidPointX, bottomTeethLineY + 22);
		ctx.lineTo(screenMidPointX, bottomTeethLineY + 8);
		ctx.stroke();
	}

	function drawCurvedLine(
		ctx: CanvasRenderingContext2D,
		point1: [number, number],
		point2: [number, number],
		controlPoint: [number, number],
		color: string,
		thickness: number
	) {
		// Generate points along a quadratic Bezier curve
		const curvePoints = [];
		const numPoints = 100;
		for (let i = 0; i <= numPoints; i++) {
			const t = i / numPoints;
			const x =
				Math.pow(1 - t, 2) * point1[0] +
				2 * (1 - t) * t * controlPoint[0] +
				Math.pow(t, 2) * point2[0];
			const y =
				Math.pow(1 - t, 2) * point1[1] +
				2 * (1 - t) * t * controlPoint[1] +
				Math.pow(t, 2) * point2[1];
			curvePoints.push([x, y]);
		}

		// Draw the curve on the canvas
		ctx.beginPath();
		ctx.moveTo(curvePoints[0][0], curvePoints[0][1]);
		for (let i = 1; i < curvePoints.length; i++) {
			ctx.lineTo(curvePoints[i][0], curvePoints[i][1]);
		}
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.stroke();
	}

	// Call main() when the component mounts
	onMount(main);
</script>

<div>
	<canvas id="canvas" width="640" height="480"></canvas>
	<div>
		Current Phoneme = /{currentPhonemeText}/
	</div>
	<div>
		Current Viseme = {currentVisemeText}
	</div>
</div>

<style>
	canvas {
		border: 1px solid black;
	}
</style>
