import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import RestaurantPage from '../pages/RestaurantPage';

export const routes = [
  { id: 'login', path: '/', name: 'Iniciar sesión', component: Login },
  { id: 'register', path: '/register', name: 'Registro', component: Register },
  { id: 'home', path: '/home', name: 'Menú principal', component: Home },
  { id: 'restaurantPage', path: '/restaurant/:restaurantId', name: 'Pagina restaurante', component: RestaurantPage }
];