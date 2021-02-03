<script>
	import { goto, stores } from '@sapper/app';
	import ListErrors from '../_components/ListErrors.svelte';
	import * as api from 'api.js';
	import Locator from '../_components/Locator/index.svelte';
	import { requiredValidator, minLengthValidator, maxLengthValidator } from '../_components/shared/validators.js'
    import { createFieldValidator } from '../_components/shared/validation.js'

	const [ validity, validate ] = createFieldValidator(requiredValidator(), minLengthValidator(10), maxLengthValidator(100))
	const [ avalidity, avalidate ] = createFieldValidator(requiredValidator(), minLengthValidator(30), maxLengthValidator(200))
	const [ bvalidity, bvalidate ] = createFieldValidator(requiredValidator(), minLengthValidator(100), maxLengthValidator(3000))
	const [ addressValidity, addressValidate ] = createFieldValidator(requiredValidator())
		


	export let article;
	export let slug;

	let inProgress = false;
	let errors;

	const { session } = stores();


	function addTag(input) {
		article.tagList = [...article.tagList, input.value];
		input.value = '';
	}

	function remove(index) {
		article.tagList = [...article.tagList.slice(0, index), ...article.tagList.slice(index + 1)];
	}

	async function publish() {
		inProgress = true;
		console.log(article);

		const response = await (slug
			? api.put(`articles/${slug}`, { article }, $session.user && $session.user.token)
			: api.post('articles', { article }, $session.user && $session.user.token));

		if (response.article) {
			goto(`/article/${response.article.slug}`);
		}

		inProgress = false;
	}

	function enter(node, callback) {
		function onkeydown(event) {
			if (event.which === 13) callback(node);
		}

		node.addEventListener('keydown', onkeydown);

		return {
			destroy() {
				node.removeEventListener('keydown', onkeydown);
			}
		};
	}
</script>

<div class="editor-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-10 offset-md-1 col-xs-12">
				<ListErrors {errors}/>

				<form>
					<fieldset>
						<fieldset class="form-group">
							<input class="form-control form-control-lg" 
								type="text" placeholder="Article Title" 
								bind:value={article.title}
								class:field-danger={!$validity.valid}
								class:field-success={$validity.valid}
								use:validate={article.title}
								>
							{#if $validity.dirty && !$validity.valid}
							<span class="validation-hint">
								{$validity.message} {$validity.dirty}
							</span>
							{/if}
						</fieldset>

						<fieldset class="form-group">
							<input class="form-control" 
							type="text" placeholder="What's this article about?" 
							bind:value={article.description}
							class:field-danger={!$avalidity.valid}
							class:field-success={$avalidity.valid}
							use:avalidate={article.description}
							>
							{#if $avalidity.dirty && !$avalidity.valid}
							<span class="validation-hint">
								{$avalidity.message} {$avalidity.dirty}
							</span>
							{/if}
						</fieldset>

						<fieldset class="form-group">
							<textarea 
							class="form-control" 
							rows="8" 
							placeholder="Write your article (in markdown)" 
							bind:value={article.body}
							class:field-danger={!$bvalidity.valid}
							class:field-success={$bvalidity.valid}
							use:bvalidate={article.body}
							/>
							{#if $bvalidity.dirty && !$bvalidity.valid}
							<span class="validation-hint">
								{$bvalidity.message} {$bvalidity.dirty}
							</span>
							{/if}
						</fieldset>

						<fieldset class="form-group">
							<select class="form-control" bind:value={article.type}>
								<option value="information">Information</option>
								<option value="question">Questions</option>
								<option value="initiative">Initiative</option>
							</select>
						</fieldset>

						<fieldset class="form-group">
							<input style="display: none;" class="form-control"
							bind:value={article.addressPath}
							class:field-danger={!$addressValidity.valid}
							class:field-success={$addressValidity.valid}
							use:addressValidate={article.addressPath}
							/>
							<Locator showError={!$addressValidity.valid} 
							showSuccess={$addressValidity.valid}
							bind:addressPath={article.addressPath} 
							bind:selectedLocation={article.selectedLocation}
							></Locator>
							{#if $addressValidity.dirty && !$addressValidity.valid}
							<span class="validation-hint">
								Please select location from dropdown or map.
							</span>
							{/if}
						</fieldset>

						<fieldset class="form-group">
							<input class="form-control" type="text" placeholder="Enter tags" use:enter={addTag}>

							<div class="tag-list">
								{#each article.tagList as tag, i}
									<span class="tag-default tag-pill">
										<i class="ion-close-round" on:click='{() => remove(i)}'/>
										{tag}
									</span>
								{/each}
							</div>
						</fieldset>

						<button 
							class="btn btn-lg pull-xs-right btn-primary" 
							type="button" 
							disabled={inProgress || !$validity.valid} on:click={publish}>
							Publish Article
						</button>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</div>

<style>

.field-danger {
	color: rgb(245, 76, 24);
	border:1px solid rgb(245, 76, 24);
}

.field-success {
	color: rgb(13, 102, 55);
	border:1px solid rgb(6, 56, 29);
}

.validation-hint{
	color: rgb(175, 130, 5);
}

</style>
