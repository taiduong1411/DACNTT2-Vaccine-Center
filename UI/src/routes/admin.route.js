import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function useAuth() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return accessToken == '0'
    const token = jwtDecode(localStorage.getItem('accessToken'));
    return token.level
}
function AdminRoute() {
    const isAuth = useAuth();
    return (isAuth == '3') ? <Outlet /> : <Navigate to='/login' />

}
export default AdminRoute;