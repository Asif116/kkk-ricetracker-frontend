import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../utils/api';


import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price_per_kg: '',
    purchase_cost_per_kg: '',
    available_stock_kg: '0',
    image_url: '',
    description: '',
    low_stock_threshold: '10'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`);
      setFormData(res.data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`${API}/products/${id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, formData);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div data-testid="product-form-page" className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isEdit ? 'Edit Product' : 'Create Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                data-testid="product-name-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                data-testid="product-category-input"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Premium, Standard, Boiled"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_kg">Selling Price (₹/kg) *</Label>
                <Input
                  id="price_per_kg"
                  name="price_per_kg"
                  data-testid="product-price-input"
                  type="number"
                  step="0.01"
                  value={formData.price_per_kg}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_cost_per_kg">Purchase Cost (₹/kg) *</Label>
                <Input
                  id="purchase_cost_per_kg"
                  name="purchase_cost_per_kg"
                  data-testid="product-cost-input"
                  type="number"
                  step="0.01"
                  value={formData.purchase_cost_per_kg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_stock_kg">Stock (kg)</Label>
                <Input
                  id="available_stock_kg"
                  name="available_stock_kg"
                  data-testid="product-stock-input"
                  type="number"
                  step="0.01"
                  value={formData.available_stock_kg}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Alert (kg)</Label>
                <Input
                  id="low_stock_threshold"
                  name="low_stock_threshold"
                  data-testid="product-threshold-input"
                  type="number"
                  step="0.01"
                  value={formData.low_stock_threshold}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                data-testid="product-image-input"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                data-testid="product-description-input"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                data-testid="save-product-button"
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                data-testid="cancel-button"
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
