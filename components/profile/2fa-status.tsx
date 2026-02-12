'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TwoFAStatus {
  is_enabled: boolean;
  setup_at: string | null;
  verified_at: string | null;
  has_backup_codes: boolean;
}

export function TwoFAStatus() {
  const { toast } = useToast();
  const router = useRouter();

  const [status, setStatus] = useState<TwoFAStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/status');

      if (!response.ok) {
        throw new Error('Failed to fetch 2FA status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load status';
      setError(message);
      console.error('[v0] Fetch 2FA status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = () => {
    router.push('/auth/setup-2fa');
  };

  const handleDisable = async () => {
    try {
      setActionLoading(true);
      setError(null);

      // Prompt for password confirmation
      const password = prompt('Enter your password to disable 2FA:');
      if (!password) {
        return;
      }

      const response = await fetch('/api/auth/2fa/status', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      toast({
        title: 'Success',
        description: '2FA has been disabled'
      });

      await fetchStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disable 2FA';
      setError(message);
      console.error('[v0] Disable 2FA error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Secure your account with 2FA</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <div>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Secure your account with 2FA</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status?.is_enabled ? (
          <>
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                2FA is enabled. Your account is protected.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              {status.verified_at && (
                <div>
                  <span className="text-muted-foreground">Enabled since:</span>
                  <p className="font-medium">
                    {new Date(status.verified_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Backup codes:</span>
                <p className="font-medium">
                  {status.has_backup_codes ? 'Available' : 'Not available'}
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </>
        ) : (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                2FA is not enabled. We recommend enabling it for better security.
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground">
              Two-Factor Authentication adds an extra layer of security to your account by requiring a code from your authenticator app in addition to your password.
            </p>

            <Button
              onClick={handleSetup}
              disabled={actionLoading}
              className="w-full"
            >
              Setup 2FA
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
