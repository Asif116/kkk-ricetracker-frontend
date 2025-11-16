import { useState } from 'react';
import api from '../utils/api';   // ✅ FIXED

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'sonner';

const Exports = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (type, format) => {
    setLoading(true);
    try {
      const endpoint = format === 'pdf' ? '/exports/pdf' : '/exports/excel';

      // ✅ FIXED: use our axios instance
      const res = await api.post(endpoint, { export_type: type }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${type}_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Report ready — click to download`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="exports-page" className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Exports</h1>
        <p className="text-gray-500 mt-1">Download reports as PDF or Excel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table size={20} />
              Sales Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Export all sales transactions with details
            </p>
            <div className="flex gap-2">
              <Button
                data-testid="export-sales-pdf"
                onClick={() => handleExport('sales', 'pdf')}
                disabled={loading}
                className="flex-1"
              >
                <FileText className="mr-2" size={18} />
                PDF
              </Button>

              <Button
                data-testid="export-sales-excel"
                onClick={() => handleExport('sales', 'excel')}
                disabled={loading}
                className="flex-1"
                variant="outline"
              >
                <Download className="mr-2" size={18} />
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table size={20} />
              Products Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Export product list with pricing and stock
            </p>
            <div className="flex gap-2">
              <Button
                data-testid="export-products-pdf"
                onClick={() => handleExport('products', 'pdf')}
                disabled={loading}
                className="flex-1"
              >
                <FileText className="mr-2" size={18} />
                PDF
              </Button>

              <Button
                data-testid="export-products-excel"
                onClick={() => handleExport('products', 'excel')}
                disabled={loading}
                className="flex-1"
                variant="outline"
              >
                <Download className="mr-2" size={18} />
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exports;
