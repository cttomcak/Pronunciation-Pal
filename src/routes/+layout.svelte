<!-- The layout file gives the consistent structure of the website,
like the header and footer. Just has some basic css right now. -->

<script>
	import Header from './Header.svelte';
	// For global styles
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>
			Visit
			<a href="https://github.com/cttomcak/Team-12-SWAG-Pronunciation-Pal">
				SWAG Team GitHub
			</a>
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh; /* Ensure the app takes up at least the full viewport height */
	}

	main {
		flex: 1; /* Allow main to take up remaining space */
		display: flex;
		justify-content: center;
		/* align-items: center; */
		padding: 15px;
		background-color: #FAE7F3;
	}

	footer {
		margin-top: 10px;
		display: flex;
		justify-content: center; /* Centers content on horizontal axis */
		align-items: center; /* Centers content on vertical axis */
		background-color: #4942E4;
		color: white;
	}

	footer a {
		font-weight: bold;
	}
</style>
