import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // Animation library

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Login Successful!');
        
        // Redirect based on role
        if(response.data.role === 'admin') {
           navigate('/admin-dashboard');
        } else {
           navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT SIDE - FORM */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-10"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
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
                className="input input-bordered w-full focus:input-primary" 
                required
              />
            </div>

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
                className="input input-bordered w-full focus:input-primary" 
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-primary">Forgot password?</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg shadow-lg hover:shadow-xl transition-all">
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - VISUAL */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-secondary justify-center items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rotate-12 transform scale-150 translate-x-10 translate-y-10"></div>
        <div className="z-10 text-center text-white p-10">
          <h2 className="text-5xl font-bold mb-6">Campus Voice</h2>
          <p className="text-xl max-w-md mx-auto leading-relaxed">
            The easiest way to raise complaints and track resolutions in real-time.
            Join thousands of students making our campus better.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;