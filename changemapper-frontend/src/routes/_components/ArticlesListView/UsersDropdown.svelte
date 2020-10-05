<script>
    import * as api from 'api.js';
    import { onMount } from 'svelte';
    import Dropdown from './Dropdown.svelte';


    let users = [];

    async function getUsers() {
        let results = await api.get('users');
        users = results.users.map((user) => {
            return {
                key: user._id,
                label: user.username
            }
        });
    }

    onMount(()=>{
        getUsers();
    });
</script>
<style></style>
<div>
    <Dropdown placeholder="Select User" data="{users}"></Dropdown>
</div>