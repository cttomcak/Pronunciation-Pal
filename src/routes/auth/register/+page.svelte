<section>
	<form method="POST" action="/auth?/register">
		<h3>Register</h3>
		<div class="group">
			<label for="email">Email</label>
			<input type="email" placeholder="Email" name="email" id="email" required />
		</div>

		<div class="group">
			<label for="fname">First Name</label>
			<input type="text" placeholder="John" name="first_name" id="fname" required />
		</div>

		<div class="group">
			<label for="lname">Last Name</label>
			<input type="text" placeholder="Doe" name="last_name" id="lname" required />
		</div>

		<div class="group">
			<label for="password">Password</label>
			<input type="password" placeholder="Password" name="password" id="password" required />
		</div>

		<div class="submit-container">
			<button type="submit">Sign Up</button>
		</div>

		<div class="actions">
			<a href="/auth/login">Login</a>
		</div>
	</form>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
	*, *::before, *::after{
		box-sizing: border-box;
	}
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	form {
		height: 600px;
		width: 400px;
		background-color: rgba(148, 151, 220, 1);
		position: absolute;
		transform: translate(-50%, -50%);
		top: 50%;
		left: 50%;
		border-radius: 10px;
		border: 2px solid rgba(255,255,255,0.2);
		box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
		padding: 35px 35px;
	}
	form *{
		font-family: Poppins, sans-serif;
		color: #000000;
		letter-spacing: 0.5px;
		outline: none;
		border: none;
	}
	form h3 {
		font-size: 36px;
		margin-top: 0;
		margin-bottom: 5px;
		color: #ffffff;
		font-weight: 500;
		line-height: 42px;
		text-align: center;
	}
	input {
		display: block;
		height: 50px;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 3px;
		padding: 0 10px;
		margin-top: 4px;
		font-size: 14px;
		font-weight: 300;
	}
	label {
		display: block;
		color: #ffffff;
		margin-top: 10px;
		font-size: 16px;
		font-weight: 500;
	}
	button {
		margin-top: 20px;
		width: 100%;
		background-color: #ffffff;
		color: #000000;
		padding: 15px 0;
		font-size: 18px;
		font-weight: 600;
		border-radius: 5px;
		cursor: pointer;
	}
	form a {
		display: block;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		color: #ffffff;
		text-align: center;
		margin: 15px 0;
		padding: 15px 0;
		border-radius: 5px;
		cursor: pointer;
	}
</style>