import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import CenterDetails from './pages/CenterDetails';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ParentDashboard from './pages/parent/Dashboard';
import ProviderDashboard from './pages/provider/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRoles }) => { const token=localStorage.getItem('token'); const role=localStorage.getItem('role'); if(!token)return <Navigate to="/login" replace/>; if(allowedRoles&&!allowedRoles.includes(role))return <Navigate to="/" replace/>; return children; };
const App=()=> <Router><Routes><Route path="/" element={<LandingPage/>}/><Route path="/search" element={<SearchPage/>}/><Route path="/centers/:id" element={<CenterDetails/>}/><Route path="/bookings/new" element={<ProtectedRoute allowedRoles={['parent']}><BookingPage/></ProtectedRoute>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/parent/*" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard/></ProtectedRoute>}/><Route path="/provider/*" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard/></ProtectedRoute>}/><Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard/></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/></Routes></Router>;
export default App;
