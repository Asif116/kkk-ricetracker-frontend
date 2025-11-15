import { useEffect, useState } from 'react';
import axios from 'axios';

import { API } from '../utils/api';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    items_supplied: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API}/suppliers`);
      setSuppliers(res.data.suppliers);
    } catch (error) {
      toast.error('Failed to load suppliers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/suppliers`, formData);
      toast.success('Supplier added');
      setShowAdd(false);
      setFormData({ name: '', phone: '', items_supplied: '' });
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to add supplier');
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await axios.delete(`${API}/suppliers/${id}`);
      toast.success('Supplier deleted');
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div data-testid="suppliers-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-500 mt-1">Manage your suppliers</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="add-supplier-button" className="h-12 px-6">
              <Plus className="mr-2" size={20} />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="add-supplier-dialog">
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  data-testid="supplier-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  data-testid="supplier-phone-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Items Supplied</Label>
                <Input
                  data-testid="supplier-items-input"
                  value={formData.items_supplied}
                  onChange={(e) => setFormData({ ...formData, items_supplied: e.target.value })}
                  placeholder="e.g., Ponni Rice, Basmati"
                />
              </div>
              <Button data-testid="save-supplier-button" type="submit" className="w-full">
                Add Supplier
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {suppliers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-500">No suppliers added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} data-testid={`supplier-card-${supplier.id}`}>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl">{supplier.name}</h3>
                {supplier.phone && (
                  <p className="text-gray-600 mt-1">📞 {supplier.phone}</p>
                )}
                {supplier.items_supplied && (
                  <p className="text-sm text-gray-500 mt-2">
                    Items: {supplier.items_supplied}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    data-testid={`delete-supplier-${supplier.id}`}
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSupplier(supplier.id)}
                    className="flex-1"
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

export default Suppliers;
