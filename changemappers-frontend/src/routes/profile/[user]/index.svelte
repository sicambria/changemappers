<script context="module">
	import * as api from 'api.js';

	export async function preload({ params }, { user }) {
		const username = params.user.slice(1);

		const { profile } = await api.get(`profiles/${username}`, user && user.token);
		return { profile, favorites: params.view === 'favorites' };
	}
</script>

<script>
	import { stores } from '@sapper/app';
	import Profile from './_Profile.svelte';

	export let profile;
	export let favorites;

	const { session } = stores();
</script>

<svelte:head>
	<title>{profile.username} • Changemappers</title>
</svelte:head>

<Profile {profile} {favorites} user={$session.user}/>