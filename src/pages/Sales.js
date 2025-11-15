import { useEffect, useState } from 'react';
import axios from 'axios';

import { API } from '../utils/api';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API}/sales`);
      setSales(res.data.sales);
    } catch (error) {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id) => {
    if (!window.confirm('Delete this sale? Stock will be restored.')) return;

    try {
      await axios.delete(`${API}/sales/${id}`);
      toast.success('Sale deleted and stock restored');
      fetchSales();
    } catch (error) {
      toast.error('Failed to delete sale');
    }
  };

  return (
    <div data-testid="sales-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500 mt-1">Track your daily sales</p>
        </div>
        <Button
          data-testid="add-sale-button"
          onClick={() => navigate('/sales/create')}
          className="h-12 px-6"
        >
          <Plus className="mr-2" size={20} />
          Add Sale
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading sales...</div>
      ) : sales.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-500">No sales recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sales.map((sale) => (
            <Card key={sale.id} data-testid={`sale-card-${sale.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{sale.product_name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {sale.quantity_kg} kg</span>
                      <span>Rate: ₹{sale.rate_per_kg}/kg</span>
                      <span className="text-blue-600">{sale.payment_type}</span>
                      {sale.customer_name && <span>Customer: {sale.customer_name}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(sale.sale_date).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600">₹{sale.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`edit-sale-${sale.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/sales/edit/${sale.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        data-testid={`delete-sale-${sale.id}`}
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSale(sale.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sales;
