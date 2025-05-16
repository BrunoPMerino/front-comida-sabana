// components/MapView.jsx
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ restaurants, onSelect }) {
  return (
    <Map
      initialViewState={{
        latitude: 35.6895, // example latitude
        longitude: 139.6917, 
        zoom: 15,
      }}
      style={{ width: '100%', height: '100vh' }}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
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
    </Map>
  );
}