<script>
    import ArticleListView from '../_components/ArticlesListView/index.svelte';
    import MapView from '../_components/MapView/index.svelte';

    let markers = [
		[29.8283, -96.5795],
		[37.8283, -90.5795],
		[43.8283, -102.5795],
		[48.40, -122.5795],
		[43.60, -79.5795],
		[36.8283, -100.5795],
		[38.40, -122.5795],
    ];
</script>
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-3" style="padding-right:20px;height:calc(100vh - 56px);overflow-y:scroll">
            <ArticleListView tab='profile' username='usiyalla1'/>
        </div>
        <div class="col-sm-9" style="padding-left:0px;">
            <MapView 
            height="100%"
            bind:markers={markers} pinLocation={true} showToolbar={false} zoomLevel={4}/>
        </div>
    </div>
</div>