<script>

    import MapView from '../MapView/index.svelte';
    import debounce from 'lodash/debounce';
    import { onMount } from 'svelte';
    import * as api from 'api.js';

    let markers = [];
    let locationsService = null;
    let showList = false;
    let address = "";
    export let addressPath = null;
    export let selectedLocation = null;
    export let showError = null;
    export let showSuccess = null;

    $: if(selectedLocation != null) onLocationSelection(selectedLocation)

    const testgetAddress = debounce(e => {
        addressPath = null;
        selectedLocation = null;
        locationsService = getAddress(e);
  }, 300)

	async function getAddress(input) {

		const response = await api.getExternal("https://photon.komoot.io/api/?q=" + input);
		const data = await response.json();

		if (response.ok) {
			return data;
		} else {
			throw new Error(data);
		}

    }
    
    function onLocationSelection(selectedLocation) {
        markers = [[selectedLocation.geometry.coordinates[1], selectedLocation.geometry.coordinates[0]]];
        addressPath = `${selectedLocation.properties.name}, ${selectedLocation.properties.city}, ${selectedLocation.properties.country}`;
        address = addressPath;
        
    }

    function onRowSelection(e) {
        let location = JSON.parse(e.target.dataset.info);
        selectedLocation = location;
    }

    async function onPinUpate(e) {
        const response = await api.getExternal(`https://photon.komoot.io/reverse/?lat=${e.detail.lat}&lon=${e.detail.lng}` );
        const data = await response.json();
        if (response.ok) {
            if(data.features[0]){
                let f = data.features[0];
                addressPath = `${f.properties.name}, ${f.properties.city}, ${f.properties.country}`;
                address = addressPath;
                selectedLocation = f;
            } else {
                console.log("No location found");
            }

			return data;
		} else {
			throw new Error(data);
		}
    }

</script>
<div>
    <div style="position: relative;">
        <input class="form-control"  id="inpAddress" 
            name="address"
            class:field-danger={showError}
            class:field-success={showSuccess}
            on:keyup = {e => testgetAddress(address)}
            on:blur = {e => showList = false}
            on:focus = {e => showList = true}
            bind:value= {address}
            type="text" placeholder="Enter address here..."/>
            
        {#if showList}
            {#await locationsService}
                <ul class="list-group waiting"><li class="list-group-item">Loading</li></ul>
            {:then locs}
                <ul class="list-group" on:mousedown={onRowSelection}>
                    {#if locs && locs.features.length > 0}
                        {#each locs.features as o, i}
                        <li class="list-group-item-action" data-info={JSON.stringify(o)}>{o.properties.name}</li>
                        {/each}
                    {/if}
                    {#if locs && locs.features.length === 0 && address.length > 0}
                        <li>No location found. Please change address.</li>
                    {/if}
                </ul>
            {:catch error}
            <p style="color: red">{error.message}</p>
            
            {/await}
        {/if}
    </div>
    <div>
        <MapView height="300px" bind:markers={markers} 
        pinLocation={true} 
        showToolbar={false} 
        on:pin_updated={onPinUpate}
        keepSingleLocation = {true}
        zoomLevel={14}
        />
    </div>
</div>

<style>

    .list-group {
        position: absolute;
        z-index: 1001;
        width: 100%;
        overflow: scroll;
        background-color: white;
        border: 1px solid #d2d0d0;
        border-radius: 4px;
    }

    li {
        border-bottom: .5px solid #e2dfdf;
        padding: 4px;
    }
    .field-danger {
	color: rgb(245, 76, 24);
	border:1px solid rgb(245, 76, 24);
}

.field-success {
	color: rgb(170, 241, 3);
	border:1px solid rgb(170, 241, 3);
}
    
</style>