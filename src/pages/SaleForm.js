import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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

const SaleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity_kg: "",
    rate_per_kg: "",
    payment_type: "Cash",
    customer_name: "",
    notes: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (isEdit) {
      fetchSale();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", { params: { size: 1000 } }); // ✅ FIXED
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchSale = async () => {
    try {
      const res = await api.get(`/sales/${id}`); // ✅ FIXED
      setFormData(res.data);

      const product = products.find((p) => p.id === res.data.product_id);
      if (product) setSelectedProduct(product);
    } catch (error) {
      toast.error("Failed to load sale");
      navigate("/sales");
    }
  };

  const handleProductChange = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setFormData({
      ...formData,
      product_id: productId,
      rate_per_kg: product?.price_per_kg || "",
    });
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity_kg) || 0;
    const rate = parseFloat(formData.rate_per_kg) || 0;
    return (qty * rate).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/sales/${id}`, formData); // ✅ FIXED
        toast.success("Sale updated successfully");
      } else {
        await api.post("/sales", formData); // ✅ FIXED
        toast.success("Sale saved — stock updated");
      }
      navigate("/sales");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="sale-form-page" className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEdit ? "Edit Sale" : "Add Sale"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Select */}
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                value={formData.product_id}
                onValueChange={handleProductChange}
                required
              >
                <SelectTrigger data-testid="product-select">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock:{" "}
                      {product.available_stock_kg.toFixed(1)} kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Available:{" "}
                  <span className="font-bold">
                    {selectedProduct.available_stock_kg.toFixed(1)} kg
                  </span>{" "}
                  | Suggested Rate:{" "}
                  <span className="font-bold">
                    ₹{selectedProduct.price_per_kg}/kg
                  </span>
                </p>
              </div>
            )}

            {/* Quantity + Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity (kg) *</Label>
                <Input
                  data-testid="quantity-input"
                  type="number"
                  step="0.01"
                  value={formData.quantity_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity_kg: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rate (₹/kg) *</Label>
                <Input
                  data-testid="rate-input"
                  type="number"
                  step="0.01"
                  value={formData.rate_per_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, rate_per_kg: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-bold text-green-900">
                Total: ₹{calculateTotal()}
              </p>
            </div>

            {/* Payment + Customer */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_type: value })
                  }
                >
                  <SelectTrigger data-testid="payment-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer Name (optional)</Label>
                <Input
                  data-testid="customer-input"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                data-testid="notes-input"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : isEdit ? "Update Sale" : "Create Sale"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/sales")}
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

export default SaleForm;
