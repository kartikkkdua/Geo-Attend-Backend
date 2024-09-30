import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectRoute from './auth/ProtectedRoute'
import Sidebar from './pages/employee/Sidebar';
export default function App() {
  const Home = React.lazy(() => import('./pages/Home'));
  const AdminBoard = React.lazy(() => import('./pages/admin/Dashboard'));
  const UserBoard = React.lazy(() => import('./pages/employee/Dashboard'));

  return (
    <BrowserRouter>
      <AuthProvider >
        <Toaster position="top-center" />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Protected />} >
              <Route path='/' element={<Home />} />
            </Route>
            <Route element={<ProtectRoute requiredRole="Admin" />}>
              <Route path='/Admin' element={<AdminBoard />} />
            </Route>
            <Route element={<ProtectRoute requiredRole="Employee" />}>
              <Route path='/Employee' element={<Sidebar WrappedComponent={<UserBoard/>} ></Sidebar>} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>

  );


}

const Protected = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`${user.role}`} />
  }
  return <Outlet />
}


