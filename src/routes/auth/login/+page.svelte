<section>
	<form method="POST" action="/auth?/login">
		<div class="login-group">
			<div class="group">
				<label for="email">Email</label>
				<input type="email" name="email" id="email" required />
			</div>
	
			<div class="group">
				<label for="password">Password</label>
				<input type="password" name="password" id="password" required />
			</div>
	
			<div class="submit-container">
				<button type="submit">Login</button>
			</div>
		</div>
	</form>

	<div class="actions">
		<br>
		Don't have an account?
		<a href="/auth/register">
			<button>Sign Up</button>
		</a>
	</div>
</section>

<style>
	button {
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
	}
	input {
		width: 50%;
		height: 40px;
		line-height: 28px;
		padding: 0 1rem;
		padding-left: 2.5rem;
		border: 2px solid black;
		border-radius: 50px;
		background-color: #ffffff;
		color: #0d0c22;
		transition: .3s ease;
	}
	.group {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.login-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
