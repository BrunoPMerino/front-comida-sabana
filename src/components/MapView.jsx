import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function MapView({ restaurants }) {
  // Optional: calculate center from restaurants or use fixed coords
  const center = restaurants.length
    ? {
        latitude: restaurants[0].latitude,
        longitude: restaurants[0].longitude,
      }
    : { latitude: 0, longitude: 0 };

  return (
    <Map
      initialViewState={{
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 14,
      }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle={MAP_STYLE}
    >
      <NavigationControl position="top-right" />
      {restaurants.map((r) => (
        <div key={r._id} style={{ position: 'relative' }}>
          <Marker latitude={r.latitude} longitude={r.longitude} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '-30px', // Adjust as needed to position above the marker
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.9em',
              textAlign: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {r.name}
          </div>
        </div>
      ))}
    </Map>
  );
}