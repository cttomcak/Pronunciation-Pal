<section>
	<form method="POST" action="/auth?/login">
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
	</form>

	<div class="actions">
		<a href="/auth/register">Sign Up</a>
	</div>
</section>
