<script>
	import { createEventDispatcher } from 'svelte';
	import { stores } from '@sapper/app';
	import ListPagination from './ListPagination.svelte';
	import * as api from 'api.js';
	import UsersDropdown from './UsersDropdown.svelte';
	import Dropdown from './Dropdown.svelte';

	export let p = undefined;
	export let selectedArticle = {slug: ''};
	const dispatch = createEventDispatcher();

	const { session, page } = stores();

	let query;
	let selectedUser;
	let selectedArticleType;
	let articles;
	let articlesCount;
	let actionsData = [
		{
			key: "any",
			label: "Any",
		},
		{
			key: "information",
			label: "Information", 
		},
		{
			key: "question",
			label: "Questions", 
		},
		{
			key: "initiative",
			label: "Initiative", 
		},
	];

	$: {
		// const endpoint = tab === 'feed' ? 'articles/feed' : 'articles';
		const endpoint = 'articles';
		const page_size =  10;

		let params = `limit=${page_size}&offset=${(p - 1) * page_size}`;
		if (selectedUser && selectedUser != 'any') params += `&author=${selectedUser}`;
		if (selectedArticleType && selectedArticleType != 'any') params += `&type=${selectedArticleType}`;
		// if (tab === 'tag') params += `&tag=${tag}`;
		// if (tab === 'profile') params += `&${favorites ? 'favorited' : 'author'}=${encodeURIComponent(username)}`;

		query = `${endpoint}?${params}`;
	}

	$: query && getData();

	async function getData() {
		articles = null;

		// TODO do we need some error handling here?
		({ articles, articlesCount } = await api.get(query, $session.user && $session.user.token));
	}

	function onArticleSelection(article) {

		selectedArticle = article;
		dispatch('selection', selectedArticle);
	}

	function onPostTypeSelection(e) {
		let value = e.detail.getAttribute("data-key");
		selectedArticleType = (value.toLowerCase() == "any") ? 'any' : value;
		if (selectedArticleType === 'any' && selectedUser === 'any') {
			dispatch('selection', articles)
		}
	}

	function onUserSelection(e) {
		let value = e.detail.getAttribute("data-label");
		selectedUser = (value.toLowerCase() == "any") ? 'any' : value;
		if (selectedArticleType === 'any' && selectedUser === 'any') {
			dispatch('selection', articles)
		}
	}
</script>

<style>
	.article-container {
		padding: 20px;
	}
	.article-container:hover {
		background-color: #5cb85c4a;
	}
	.article-container.selected {
		background-color: #5cb85c;
		color: white;
	}
	.article-container h5 {
		font-weight: bold;
    	margin-bottom: 2px;
	}
	.article-container p {
		margin-bottom: 5px;
    	font-size: 15px;
	}
	.info-container {
		display: flex;
	}
	.info-container img {
		width: 34px;
		height: 34px;
	}
	.info-container .info {
		padding-left: 15px;
    	line-height: 1rem;
		width: 100%;
	}
	.info-container .info .author {
		font-weight: 500;
    	font-size: 17px;
	}
	.info-container .info .date {
		font-size: 10px;
	}
	.filters-container {
		background-color: #f7f7f79e;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 1px 1px 5px #DCDCDA;
		margin-top: 10px;

	}
	.filter-wrapper.first {
		margin-bottom: 10px;
		margin-top: 20px;
	}
	.filter-wrapper {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.filter-wrapper > div {
		line-height: 32px;
		margin-right: 10px;
	}


</style>

<div class="filters-container">
	<h3>Filters</h3>
	<div class="filter-wrapper first">
		<div>Post Types:</div>
		<Dropdown placeholder="Select Post Type" data="{actionsData}" on:itemSelection={onPostTypeSelection}></Dropdown>
	</div>
	<div class="filter-wrapper">
		<div>Users:</div>
		<UsersDropdown  on:userSelection={onUserSelection}></UsersDropdown>
	</div>
</div>

{#if articles}
	{#if articles.length === 0}
		<div class="article-preview">
			Article list is empty.
		</div>
	{:else}
		<div>
			{#each articles as article (article.slug)}
				<!-- <Article {article} user={$session.user} on:click={onArticleSelection}/> -->

				<div class="article-container" class:selected={selectedArticle && selectedArticle.slug === article.slug} on:click={()=>onArticleSelection(article)}>
					<h5>{article.title}</h5>
					<p>{article.description}</p>
					<div class="info-container">
						<img src={article.author.image} alt={article.author.username} />
						<div class="info">
							<div class="author" > {article.author.username}
							</div>
							<span class="date">
								{new Date(article.createdAt).toDateString()}
							</span>
						</div>
						{#if $session.user}
						<div class="pull-xs-right">
							<button class='btn btn-sm disable' style="color: black;">
								<i class="ion-heart"></i> {article.favoritesCount}
							</button>
						</div>
					{/if}
					</div>
			
					
			
					
				</div>
			{/each}

			<ListPagination {articlesCount} page={parseInt($page.params.user, 10)}  />
		</div>
	{/if}
{:else}
	<div class="article-preview">Loading...</div>
{/if}