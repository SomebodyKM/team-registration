import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { LuTrophy, LuEyeOff, LuEye, LuLoaderCircle } from 'react-icons/lu';
import toast from 'react-hot-toast';

import { useAuthStore } from '../stores/auth.store';
import { getAllSchools } from '../api/options';
import { login } from '../api/auth';
import Select from '../components/ui/Select';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Form state
  const [selectedSchool, setSelectedSchool] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // API state
  const [schools, setSchools] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasError, setHasError] = useState(false);

  // Fetch the school list
  useEffect(() => {
    const fetchSchools = async () => {
      const data = await getAllSchools();
      if (data) {
        setSchools(
          data.map((school) => ({
            label: school.schoolName,
            value: school.schoolName,
          })),
        );
      } else {
        toast.error('Failed to load school list. Please refresh.');
      }
      setIsLoadingSchools(false);
    };

    fetchSchools();
  }, []);

  // Clear error state when user starts typing/selecting again
  useEffect(() => {
    if (hasError) setHasError(false);
  }, [selectedSchool, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchool || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    const data = await login({ schoolName: selectedSchool, password });
    setIsSubmitting(false);

    if (data) {
      toast.success(data.message);
      setAuth(data.school);

      // Redirect based on the first login flag
      if (data.school.isFirstLogin) {
        navigate('/setup-password');
      } else {
        // navigate('/dashboard')
      }
    } else {
      toast.error('Invalid school name or password.');
      setHasError(true);
    }
  };

  const inputBorderClass = hasError
    ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
    : 'border-[#E2E8F0] focus-visible:ring-[#0EA5E9]';
  const selectBorderClass = hasError
    ? 'border-[#EF4444] focus:ring-[#EF4444]'
    : 'border-[#E2E8F0] focus:ring-[#0EA5E9]';

  return (
    <div className="min-h-screen bg-linear-to-r from-[#F0F9FF] via-[#E0F2FE] to-[#DDD6FE] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LuTrophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A1628] text-center">School Portal Login</h1>
          <p className="text-[#64748B] text-center mt-2">Select your school to get started</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Selection */}
          <div className="space-y-2">
            <label htmlFor="school" className="block text-sm font-medium text-[#0A1628]">
              Select Your School
            </label>
            <Select
              id="school"
              value={selectedSchool}
              onChange={setSelectedSchool}
              options={schools}
              placeholder={isLoadingSchools ? 'Loading schools...' : 'Choose your school...'}
              disabled={isLoadingSchools || isSubmitting}
              className={`h-12 ${selectBorderClass}`}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#0A1628]">
              Default Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className={`flex h-12 w-full rounded-md border-2 bg-white px-3 py-2 pr-10 text-sm text-[#0A1628] transition-colors placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${inputBorderClass}`}
                placeholder="Enter your default password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0A1628] transition-colors disabled:opacity-50"
              >
                {showPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedSchool || !password || isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#0284C7] px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:from-[#0284C7] hover:to-[#0369A1] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LuLoaderCircle className="w-5 h-5 animate-spin" /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          First time logging in? You'll be prompted to set a new password.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
