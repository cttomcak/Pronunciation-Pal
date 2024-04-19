<section>
	<form method="POST" action="/auth?/register">
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
	</form>

	<div class="actions">
		<a href="/auth/login">Login</a>
	</div>
</section>
