<script context="module">
  export async function preload({ params }, { user }) {
    if (user) {
      this.redirect(302, `/`);
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import ListErrors from "../_components/ListErrors.svelte";
  import { post } from "utils.js";
  import Locator from "../_components/Locator/index.svelte";
  import { requiredValidator } from "../_components/shared/validators.js";
  import { createFieldValidator } from "../_components/shared/validation.js";

  const [addressValidity, addressValidate] = createFieldValidator(
    requiredValidator()
  );
  const { session } = stores();

  let acceptTerms = false;

  let username = "";
  let email = "";
  let password = "";
  let errors = null;
  let addressPath = null;
  let selectedLocation = null;

  async function submit(event) {
    if (!acceptTerms)
      return (errors = { "terms and conditions": "must be accepted" });
    const response = await post(`auth/register`, {
      username,
      email,
      password,
      addressPath,
      selectedLocation,
    });

    // TODO handle network errors
    errors = response.errors;
    if (response.user) {
      $session.user = response.user;
      goto("/");
    }
  }
</script>

<svelte:head>
  <title>Sign up • Changemappers</title>
</svelte:head>

<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Have an account?</a>
        </p>

        <ListErrors {errors} />

        <form on:submit|preventDefault={submit}>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="text"
              required
              placeholder="Your Name"
              bind:value={username}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="email"
              required
              placeholder="Email"
              bind:value={email}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="password"
              required
              placeholder="Password"
              bind:value={password}
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              style="display: none;"
              class="form-control"
              bind:value={addressPath}
              class:field-danger={!$addressValidity.valid}
              class:field-success={$addressValidity.valid}
              use:addressValidate={addressPath}
            />
            <Locator
              showError={!$addressValidity.valid}
              showSuccess={$addressValidity.valid}
              bind:addressPath
              bind:selectedLocation
            />
          </fieldset>
          <fieldset>
            <label for="terms">
              <input type="checkbox" bind:checked={acceptTerms} />
              <span on:click|self={() => (acceptTerms = !acceptTerms)}
                >I accept Terms and conditions</span
              >
            </label>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign up
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
    border: 1px solid rgb(245, 76, 24);
  }

  .field-success {
    color: rgb(170, 241, 3);
    border: 1px solid rgb(170, 241, 3);
  }
  input[type="checkbox"] {
    transform: scale(1.3);
  }
  input[type="checkbox"] + span {
    font-size: 1.3rem;
    margin-left: 0.5rem;
  }
  label[for="terms"] {
    padding-left: 0.5rem;
    padding-top: 0.5rem;
	user-select: none;
	cursor: pointer;
  }
</style>
