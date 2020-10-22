<script>
    import * as api from 'api.js';
    import { onMount } from 'svelte';
    import Dropdown from './Dropdown.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();


    let users = [];

    async function getUsers() {
        let results = await api.get('users');
        users = [{
            key: "any",
            label: "Any"
        }].concat(results.users.map((user) => {
            return {
                key: user._id,
                label: user.username
            }
        }));
    }

    function dispatchUser(event) {
        dispatch("userSelection", event.detail);
    }

    onMount(()=>{
        getUsers();
    });
</script>
<style></style>
<Dropdown placeholder="Select User" data="{users}" on:itemSelection={dispatchUser}></Dropdown>
