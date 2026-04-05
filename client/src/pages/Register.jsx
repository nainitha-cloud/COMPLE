import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'CSE', // Default department
    role: 'student'    // Default role
  });

  const navigate = useNavigate();
  const { name, email, password, department, role } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Register the user
      const response = await axios.post('/api/auth/register', formData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success(`Welcome, ${response.data.name}! Account created.`);
        
        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      
      {/* LEFT SIDE - VISUAL (Gradient & Text) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 bg-gradient-to-tr from-secondary to-primary justify-center items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 -rotate-12 transform scale-150 -translate-x-10 -translate-y-10"></div>
        <div className="z-10 text-center text-white p-10">
          <h2 className="text-5xl font-bold mb-6">Join CampusVoice</h2>
          <p className="text-xl max-w-md mx-auto leading-relaxed">
            Create an account to track academic issues, hostel complaints, and facilities requests in real-time.
          </p>
        </div>
      </motion.div>

      {/* RIGHT SIDE - REGISTRATION FORM */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-gray-600">Get started with your university credentials</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            
            {/* Name Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe" 
                className="input input-bordered w-full focus:input-secondary" 
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={onChange}
                placeholder="student@university.edu" 
                className="input input-bordered w-full focus:input-secondary" 
                required
              />
            </div>

            <div className="flex gap-4">
              {/* Department Dropdown */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-semibold">Department</span>
                </label>
                <select 
                  name="department" 
                  value={department} 
                  onChange={onChange}
                  className="select select-bordered w-full focus:select-secondary"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Hostel">Hostel Block</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* ROLE SELECTION (New Feature) */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-semibold">Register As</span>
                </label>
                <select 
                  name="role" 
                  value={role} 
                  onChange={onChange}
                  className="select select-bordered w-full focus:select-secondary font-medium"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin (Staff)</option>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input 
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••" 
                className="input input-bordered w-full focus:input-secondary" 
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary w-full text-lg shadow-lg hover:shadow-xl transition-all mt-6">
              Sign Up
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-secondary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;