mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);