import { useEffect, useState } from 'react';
import api from '../utils/api';   // ✅ FIXED

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [search, lowStockFilter]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products`, {   // ✅ FIXED
        params: { search, low_stock: lowStockFilter }
      });
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);    // ✅ FIXED
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete');
    }
  };

  return (
    <div data-testid="products-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your rice varieties</p>
        </div>
        <Button
          data-testid="add-product-button"
          onClick={() => navigate('/products/create')}
          className="h-12 px-6"
        >
          <Plus className="mr-2" size={20} />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            data-testid="product-search-input"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button
          data-testid="low-stock-filter-button"
          variant={lowStockFilter ? 'default' : 'outline'}
          onClick={() => setLowStockFilter(!lowStockFilter)}
          className="h-12"
        >
          <AlertTriangle className="mr-2" size={18} />
          Low Stock Only
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-500">No products found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              data-testid={`product-card-${product.id}`}
              className="overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.available_stock_kg < product.low_stock_threshold && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Low Stock
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.sku}</p>
                  {product.category && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Price/kg</p>
                    <p className="font-bold text-green-600">₹{product.price_per_kg}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Stock</p>
                    <p className="font-bold">{product.available_stock_kg.toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    data-testid={`edit-product-${product.id}`}
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    data-testid={`delete-product-${product.id}`}
                    onClick={() => deleteProduct(product.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
