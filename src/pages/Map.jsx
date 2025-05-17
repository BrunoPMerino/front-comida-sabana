import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapView from "../components/MapView";
import TopNavbar from "../components/TopNavbar";
import MobileNavbar from "../components/MobileNavbar";
import useUserStore from "../store/useUserStore";
import RouteLine from "../components/RouteLine"; 
import getWalkingRoute from "../utils/getWalkingRoute"; 

export default function MapPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);

  // Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setUserPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            });
        },
        (err) => console.error("Failed to get location", err),
        { enableHighAccuracy: true }
        );
    }, []);

  // Fetch restaurants
    useEffect(() => {
        if (user === undefined) return;
        if (!user) {
            navigate("/");
            return;
        }

        const fetchRestaurants = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/restaurants`, {withCredentials: true,});
                setRestaurants(res.data);
            } catch (err) {
                console.error("Error fetching restaurants:", err);
            } finally {
                setLoading(false);
            }
        };
    fetchRestaurants();
    }, [API_URL, navigate, user]);

  // Load route
    useEffect(() => {
        if (!selectedRestaurant || !userPosition) return;

        const loadRoute = async () => {
            const route = await getWalkingRoute( userPosition, { lat: selectedRestaurant.latitude, lng: selectedRestaurant.longitude,});
            setRouteData(route);
            };
        loadRoute();
        }, [selectedRestaurant, userPosition]);
    if (user === undefined || loading) {
        return <div className="p-4 text-gray-600 animate-pulse">Cargando mapa...</div>;
    }

    return (
        <>
        <TopNavbar />
        <div className="pt-20 pb-28">
            <MapView
            restaurants={restaurants}
            onSelect={(r) => setSelectedRestaurant(r)}
            userPosition={userPosition}
            />
            {routeData && <RouteLine geojson={routeData} />}
        </div>
        <MobileNavbar />
        </>
    );
}
