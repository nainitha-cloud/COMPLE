import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi'; // <--- Import Message Icon

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch complaints from Backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get('/api/complaints', config);
        
        // Calculate Stats
        const total = data.length;
        const pending = data.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;
        const resolved = data.filter(c => c.status === 'Resolved').length;

        setComplaints(data);
        setStats({ total, pending, resolved });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Stat Cards Configuration
  const statCards = [
    { 
      title: 'Total Complaints', 
      value: stats.total, 
      icon: <FiAlertCircle />, 
      color: 'bg-blue-50 text-blue-600 border-blue-200' 
    },
    { 
      title: 'Pending', 
      value: stats.pending, 
      icon: <FiClock />, 
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200' 
    },
    { 
      title: 'Resolved', 
      value: stats.resolved, 
      icon: <FiCheckCircle />, 
      color: 'bg-green-50 text-green-600 border-green-200' 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Here is the status of your recent complaints.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border ${stat.color} shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="text-3xl opacity-80">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recent History</h2>
        </div>
        
        {complaints.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p>No complaints found. Good job!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Table Head */}
              <thead className="bg-gray-50">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th> {/* <--- Added Action Header */}
                </tr>
              </thead>
              <tbody>
                {/* Show only last 5 complaints */}
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                    <td>
                      <div className="font-bold">{complaint.title}</div>
                      <div className="text-sm opacity-50 truncate w-48">{complaint.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">{complaint.category}</span>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge border-0 font-semibold ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    
                    {/* NEW: Chat Action Button */}
                    <td>
                      <Link 
                        to={`/complaint/${complaint._id}`} 
                        className="btn btn-ghost btn-sm btn-circle text-primary tooltip" 
                        data-tip="View & Chat"
                      >
                        <FiMessageSquare size={18} />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;