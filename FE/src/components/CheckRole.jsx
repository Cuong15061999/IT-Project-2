import Cookies from "js-cookie";
import { Navigate, useLocation } from 'react-router-dom';

export default function CheckRole({ children }) {
    const location = useLocation();
    const pathname = location.pathname.toLowerCase();
    const { role } = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (role === 'student') {
        if (['/event', '/dashboard', '/user'].includes(pathname)) {
            return <Navigate to="/" state={{ from: location }} replace />;
        } else {
            return children
        }
    } else if (role === 'teacher') {
        if (['/user'].includes(pathname)) {
            return <Navigate to="/" state={{ from: location }} replace />;
        } else {
            return children
        }
    } else if (role === 'admin') {
        return children
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}