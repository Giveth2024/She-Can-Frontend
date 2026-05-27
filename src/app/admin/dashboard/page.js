'use client';
import { useEffect, useState } from 'react';
import { useAuth, useUser, UserButton } from '@clerk/nextjs';

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to capture accurate submission records database arrays.');
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred pulling dataset files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [getToken]);

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you absolutely sure you want to completely purge this entry?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions/${recordId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || 'Deletion routine failure.');
      }

      setSubmissions((prev) => prev.filter((item) => item.id !== recordId));
    } catch (err) {
      alert(`Critical system failure: ${err.message}`);
    }
  };

  // Construct dynamic personalized welcome string using Clerk user metadata
  const adminFullName = isUserLoaded && user?.fullName ? user.fullName : 'Administrator';

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Top Secured App Navigation Dashboard Header */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop/Aq2NJ23MzBH2rx2j/she-YlenJon1O7ieeEoa.jpg" 
            alt="She Can Foundation Logo" 
            className="h-10 w-auto object-contain rounded"
          />
          <h2 className="font-title font-bold text-lg text-slate-900 tracking-tight flex items-center">
            SHE CAN FOUNDATION 
            <span className="text-red-600 text-xs border border-red-600 px-2 py-0.5 rounded ml-2 font-mono font-bold">
              ADMIN
            </span>
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton afterSignOutUrl="/admin" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-title font-bold text-2xl text-slate-900">
              Welcome, <span className="text-red-600">Admin {adminFullName}</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-0.5">
              Review, analyze and manage incoming foundation intake records.
            </p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="self-start px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 transition shadow-sm"
          >
            Refresh Records
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block mb-2"></div>
            <p className="text-gray-400 text-sm font-medium">Querying secure database registers...</p>
          </div>
        ) : errorMessage ? (
          <div className="p-6 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
            {errorMessage}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm font-medium shadow-sm">
            No submission historical entries currently populate the database systems.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 font-title font-bold text-slate-900 text-sm tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Submitted At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {submissions.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900 whitespace-nowrap">{record.name}</td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">{record.email}</td>
                      <td className="p-4 text-gray-500 max-w-md break-words">{record.message}</td>
                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {new Date(record.created_at).toLocaleDateString(undefined, {
                          dateStyle: 'medium'
                        })}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="px-3 py-1.5 rounded-md border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition font-semibold text-xs bg-transparent"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}