<script lang="ts">
  import { cacheUrl } from './caching';
  import { browser } from '$app/environment';
  import { onMount, createEventDispatcher } from 'svelte';
  import type { Map as LeafletMap, GeoJSON, Layer, PathOptions } from 'leaflet';
  
  const dispatch = createEventDispatcher();

  type CountryMap = {
    layer: Layer;
  };

  let map: LeafletMap;
  let geojsonLayer: GeoJSON;
  let countryLayers = new Map<string, CountryMap>();
  let highlightedCountries = new Set<string>();
  let hoveredCountry = '';

  // map colors
  const waterColor = '#a8d5e5';
  const landColor = '#b3d9b3';
  const highlightColor = '#ff6262';

  // do all of this only once
  function darkenColor(color: string): string {
    const factor = 0.8;
    const num = parseInt(color.slice(1), 16);
    const r = Math.floor(((num >> 16) & 255) * factor);
    const g = Math.floor(((num >> 8) & 255) * factor);
    const b = Math.floor((num & 255) * factor);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  const darkLandColor = darkenColor(landColor);
  const darkHighlightColor = darkenColor(highlightColor);

  const landStyle: PathOptions = {
    fillColor: landColor,
    fillOpacity: 1,
    weight: 0.5,
    opacity: 1,
    color: darkLandColor,
  };

  const landHoverStyle: PathOptions = {
    ...landStyle,
    fillColor: darkLandColor,
  };

  const highlightStyle: PathOptions = {
    ...landStyle,
    fillColor: highlightColor,
    color: darkHighlightColor,
  };

  const highlightHoverStyle: PathOptions = {
    ...highlightStyle,
    fillColor: darkHighlightColor,
  };

  export function centerOnCountry(countryName: string) {
    const country = countryLayers.get(countryName);
    if (country) {
      const bounds = (country.layer as GeoJSON).getBounds();
      const maxZoom = 5; // Adjust this value to set the maximum zoom level
      const padding: L.PointTuple = [50, 50]; // Padding around the country

      if (bounds.getNorthEast().lat - bounds.getSouthWest().lat > 40 ||
          bounds.getNorthEast().lng - bounds.getSouthWest().lng > 80) {
        // For very large countries (like Russia), use a fixed zoom level
        const center = bounds.getCenter();
        map.setView(center, 3, { animate: true });
      } else {
        map.fitBounds(bounds, { 
          maxZoom: maxZoom, 
          padding: padding,
          animate: true 
        });
      }
    }
  }

  export function highlightCountry(countryName: string) {
    const country = countryLayers.get(countryName);
    if (!country) return;
    
    highlightedCountries.add(countryName);
    (country.layer as GeoJSON).setStyle(highlightStyle).bringToFront();
  }

  onMount(async () => {
    if (!browser) return;

    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    const worldBounds: L.LatLngBoundsLiteral = [
      [-90, -180],
      [90, 180]
    ];

    map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      maxBounds: worldBounds,
      maxBoundsViscosity: 1.0
    });

    map.getContainer().style.backgroundColor = waterColor;

    const geojsonResponse = await cacheUrl('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await geojsonResponse.json();
    
    geojsonLayer = L.geoJSON(geojson, {
      style: landStyle,
      onEachFeature: (feature, layer) => {
        const countryName = feature.properties.ADMIN.toLowerCase();
        countryLayers.set(countryName, {layer});
        
        layer.on({
          mouseover: (e) => {
            hoveredCountry = feature.properties.ADMIN;
            if (highlightedCountries.has(countryName)) {
              (e.target as GeoJSON).setStyle(highlightHoverStyle);
            } else {
              (e.target as GeoJSON).setStyle(landHoverStyle);
            }
          },
          mouseout: (e) => {
            hoveredCountry = '';
            if (highlightedCountries.has(countryName)) {
              (e.target as GeoJSON).setStyle(highlightStyle);
            } else {
              (e.target as GeoJSON).setStyle(landStyle);
            }
          }
        });
      }
    }).addTo(map);

    dispatch('mapReady', new Set(countryLayers.keys()));
  });
</script>

<div id="map"></div>

{#if hoveredCountry}
  <div class="hover-info">{hoveredCountry}</div>
{/if}

<style>
  #map {
    height: 100%;
    width: 100%;
    border-radius: 1em;
  }
  /* todo */
  .hover-info {
    position: absolute;
    top: 20px;
    right: 20px;
    color: black;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    pointer-events: none;
    z-index: 999;
  }
</style>