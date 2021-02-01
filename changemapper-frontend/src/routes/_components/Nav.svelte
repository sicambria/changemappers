<script>
	import { stores, goto } from '@sapper/app';
	import { post } from 'utils.js';

	export let segment = "";
	segment;

	const { page, session } = stores();

	async function logout() {
		await post(`auth/logout`);
		$session.user = null;
		goto('/');
}

// icons: https://themeon.net/nifty/v2.9.1/icons-ionicons.html
</script>

<nav class="navbar navbar-light">
	<div class="container">
		<a rel='prefetch' class="navbar-brand" href=".">Changemappers</a>
		<ul class="nav navbar-nav pull-xs-right">
			<li class="nav-item">				
				<a rel='prefetch' class="nav-link" class:active="{$page.path === '/'}" href="/">
					<i class="ion-ios-location"></i>
					Map</a>
			</li>

			<li class="nav-item">
				<a rel='prefetch' href="/feed" class="nav-link" class:active="{$page.path === '/feed'}">
					<i class="ion-ios-people"></i>
					Feed
				</a>
			</li>

			{#if $session.user}
				<li class="nav-item">
					<a rel='prefetch' href="/editor" class="nav-link" class:active="{$page.path === '/editor'}">
						<i class="ion-compose"></i>&nbsp;New Post
					</a>
				</li>
					

				<li class="nav-item">
					<a rel='prefetch' href='/profile/@{$session.user.username}' class="nav-link" class:active="{$page.path === '/profile/@{$session.user.username}'}">
						<!-- <img src={$user.image} class="user-pic" alt={$user.username}> -->
						<i class="ion-person"></i>{$session.user.username}
					</a>
				</li>		

				<li class="nav-item">
					<a href="/" on:click|preventDefault={logout} class="nav-link" >
						<i class="ion-log-out"></i>&nbsp;Log out
					</a>
				</li>

			{:else}
				<li class="nav-item">
					<a rel='prefetch' href="/login" class="nav-link" class:active="{$page.path === '/login'}">
						Sign in
					</a>
				</li>

				<li class="nav-item">
					<a rel='prefetch' href="/register" class="nav-link" class:active="{$page.path === '/register'}">
						Sign up
					</a>
				</li>
			{/if}
		</ul>
	</div>
</nav>