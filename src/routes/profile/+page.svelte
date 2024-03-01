<script lang="ts">
    export let data;
</script>

<h1>Locked page, only accessible when logged in</h1>
<h2>Hello, {data.user.first_name}</h2>
<a href="/">Home</a>
<form action="/auth?/logout" method="POST">
    <button type="submit">Logout</button>
</form>