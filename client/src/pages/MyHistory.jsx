import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Added Link
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMessageSquare } from 'react-icons/fi';

const MyHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Complaints
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/complaints', config);
        setComplaints(data);
        setFiltered(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Handle Filtering & Searching
  useEffect(() => {
    let result = complaints;

    if (filterStatus !== 'All') {
      result = result.filter(c => c.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(result);
  }, [filterStatus, searchTerm, complaints]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My History</h1>
          <p className="text-gray-500">Track the status of all your submitted issues.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="input input-bordered pl-10 w-full focus:input-primary bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <select 
            className="select select-bordered focus:select-primary bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
           <div className="text-center py-10">Loading history...</div>
        ) : filtered.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
             <p className="text-gray-400 text-lg">No complaints found matching your criteria.</p>
           </div>
        ) : (
          filtered.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`badge badge-sm ${
                    item.category === 'Academic' ? 'badge-primary' : 
                    item.category === 'Hostel' ? 'badge-secondary' : 'badge-ghost'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
              </div>

              <div className="flex items-center gap-4">
                 <div className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                    item.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-200' :
                    item.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                    'bg-yellow-50 text-yellow-600 border-yellow-200'
                 }`}>
                    {item.status}
                 </div>
                 
                 {/* BUTTON: Open Discussion */}
                 <Link 
                   to={`/complaint/${item._id}`} 
                   className="btn btn-ghost btn-sm btn-circle text-primary tooltip" 
                   data-tip="View & Chat"
                 >
                   <FiMessageSquare size={20} />
                 </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyHistory;