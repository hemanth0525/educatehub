
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login, register, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    teachingExperience: '',
    expertise: '',
    qualifications: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    teachingExperience: '',
    expertise: '',
    qualifications: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '',
      teachingExperience: '',
      expertise: '',
      qualifications: ''
    };
    
    if (type === 'register' && !formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (type === 'register' && formData.role === 'tutor') {
      if (!formData.teachingExperience) {
        newErrors.teachingExperience = 'Teaching experience is required for tutors';
        valid = false;
      }
      if (!formData.expertise) {
        newErrors.expertise = 'Area of expertise is required for tutors';
        valid = false;
      }
      if (!formData.qualifications) {
        newErrors.qualifications = 'Qualifications are required for tutors';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        const tutorDetails = formData.role === 'tutor' ? {
          teachingExperience: formData.teachingExperience,
          expertise: formData.expertise,
          qualifications: formData.qualifications
        } : undefined;

        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'login' ? 'Log In to Your Account' : 'Create an Account'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Student
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="tutor"
                    checked={formData.role === 'tutor'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Tutor
                </label>
              </div>
            </div>

            {formData.role === 'tutor' && (
              <>
                <div className="mb-4">
                  <label htmlFor="teachingExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Teaching Experience
                  </label>
                  <input
                    id="teachingExperience"
                    name="teachingExperience"
                    type="text"
                    value={formData.teachingExperience}
                    onChange={handleChange}
                    placeholder="e.g., 5 years of teaching web development"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.teachingExperience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.teachingExperience && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.teachingExperience}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                    Area of Expertise
                  </label>
                  <input
                    id="expertise"
                    name="expertise"
                    type="text"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Data Science"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.expertise ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.expertise && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.expertise}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualifications
                  </label>
                  <input
                    id="qualifications"
                    name="qualifications"
                    type="text"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="e.g., MSc in Computer Science, Certified Instructor"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.qualifications ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.qualifications && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.qualifications}</p>
                  )}
                </div>
              </>
            )}
          </>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              formErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === 'login' ? 'Logging in...' : 'Creating account...'}
            </span>
          ) : (
            <>{type === 'login' ? 'Log In' : 'Create Account'}</>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </Link>
          </p>
        )}
      </div>
      
      {type === 'login' && (
        <div className="mt-2 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
