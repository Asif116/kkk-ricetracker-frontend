import { useEffect, useState } from 'react';
import axios from 'axios';

import { API } from '../utils/api';

import { Card, CardContent } from '../components/ui/card';
import { Activity as ActivityIcon } from 'lucide-react';
import { toast } from 'sonner';

const Activity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/activity-logs`);
      setLogs(res.data.logs);
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="activity-page" className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 mt-1">Track recent actions and changes</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ActivityIcon className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-500">No activity logs yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id} data-testid={`activity-log-${log.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{log.action_type}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {log.object_type} {log.object_id && `(ID: ${log.object_id.slice(0, 8)}...)`}
                    </p>
                    {log.new_value && (
                      <p className="text-xs text-gray-500 mt-1">Value: {log.new_value}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
