import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import RestaurantPage from '../pages/RestaurantPage';
import Menu from '../pages/Menu';
import ReviewsPage from '../pages/ReviewsPage';
import OrderHistory from '../pages/OrderHistory';
import InventoryPage from '../pages/InventoryPage'; 

export const routes = [
  { id: 'login', path: '/', name: 'Iniciar sesión', component: Login },
  { id: 'register', path: '/register', name: 'Registro', component: Register },
  { id: 'home', path: '/home', name: 'Menú principal', component: Home },
  { id: 'menu', path: '/menu', name: 'Menú', component: Menu },
  { id: 'reviews', path: '/reviews', name: 'Reseñas', component: ReviewsPage },
  { id: 'orderhistory', path: '/history', name: 'Historial', component: OrderHistory },
  { id: 'restaurantPage', path: '/restaurant/:restaurantId', name: 'Pagina restaurante', component: RestaurantPage },
  { id: 'inventory', path: '/inventory', name: 'Inventario', component: InventoryPage },
  { id: 'map', path: '/map', name: 'Mapa', component: Map }
];