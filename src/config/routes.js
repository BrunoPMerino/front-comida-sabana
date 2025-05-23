import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import RestaurantPage from '../pages/RestaurantPage';
import ReviewsPage from '../pages/ReviewsPage';
import OrderHistory from '../pages/OrderHistory';
import InventoryPage from '../pages/InventoryPage';
import Map from '../pages/Map';

export const routes = [
  { id: 'login', path: '/', name: 'Iniciar sesión', component: Login },
  { id: 'register', path: '/register', name: 'Registro', component: Register },
  { id: 'home', path: '/home', name: 'Menú principal', component: Home },
  { id: 'reviews', path: '/reviews/:restaurantId', name: 'Reseñas del restaurante', component: ReviewsPage },
  { id: 'orderhistory', path: '/history', name: 'Historial', component: OrderHistory },
  { id: 'restaurantPage', path: '/restaurant/:restaurantId', name: 'Página restaurante', component: RestaurantPage },
  { id: 'inventory', path: '/inventory', name: 'Inventario', component: InventoryPage },
  { id: 'map', path: '/map', name: 'Mapa', component: Map }
];