export default async function getWalkingRoute(start, end) {
    const url = `https://router.project-osrm.org/route/v1/foot/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry;
        } else {
            throw new Error("No route found");
        }
    } catch (err) {
        console.error("Failed to fetch walking route", err);
        return null;
    }
}