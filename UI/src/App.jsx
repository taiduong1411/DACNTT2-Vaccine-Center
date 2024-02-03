// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Account/login/Login'
import Home from './pages/home/Home';
import Register from './pages/Account/register/Register';
import ForgotPassword from './pages/Account/forgot-password/Forgot-password';
import ResetPassword from './pages/Account/forgot-password/Reset-Password';
import PageNotFound from './pages/404/404';
import DoctorRoute from './routes/doctor.route';
import AdminRoute from './routes/admin.route';

import Doctor from './pages/Doctor/Doctor';
import Dashboard from './pages/Admin/Dashboard';

import CalendarVaccine from './pages/Doctor/CalendarVaccine';
import Vaccine from './pages/Admin/VaccineManager/Vaccine';

import CenterManager from './pages/Admin/CenterManager/CenterManager';
import DoctorManager from './pages/Admin/DoctorManager/DoctorManager';
import BlogManager from './pages/Admin/BlogManager/BlogManager';
import VaccineDetail from './pages/Vaccine/VaccineDetail';
import BlogDetail from './pages/Blog/BlogDetail';
import VaccineDetailAdmin from './pages/Admin/VaccineManager/VaccineDetail/VaccineDetail';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<PageNotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/vaccine/:slug' element={<VaccineDetail />} />
          <Route path='/blog/:slug' element={<BlogDetail />} />
          <Route exact path='/' element={<DoctorRoute />}>
            <Route path="/doctor/dashboard" element={<Doctor />} />
            <Route path="/doctor/vaccine-schedule" element={<CalendarVaccine />} />
          </Route>
          <Route exact path='/' element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vaccine-manager" element={<Vaccine />} />
            <Route path="/admin/center-manager" element={<CenterManager />} />
            <Route path='/admin/doctor-manager' element={<DoctorManager />} />
            <Route path='/admin/blog-manager' element={<BlogManager />} />
            <Route path='/admin/vaccine-manager/vaccine-detail/:slug/:pro_code' element={<VaccineDetailAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App