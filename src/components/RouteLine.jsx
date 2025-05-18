import { Source, Layer } from 'react-map-gl/maplibre';

export default function RouteLine({ geojson }) {
    if (!geojson) return null;
    return (
        <Source id="route" type="geojson" data={{ type: 'Feature', geometry: geojson }}>
        <Layer
            id="route-line"
            type="line"
            paint={{ 'line-color': '#3b82f6','line-width': 5, } }
        />
    </Source>
    );
}