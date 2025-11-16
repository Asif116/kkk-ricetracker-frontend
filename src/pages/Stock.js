import { useState, useEffect } from "react";
import api from "../utils/api";   // ✅ FIXED

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAddStock, setShowAddStock] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity_kg: "",
    purchase_cost_per_kg: "",
    supplier_id: "",
    invoice_ref: "",
    notes: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchStockHistory();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", { params: { size: 1000 } }); // ✅ FIXED
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchStockHistory = async () => {
    try {
      const res = await api.get("/stock/history"); // ✅ FIXED
      setStockHistory(res.data.history);
    } catch (error) {
      toast.error("Failed to load stock history");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers"); // ✅ FIXED
      setSuppliers(res.data.suppliers);
    } catch (error) {
      console.error("Failed to load suppliers");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await api.post("/stock/in", formData); // ✅ FIXED
      toast.success("Stock added successfully");
      setShowAddStock(false);

      setFormData({
        product_id: "",
        quantity_kg: "",
        purchase_cost_per_kg: "",
        supplier_id: "",
        invoice_ref: "",
        notes: "",
      });

      fetchProducts();
      fetchStockHistory();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add stock");
    }
  };

  return (
    <div data-testid="stock-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-500 mt-1">Add stock and view history</p>
        </div>

        <Dialog open={showAddStock} onOpenChange={setShowAddStock}>
          <DialogTrigger asChild>
            <Button data-testid="add-stock-button" className="h-12 px-6">
              <Plus className="mr-2" size={20} />
              Add Stock In
            </Button>
          </DialogTrigger>

          <DialogContent data-testid="add-stock-dialog" className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Stock (Purchase)</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddStock} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => {
                    const product = products.find((p) => p.id === value);
                    setFormData({
                      ...formData,
                      product_id: value,
                      purchase_cost_per_kg:
                        product?.purchase_cost_per_kg || "",
                    });
                  }}
                  required
                >
                  <SelectTrigger data-testid="stock-product-select">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity (kg) *</Label>
                  <Input
                    data-testid="stock-quantity-input"
                    type="number"
                    step="0.01"
                    value={formData.quantity_kg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_kg: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Purchase Cost (₹/kg) *</Label>
                  <Input
                    data-testid="stock-cost-input"
                    type="number"
                    step="0.01"
                    value={formData.purchase_cost_per_kg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchase_cost_per_kg: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select
                  value={formData.supplier_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supplier_id: value })
                  }
                >
                  <SelectTrigger data-testid="stock-supplier-select">
                    <SelectValue placeholder="Select supplier (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Invoice / Ref No</Label>
                <Input
                  data-testid="stock-invoice-input"
                  value={formData.invoice_ref}
                  onChange={(e) =>
                    setFormData({ ...formData, invoice_ref: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  data-testid="stock-notes-input"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <Button
                data-testid="save-stock-button"
                type="submit"
                className="w-full"
              >
                Add Stock
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" data-testid="history-tab">
            Stock History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {stockHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No stock movements yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {stockHistory.map((history) => (
                <Card
                  key={history.id}
                  data-testid={`stock-history-${history.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{history.product_name}</h3>

                        <div className="flex gap-3 mt-1 text-sm text-gray-600">
                          <span
                            className={`font-semibold ${
                              history.type === "IN"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {history.type}
                          </span>

                          <span>{history.quantity_kg} kg</span>
                          <span>{history.source}</span>

                          {history.reference_id && (
                            <span>Ref: {history.reference_id}</span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(history.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {history.purchase_cost_per_kg > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Cost/kg</p>
                          <p className="font-bold">
                            ₹{history.purchase_cost_per_kg}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stock;
