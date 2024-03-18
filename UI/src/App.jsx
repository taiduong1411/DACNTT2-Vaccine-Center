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
import DiseaseManager from './pages/Admin/DiseaseManager/DiseaseManager';
import VaccineManager from './pages/Doctor/Vaccine/VaccineManager';
import VaccineDetailDoctor from './pages/Doctor/Vaccine/VaccineDetail/VaccineDetail';
import BlogManagerDoctor from './pages/Doctor/BlogManager/BlogManager';
import DiseaseManagerDoctor from './pages/Doctor/DiseaseManager/DiseaseManager';
import Booking from './pages/Booking/Booking';
import AllVaccine from './pages/Vaccine/AllVaccine';
import AllBlogs from './pages/Blog/AllBlogs';
import BookDetailVaccine from './pages/Booking/BookDetailVaccine';
import BlogByTag from './pages/Blog/BlogByTag';


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
          <Route path='/book-appointment' element={<Booking />} />
          <Route path='/all-vaccines' element={<AllVaccine />} />
          <Route path='/all-blogs' element={<AllBlogs />} />
          <Route path='/book-appointment/:slug' element={<BookDetailVaccine />} />
          <Route path='/blog/tag/:query' element={<BlogByTag />} />
          <Route exact path='/' element={<DoctorRoute />}>
            <Route path="/doctor/dashboard" element={<Doctor />} />
            <Route path="/doctor/vaccine-schedule" element={<CalendarVaccine />} />
            <Route path="/doctor/vaccine-manager" element={<VaccineManager />} />
            <Route path='/doctor/vaccine-manager/vaccine-detail/:slug/:pro_code' element={<VaccineDetailDoctor />} />
            <Route path='/doctor/blog-manager' element={<BlogManagerDoctor />} />
            <Route path='/doctor/disease-manager' element={<DiseaseManagerDoctor />} />

          </Route>
          <Route exact path='/' element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vaccine-manager" element={<Vaccine />} />
            <Route path="/admin/center-manager" element={<CenterManager />} />
            <Route path='/admin/doctor-manager' element={<DoctorManager />} />
            <Route path='/admin/blog-manager' element={<BlogManager />} />
            <Route path='/admin/disease-manager' element={<DiseaseManager />} />
            <Route path='/admin/vaccine-manager/vaccine-detail/:slug/:pro_code' element={<VaccineDetailAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
