import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { initAuthToken } from './utils/api';


import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Sales from './pages/Sales';
import SaleForm from './pages/SaleForm';
import Stock from './pages/Stock';
import Expenses from './pages/Expenses';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Exports from './pages/Exports';
import Settings from './pages/Settings';
import Activity from './pages/Activity';

function App() {
  useEffect(() => {
    initAuthToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/sales/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <SaleForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/sales/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <SaleForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Layout>
                  <Stock />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/exports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Exports />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Layout>
                  <Activity />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
