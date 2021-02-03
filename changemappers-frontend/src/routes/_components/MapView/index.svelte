<script>
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import MapToolbar from "./MapToolbar.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let markers;
  export let pinLocation;
  export let showToolbar;
  export let keepSingleLocation = undefined;
  export let height = "calc(100vh - 56px);";
  export let width = "100%";
  export let zoomLevel = 12;
  let map;
  let MyComponent;
  let L;
  let mapDom;
  let curLocMarker;
  let eye = true;
  let lines = true;
  let toolbar = null;
  let toolbarComponent;
  let markerLayers;

  const initialView = markers[0] || [39.8283, -98.5795];

  onMount(async () => {
    const module = await import("leaflet");
    L = module.default;

    if (showToolbar === true) {
      toolbar = L.control({ position: "topright" });
      toolbar.onAdd = (map) => {
        let div = L.DomUtil.create("div");
        toolbarComponent = new MapToolbar({
          target: div,
          props: {},
        });

        toolbarComponent.$on("click-eye", ({ detail }) => (eye = detail));
        toolbarComponent.$on("click-lines", ({ detail }) => (lines = detail));
        toolbarComponent.$on("click-reset", () => {
          map.setView(initialView, zoomLevel, { animate: false });
        });

        return div;
      };
      toolbar.onRemove = () => {
        if (toolbarComponent) {
          toolbarComponent.$destroy();
          toolbarComponent = null;
        }
      };
    }

    mapAction(mapDom);
  });

  function createMap(container) {
    let m = L.map(container).setView(initialView, 2, { animate: false });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 24,
      }
    ).addTo(m);

    return m;
  }

  function mapAction(container) {
    map = createMap(container);
    if (pinLocation === true) {
      map.on("click", function (e) {
        if (curLocMarker) map.removeLayer(curLocMarker);
        if (keepSingleLocation) markerLayers.clearLayers();
        curLocMarker = L.marker(e.latlng).addTo(map);
        dispatch("pin_updated", e.latlng);
      });
    }
    if (showToolbar === true) toolbar.addTo(map);
    markerLayers = L.layerGroup();
    markerLayers.addTo(map);

    return {
      destroy: () => {
        if (showToolbar === true) toolbar.remove();
        map.remove();
        map = null;
      },
    };
  }

  $: {
    if (L && map) {
      if (markerLayers) markerLayers.clearLayers();
      if (curLocMarker) map.removeLayer(curLocMarker);

      for (let location of markers) {
        let m = L.marker(location);
        if (m) markerLayers.addLayer(m);
      }
      if (markers[0]) {
        map.setView(markers[0]);
      }
    }
  }

  $: if (markerLayers && map) {
    if (eye) {
      markerLayers.addTo(map);
    } else {
      markerLayers.remove();
    }
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

<svelte:head>
  <!-- In the REPL you need to do this. In a normal Svelte app, use a CSS Rollup plugin and import it from the leaflet package. -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
  />
</svelte:head>

<div
  style="height:{height};width:{width}"
  class="container-fluid"
  bind:this={mapDom}
/>

<svelte:window on:resize={resizeMap} />
