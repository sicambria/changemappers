<script>
	import { onMount } from 'svelte';
	import MainView from './MainView/index.svelte';
	import Tags from './Tags.svelte';
	import * as api from 'api.js';

	export let p = 1;

	let tab;
	let tag;
	let tags;

	function setTags({ detail }) {
		tag = detail.tag;
		tab = "tag";
	}

	onMount(async () => {
		({ tags } = await api.get('tags'));
	});
</script>

<svelte:head>
	<title>Changemappers</title>
</svelte:head>

<div class="home-page">
	<div class="container page">
		<div class="row">
			<MainView {p} {tag} bind:tab />

			<div class="col-md-3">
				<div class="sidebar">
					<p>Popular Tags</p>
					<Tags {tags} on:select='{setTags}' />
				</div>
			</div>
		</div>
	</div>
</div>