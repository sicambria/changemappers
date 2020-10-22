<script>
    import { createEventDispatcher } from 'svelte';
    
    let showActionsDropdown = false;
    const dispatch = createEventDispatcher();

    export let data;
    export let placeholder = "Please Select";

    let selectedElement = null;

    function onItemSelection(event) {
        showActionsDropdown = !showActionsDropdown;
        selectedElement = event.target;
        dispatch('itemSelection', selectedElement);
    }

</script>
<style>
    .show {
		position: absolute;
		transform: translate3d(0px, 38px, 0px);
		top: 0px;
		left: 0px;
		will-change: transform;
		display: initial
	}

    .selected {
        background-color: #5cb95b;
    }

</style>
<div class="dropdown">
    <button 
      class="btn btn-secondary dropdown-toggle" 
      type="button" 
      id="dropdownMenuButton" 
      data-toggle="dropdown" 
      aria-haspopup="true" 
      aria-expanded="false" 
      on:click="{()=>{showActionsDropdown = !showActionsDropdown}}"
    >
      {selectedElement && selectedElement.getAttribute("data-label") || placeholder}
    </button>
    <div class="dropdown-menu show" class:show={showActionsDropdown} aria-labelledby="dropdownMenuButton">
        {#if data}
            {#each data as item}
                <div 
                    class="dropdown-item" 
                    class:selected={selectedElement && selectedElement.getAttribute("data-key") === item.key} 
                    data-key={item.key}
                    data-label={item.label}
                    on:click={onItemSelection}
                >
                    {item.label}
                </div>
            {/each}
        {:else}
            <div>Loading...</div>
        {/if}
        
    </div>
    <!-- http://localhost:3001/api/articles/?type=information&offset=1
    http://localhost:3001/api/articles/?author=usiyalla -->
</div>