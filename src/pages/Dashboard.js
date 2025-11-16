import { useEffect, useState } from 'react';
import api from '../utils/api'; // ✅ USE OUR API WRAPPER

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary'); // ✅ FIXED
      setSummary(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        data-testid="dashboard-loading"
        className="flex items-center justify-center h-96"
      >
        Loading...
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Button
          data-testid="quick-add-sale-button"
          onClick={() => navigate('/sales/create')}
          className="h-12 px-6"
        >
          <Plus className="mr-2" size={20} />
          Quick Add Sale
        </Button>
      </div>

      {/* Today Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            data-testid="today-sales-card"
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Today Sales</CardTitle>
              <TrendingUp className="text-green-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                ₹{summary?.today?.sales?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>

          <Card
            data-testid="today-expenses-card"
            className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Today Expenses</CardTitle>
              <TrendingDown className="text-red-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                ₹{summary?.today?.expenses?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>

          <Card
            data-testid="today-profit-card"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Today Profit</CardTitle>
              <DollarSign className="text-blue-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                ₹{summary?.today?.profit?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* This Month */}
      <div>
        <h2 className="text-xl font-semibold mb-4">This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="month-sales-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Month Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{summary?.month?.sales?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="month-expenses-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Month Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{summary?.month?.expenses?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="month-profit-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Month Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{summary?.month?.profit?.toLocaleString('en-IN') || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Low Stock Alert */}
      {summary?.low_stock_products?.length > 0 && (
        <Card data-testid="low-stock-alert" className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle size={20} />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.low_stock_products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  data-testid={`low-stock-product-${product.id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-red-600 font-semibold">
                      {product.available_stock_kg.toFixed(1)} kg left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Sellers */}
      {summary?.best_sellers?.length > 0 && (
        <Card data-testid="best-sellers-card">
          <CardHeader>
            <CardTitle>Top Selling Products (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.best_sellers.map((product, idx) => (
                <div
                  key={idx}
                  data-testid={`best-seller-${idx}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.quantity.toFixed(1)} kg sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
