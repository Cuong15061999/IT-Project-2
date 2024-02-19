import Cookies from "js-cookie";
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children  }) {
  const isAuthenticated = Cookies.get('access_token');
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  if (!isAuthenticated) {
    if (pathname === '/login' || pathname === 'register') {
      return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    if (pathname === '/login' || pathname === 'register') {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
  }

}