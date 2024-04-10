<script lang="ts">
	let current_title: string = "Pronunciation Pal"
	let english_title: string = "Pronunciation Pal";
	let ipa_title: string = "/pɹəˌnaʊn.siˈeɪ.ʃən/ /pal/";

	function swap_title() {
		if (current_title == english_title) {
			current_title = ipa_title
		} else {
			current_title = english_title
		}
	}
</script>

<header>
	<nav class="top-navbar">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<strong class="navbar-logo" on:click={swap_title}>{current_title}</strong>
		<input type="checkbox" id="nav-check">
		<label for="nav-check" class="nav-chlab">☰</label>
		<div class="navbar-links">
			<a href="/">Home</a>
			<a href="/animation">Speech Animation</a>
			<a href="/auth/login">Login</a>
			<a href="/auth/register">Register</a>
			<a href="/profile">Profile</a>
			<a href="/games">🕹️</a>
		</div>
	</nav>
</header>

<style>
	header {
		background-color: #4942E4;
	}
	.top-navbar {
		margin-right: auto;
		margin-left: auto;
		width: 80%;
		font-size: 18px;
		background-color: #4942E4;
		z-index: 1000;
	}
	@media (max-width: 900px) {
		.top-navbar {
			width: 100%;
		}
	}
	.navbar-logo {
		display: inline-block;
		padding: 10px;
		color: white;
	}
	#nav-check,
	.nav-chlab {
		display: none;
		color: white;
	}
	.navbar-links {
		display: inline-block;
		float: right;
	}
	.navbar-links > a {
		transition: all 0.4s ease-in;
		color: white;
		display: inline-block;
		padding: 10px;
		text-decoration: none;
	}
	.navbar-links > a:hover {
		background-color: #11009E;
	}
	@media (max-width: 600px) {
		.nav-chlab {
			display: inline-block;
			float: right;
			font-size: 28px;
			max-height: 38px;
			padding: 0px 10px;
		}
		.nav-chlab:hover,
		#nav-check:checked ~ .nav-chlab {
			background-color: #d3d3d3;
		}
		.navbar-links,
		.navbar-links > a {
			display: block;
			width: 100%;
		}
		.navbar-links {
			position: absolute;
			transition: all 0.4s ease-in;
			overflow-y: hidden;
			background-color: #e0e0e0;
			top: 38px;
			left: 0px;
		}
		#nav-check:not(:checked) ~ .navbar-links {
			height: 0px;
		}
		#nav-check:checked ~ .navbar-links {
			height: calc(100vh - 38px);
			overflow-y: auto;
		}
	}
</style>
