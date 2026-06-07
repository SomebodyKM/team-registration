import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import zxcvbn from 'zxcvbn';
import { LuTrophy, LuEyeOff, LuEye, LuLoaderCircle, LuX } from 'react-icons/lu';
import { FaRegCircleCheck } from 'react-icons/fa6';
import toast from 'react-hot-toast';

import { useAuthStore } from '../stores/auth.store';
import { setupPassword } from '../api/auth';
import Footer from '../components/Footer';

const PasswordSetup = () => {
  const navigate = useNavigate();
  const { school, setAuth } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Strength check
  const strengthScore = newPassword ? zxcvbn(newPassword).score : 0;
  const strengthWidth = newPassword ? Math.max((strengthScore / 4) * 100, 15) : 0;

  useEffect(() => {
    if (apiError) setApiError(false);
  }, [currentPassword]);

  const getStrengthUI = () => {
    if (strengthScore <= 1)
      return { color: 'bg-[#EF4444]', text: 'Weak', textColor: 'text-[#EF4444]' };
    if (strengthScore === 2)
      return { color: 'bg-[#F59E0B]', text: 'Good', textColor: 'text-[#F59E0B]' };
    return { color: 'bg-[#10B981]', text: 'Strong', textColor: 'text-[#10B981]' };
  };

  const strengthUI = getStrengthUI();
  const isStrongEnough = strengthScore >= 3;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const showConfirmError = confirmPassword.length > 0 && !passwordsMatch;
  const canSubmit = isStrongEnough && passwordsMatch && currentPassword.length > 0;

  const currentBorderClass = apiError
    ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
    : 'border-[#E2E8F0] focus-visible:ring-[#0EA5E9]';
  const confirmBorderClass = showConfirmError
    ? 'border-[#EF4444] focus-visible:ring-[#EF4444]'
    : 'border-[#E2E8F0] focus-visible:ring-[#0EA5E9]';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    const data = await setupPassword({ currentPassword, newPassword });
    setIsSubmitting(false);

    if (data) {
      toast.success(data.message);
      setAuth(data.school);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Failed to update password. Please check your current password and try again.');
      setApiError(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-[#F0F9FF] via-[#E0F2FE] to-[#DDD6FE] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LuTrophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A1628] text-center">Set Your New Password</h1>
          <p className="text-sm font-medium text-[#0EA5E9] mt-1">{school?.schoolName}</p>
          <p className="text-[#64748B] text-center mt-2 text-sm max-w-sm">
            For your security, please update your default password before proceeding.
          </p>
        </div>

        {/* Password Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password Input */}
          <div className="space-y-2">
            <label htmlFor="current-password" className="block text-sm font-medium text-[#0A1628]">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
                className={`flex h-12 w-full rounded-md border-2 bg-white px-3 py-2 pr-10 text-sm text-[#0A1628] transition-colors placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${currentBorderClass}`}
                placeholder="Enter your default password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {showCurrentPassword ? (
                  <LuEyeOff className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="new-password" className="block text-sm font-medium text-[#0A1628]">
                New Password
              </label>
              {newPassword.length > 0 && (
                <span className={`text-xs font-semibold ${strengthUI.textColor}`}>
                  {strengthUI.text}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                className={`flex h-12 w-full rounded-md border bg-white px-3 py-2 pr-10 text-sm text-[#0A1628] transition-colors placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${currentBorderClass}`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {showNewPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Strength Indicator */}
            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-300 ease-out ${strengthUI.color}`}
                style={{ width: `${strengthWidth}%` }}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-[#0A1628]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className={`flex h-12 w-full rounded-md border-2 bg-white px-3 py-2 pr-10 text-sm text-[#0A1628] transition-colors placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${confirmBorderClass}`}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {showConfirmPassword ? (
                  <LuEyeOff className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Match Indicators */}
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-[#EF4444] flex items-center gap-1 mt-1">
                <LuX className="w-4 h-4" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-sm text-[#10B981] flex items-center gap-1 mt-1">
                <FaRegCircleCheck className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#0284C7] px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:from-[#0284C7] hover:to-[#0369A1] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? <LuLoaderCircle className="w-5 h-5 animate-spin" /> : 'Save & Continue'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordSetup;
