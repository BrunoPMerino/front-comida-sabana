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
        <Marker key={r._id} latitude={r.latitude} longitude={r.longitude}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Red marker */}
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'red', marginBottom: 4 }} />
            {/* Info box */}
            <div style={{
              background: 'white',
              padding: '4px 6px',
              borderRadius: 4,
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
              fontSize: 12,
              textAlign: 'center',
            }}>
              <div><strong>{r.name}</strong></div>
              <div>⭐ {r.averageScore}</div>
              <div>🕒 {Math.round(r.estimatedTime)} min</div>
            </div>
          </div>
        </Marker>
      ))}
    </Map>
  );
} 