import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert'

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dismissReason, setDismissReason] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/reports/pending?page=${currentPage}&size=${pageSize}`);
      setReports(response.data.content);
    } catch (err) {
      setError('Failed to fetch reports. Please try again.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const handleResolve = async (reportId, hidePost) => {
    try {
      await axios.put(`/api/reports/${reportId}/resolve?hidePost=${hidePost}`);
      fetchReports();
      setSelectedReport(null);
    } catch (err) {
      setError('Failed to resolve report. Please try again.');
      console.error('Error resolving report:', err);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await axios.put(`/api/reports/${reportId}/dismiss?reason=${dismissReason}`);
      fetchReports();
      setSelectedReport(null);
      setDismissReason('');
    } catch (err) {
      setError('Failed to dismiss report. Please try again.');
      console.error('Error dismissing report:', err);
    }
  };

  const handleRestore = async (reportId) => {
    try {
      await axios.put(`/api/reports/${reportId}/restore`);
      fetchReports();
    } catch (err) {
      setError('Failed to restore post. Please try again.');
      console.error('Error restoring post:', err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      DISMISSED: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Report Management</h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Reporter</th>
                <th className="p-4 text-left">Post Content</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">User {report.userId}</td>
                  <td className="p-4">
                    {report.postId?.content?.substring(0, 100)}...
                  </td>
                  <td className="p-4">{report.reason}</td>
                  <td className="p-4">
                    {new Date(report.createDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">{getStatusBadge(report.status)}</td>
                  <td className="p-4 space-x-2">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Review
                        </button>
                      </>
                    )}
                    {report.status === 'RESOLVED' && (
                      <button
                        onClick={() => handleRestore(report.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Review Report</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold">Post Content:</h4>
              <p className="mt-2">{selectedReport.postId?.content}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Report Reason:</h4>
              <p className="mt-2">{selectedReport.reason}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Actions:</h4>
              <div className="mt-2 space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleResolve(selectedReport.id, true)}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <Check className="h-4 w-4" />
                    <span>Hide Post</span>
                  </button>
                  <button
                    onClick={() => handleResolve(selectedReport.id, false)}
                    className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Keep Visible</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={dismissReason}
                    onChange={(e) => setDismissReason(e.target.value)}
                    placeholder="Enter reason for dismissal..."
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    <X className="h-4 w-4" />
                    <span>Dismiss Report</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={reports.length < pageSize}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportManagement;