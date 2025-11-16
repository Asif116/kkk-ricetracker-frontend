import { useState } from 'react';
import api from '../utils/api';   // ✅ FIXED

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      let res;
      if (reportType === 'daily') {
        res = await api.get(`/reports/daily`, { params: { date } });   // ✅ FIXED
      } else {
        res = await api.get(`/reports/monthly`, { params: { month } }); // ✅ FIXED
      }
      setReportData(res.data);
      toast.success('Report generated');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="reports-page" className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              data-testid="daily-report-button"
              variant={reportType === 'daily' ? 'default' : 'outline'}
              onClick={() => setReportType('daily')}
            >
              Daily Report
            </Button>
            <Button
              data-testid="monthly-report-button"
              variant={reportType === 'monthly' ? 'default' : 'outline'}
              onClick={() => setReportType('monthly')}
            >
              Monthly Report
            </Button>
          </div>

          {reportType === 'daily' && (
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                data-testid="report-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                data-testid="report-month-input"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          )}

          <Button
            data-testid="generate-report-button"
            onClick={generateReport}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {reportData && (
        <Card data-testid="report-result">
          <CardHeader>
            <CardTitle>
              {reportType === 'daily' ? `Daily Report - ${date}` : `Monthly Report - ${month}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ₹{reportData.sales_total?.toLocaleString('en-IN') || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {reportData.sales_count || 0} transactions
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  ₹{reportData.expenses_total?.toLocaleString('en-IN') || 0}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {reportData.expenses_count || 0} entries
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Net Profit</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  ₹{reportData.profit?.toLocaleString('en-IN') || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
