
<script>
    import ArticleListView from './_components/ArticlesListView/index.svelte';
    import MapView from './_components/MapView/index.svelte';

    let markers = [
	];
	
	function onArticleSelection(event) {
        markers = [];
        if(Array.isArray(event.detail)) {
            for (var i=0; i< event.detail.length; i++){
                let detail = event.detail[i];
                markers.push([detail.selectedLocation.geometry.coordinates[1], detail.selectedLocation.geometry.coordinates[0]]);
            }

        } else  {
            markers = [
			[event.detail.selectedLocation.geometry.coordinates[1], event.detail.selectedLocation.geometry.coordinates[0]]
            ]
        }
        
	}
</script>
<div class="container-fluid">
    <div class="article-list-container" >
        <ArticleListView on:selection={onArticleSelection}/>
    </div>
    <div class="map-container">
        <div class="map">

            <MapView height="100%" bind:markers={markers} pinLocation={true} showToolbar={false} zoomLevel={8}/>
        </div>
    </div>
    
</div>

<style>
    .container-fluid {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap-reverse;
    }
    .article-list-container {
        min-width: 300px;
        width: 300px;
        flex-grow: 1;
        padding-right:20px;
        height:calc(100vh - 56px);
        overflow-y:scroll
    }
    .map-container {
        width:300px;
        flex-grow: 5;
        min-width: 300px;
        display: flex;
    flex-direction: column;
    }
    .map {
        height: 300px;
    display: flex;
    flex-grow: 1;
    position: relative;
    width: 100%;
    }
</style>