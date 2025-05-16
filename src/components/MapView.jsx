import MapGL, { Marker, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapView({ restaurants, onSelect }) {
  return (
    <MapGL
      initialViewState={{
        latitude: 4.8646,  // Example: Universidad de La Sabana
        longitude: -74.0426,
        zoom: 16,
      }}
      mapLib={maplibregl}
      mapStyle="https://demotiles.maplibre.org/style.json"
      style={{ width: '100%', height: '100vh' }}
    >
      <NavigationControl position="top-right" />
      {restaurants.map((r) => (
        <Marker
          key={r.id}
          latitude={r.latitude}
          longitude={r.longitude}
          color="red"
          onClick={() => onSelect(r)}
        />
      ))}
    </MapGL>
  );
}