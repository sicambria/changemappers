<script>
	import { createEventDispatcher } from 'svelte';
	import Locator from '../_components/Locator/index.svelte';
	import { requiredValidator } from '../_components/shared/validators.js'
	import { createFieldValidator } from '../_components/shared/validation.js'

	const [ addressValidity, addressValidate ] = createFieldValidator(requiredValidator())

	export let inProgress, image, username, bio, email, password = '', addressPath, selectedLocation;
	const dispatch = createEventDispatcher();

	function submit(event) {
		dispatch('save', { image, username, bio, email, password, addressPath, selectedLocation });
	}
</script>

<form on:submit|preventDefault='{submit}'>
	<fieldset>
		<fieldset class="form-group">
			<input class="form-control" type="text" placeholder="URL of profile picture" bind:value={image}>
		</fieldset>

		<fieldset class="form-group">
			<input class="form-control form-control-lg" type="text" placeholder="Username" bind:value={username}>
		</fieldset>

		<fieldset class="form-group">
			<textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" bind:value={bio}/>
		</fieldset>

		<fieldset class="form-group">
			<input class="form-control form-control-lg" type="email" placeholder="Email" bind:value={email}>
		</fieldset>

		<fieldset class="form-group">
			<input class="form-control form-control-lg" type="password" placeholder="New Password" bind:value={password}>
		</fieldset>

		<fieldset class="form-group">
			<input style="display: none;" class="form-control"
				bind:value={addressPath}
				class:field-danger={!$addressValidity.valid}
				class:field-success={$addressValidity.valid}
				use:addressValidate={addressPath}
				/>
			<Locator showError={!$addressValidity.valid} 
				showSuccess={$addressValidity.valid}
				bind:addressPath={addressPath} 
				bind:selectedLocation={selectedLocation}
			></Locator>
		</fieldset>


		<button class="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={inProgress}>
			Update Settings
		</button>
	</fieldset>
</form>

<style>

	.field-danger {
		color: rgb(245, 76, 24);
		border:1px solid rgb(245, 76, 24);
	}
	
	.field-success {
		color: rgb(170, 241, 3);
		border:1px solid rgb(170, 241, 3);
	}
	
</style>