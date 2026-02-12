'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export function PasswordChangeForm() {
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    calculatePasswordStrength(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!currentPassword) {
        setError('Current password is required');
        return;
      }

      if (!newPassword) {
        setError('New password is required');
        return;
      }

      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (currentPassword === newPassword) {
        setError('New password must be different from current password');
        return;
      }

      setLoading(true);

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // Verify current password by attempting sign in
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.email) {
        throw new Error('Unable to verify identity');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword
      });

      if (signInError) {
        setError('Current password is incorrect');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Record password change in profile
      const response = await fetch('/api/profile/password', {
        method: 'POST'
      });

      if (!response.ok) {
        console.warn('[v0] Failed to record password change');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(null);

      toast({
        title: 'Success',
        description: 'Password has been changed'
      });

      // Optional: Auto-logout after password change
      // await supabase.auth.signOut();
      // router.push('/auth/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      setError(message);
      console.error('[v0] Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password regularly for security</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password has been updated successfully
              </AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              disabled={loading}
              required
            />
            {passwordStrength && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength === 'weak'
                        ? 'w-1/3 bg-red-500'
                        : passwordStrength === 'medium'
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span
                  className={
                    passwordStrength === 'weak'
                      ? 'text-red-600'
                      : passwordStrength === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }
                >
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} strength
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              At least 8 characters. Use uppercase, lowercase, numbers, and symbols for better security.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            For security, you may be logged out after changing your password
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
