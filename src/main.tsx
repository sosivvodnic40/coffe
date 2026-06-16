import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import ProfilePage from './pages/ProfilePage';
import PromotionsPage from './pages/PromotionsPage';
import RegisterPage from './pages/RegisterPage';
import ReservationPage from './pages/ReservationPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
