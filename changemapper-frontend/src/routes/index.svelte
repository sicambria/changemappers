
<script>
    import ArticleListView from './_components/ArticlesListView/index.svelte';
    import MapView from './_components/MapView/index.svelte';

    let markers = [
	];
	
	function onArticleSelection(event) {
		markers = [
			[event.detail.selectedLocation.geometry.coordinates[1], event.detail.selectedLocation.geometry.coordinates[0]]
		]
	}
</script>
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-3" style="padding-right:20px;height:calc(100vh - 56px);overflow-y:scroll">
            <ArticleListView on:selection={onArticleSelection}/>
        </div>
        <div class="col-sm-9" style="padding-left:0px;">
            <MapView height="100%" bind:markers={markers} pinLocation={true} showToolbar={false} zoomLevel={4}/>
        </div>
    </div>
</div>