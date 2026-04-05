import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiSend, FiType, FiGrid, FiAlertTriangle, FiFileText } from 'react-icons/fi';

const LodgeComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic', 
    severity: 'Low'       
  });

  const { title, description, category, severity } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/complaints', formData, config);
      
      toast.success('Complaint Submitted Successfully!');
      navigate('/dashboard'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4">
      {/* Background Decor (Optional subtle blobs) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="card bg-white shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FiFileText className="text-white/80" /> 
              Lodge a Complaint
            </h1>
            <p className="opacity-90 mt-2 text-sm md:text-base">
              We are here to help. Fill in the details below and we'll track it to resolution.
            </p>
          </div>

          <div className="p-8 md:p-10 bg-white">
            <form onSubmit={onSubmit} className="space-y-8">
              
              {/* SECTION 1: BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title Input */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700 flex items-center gap-2">
                      <FiType className="text-primary" /> Issue Title
                    </span>
                  </label>
                  <input 
                    type="text" 
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Briefly summarize the issue..." 
                    className="input input-bordered w-full h-12 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50 focus:bg-white" 
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700 flex items-center gap-2">
                      <FiGrid className="text-primary" /> Category
                    </span>
                  </label>
                  <select 
                    name="category"
                    value={category}
                    onChange={onChange}
                    className="select select-bordered w-full h-12 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Mess">Mess / Food</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Wi-Fi">Wi-Fi / Internet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* SECTION 2: DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                 {/* Severity Dropdown */}
                 <div className="form-control w-full md:col-span-1">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700 flex items-center gap-2">
                      <FiAlertTriangle className="text-primary" /> Urgency
                    </span>
                  </label>
                  <select 
                    name="severity"
                    value={severity}
                    onChange={onChange}
                    className={`select select-bordered w-full h-12 border-l-4 ${
                      severity === 'High' ? 'border-l-red-500' : 
                      severity === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                    } bg-gray-50 focus:bg-white`}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                {/* Description Textarea */}
                <div className="form-control w-full md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700">Detailed Description</span>
                  </label>
                  <textarea 
                    name="description"
                    value={description}
                    onChange={onChange}
                    className="textarea textarea-bordered h-32 w-full text-base leading-relaxed bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Please describe exactly what happened, where, and when..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="divider"></div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 hidden sm:block">
                  * All fields are mandatory
                </p>
                <button 
                  type="submit" 
                  className={`btn btn-primary btn-lg px-10 text-white shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {!loading && <FiSend className="mr-2" />}
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LodgeComplaint;