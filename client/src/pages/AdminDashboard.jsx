import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Added Link
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiFilter, FiMessageSquare } from 'react-icons/fi';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Fetch ALL complaints
  const fetchComplaints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data } = await axios.get('/api/complaints', config);
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle Status Change
  const updateStatus = async (id, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      await axios.put(`/api/complaints/${id}`, { status: newStatus }, config);
      
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaints(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Filter Logic
  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (loading) return <div className="text-center mt-20">Loading Admin Panel...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Console</h1>
          <p className="text-gray-500">Manage and resolve student issues.</p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
          <FiFilter className="text-gray-400" />
          <select 
            className="select select-sm select-ghost w-full max-w-xs focus:bg-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Complaints</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th>Issue</th>
              <th>Category</th>
              <th>Student ID</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-50">
                <td>
                  <div className="font-bold">{complaint.title}</div>
                  <div className="text-xs text-gray-400 truncate w-40">{complaint.description}</div>
                </td>
                <td>{complaint.category}</td>
                <td className="text-xs font-mono text-gray-500">
                  {complaint.user?.name || 'Unknown'}
                </td>
                <td>
                  <span className={`badge badge-sm ${
                    complaint.severity === 'High' ? 'badge-error text-white' : 
                    complaint.severity === 'Medium' ? 'badge-warning' : 'badge-ghost'
                  }`}>
                    {complaint.severity}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-outline font-semibold ${
                    complaint.status === 'Resolved' ? 'text-green-600 border-green-600' : 
                    complaint.status === 'Rejected' ? 'text-red-600 border-red-600' : 'text-yellow-600 border-yellow-600'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    
                    {/* CHAT / VIEW BUTTON */}
                    <Link 
                      to={`/complaint/${complaint._id}`} 
                      className="btn btn-square btn-sm btn-ghost text-blue-600 tooltip" 
                      data-tip="Open Chat"
                    >
                      <FiMessageSquare size={18} />
                    </Link>

                    {/* RESOLVE BUTTON */}
                    <button 
                      onClick={() => updateStatus(complaint._id, 'Resolved')}
                      className="btn btn-square btn-sm btn-ghost text-green-600 tooltip" 
                      data-tip="Mark Resolved"
                    >
                      <FiCheckCircle size={18} />
                    </button>

                    {/* REJECT BUTTON */}
                    <button 
                      onClick={() => updateStatus(complaint._id, 'Rejected')}
                      className="btn btn-square btn-sm btn-ghost text-red-500 tooltip" 
                      data-tip="Reject"
                    >
                      <FiXCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-10 text-gray-400">No complaints found in this category.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;