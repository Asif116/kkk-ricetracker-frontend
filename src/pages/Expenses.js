import { useEffect, useState } from 'react';
import api from '../utils/api';   // ✅ Correct import

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'General',
    notes: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses`);   // ✅ Fixed
      setExpenses(res.data.expenses);
    } catch (error) {
      toast.error('Failed to load expenses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/expenses`, formData);   // ✅ Fixed
      toast.success('Expense added');
      setShowAdd(false);
      setFormData({ title: '', amount: '', category: 'General', notes: '' });
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);  // ✅ Fixed
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div data-testid="expenses-page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">Track shop expenses</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="add-expense-button" className="h-12 px-6">
              <Plus className="mr-2" size={20} />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="add-expense-dialog">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  data-testid="expense-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Helper salary, Electricity"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (₹) *</Label>
                <Input
                  data-testid="expense-amount-input"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  data-testid="expense-category-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Salary, Utilities, Maintenance"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  data-testid="expense-notes-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button data-testid="save-expense-button" type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-500">No expenses recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <Card key={expense.id} data-testid={`expense-card-${expense.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{expense.title}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {expense.category}
                      </span>
                      {expense.notes && <span>{expense.notes}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <p className="text-2xl font-bold text-red-600">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </p>
                    <Button
                      data-testid={`delete-expense-${expense.id}`}
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </Button>
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

export default Expenses;
