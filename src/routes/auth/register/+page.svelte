<section>
	<form method="POST" action="/auth?/register">
		<div class="login-group">
			<div class="group">
				<label for="email">Email</label>
				<input type="email" name="email" id="email" required />
			</div>
	
			<div class="group">
				<label for="fname">First Name</label>
				<input type="text" name="first_name" id="fname" required />
			</div>
	
			<div class="group">
				<label for="lname">Last Name</label>
				<input type="text" name="last_name" id="lname" required />
			</div>
	
			<div class="group">
				<label for="password">Password</label>
				<input type="password" name="password" id="password" required />
			</div>
	
			<div class="submit-container">
				<button type="submit">Sign Up</button>
			</div>
		</div>
	</form>

	<div class="actions">
		<br>
		Already have an account?
		<a href="/auth/login">
			<button>Login</button>
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
