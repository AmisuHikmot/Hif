'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

export function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mode, setMode] = useState<'totp' | 'backup'>('totp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  // Get the session data (should be passed from login flow)
  const sessionToken = searchParams.get('session');

  const verifyCode = async () => {
    try {
      if (mode === 'totp' && (!code || code.length !== 6)) {
        setError('Please enter a 6-digit code');
        return;
      }

      if (mode === 'backup' && !code) {
        setError('Please enter a backup code');
        return;
      }

      setLoading(true);
      setError(null);

      // This would typically be handled by your auth flow
      // For now, we'll show the structure
      console.log('[v0] Verifying 2FA code:', { mode, code });

      // In a real implementation, this would verify with your backend
      // and set up a proper authenticated session
      
      // Simulate verification
      const isValid = code === '000000'; // Demo only

      if (!isValid) {
        setRemainingAttempts(prev => {
          const remaining = prev - 1;
          if (remaining === 0) {
            setError('Too many failed attempts. Please try again in 15 minutes.');
          }
          return remaining;
        });
        setError('Invalid code');
        return;
      }

      toast({
        title: 'Success',
        description: 'You have been authenticated'
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      console.error('[v0] Verify 2FA error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            {mode === 'totp'
              ? 'Enter the 6-digit code from your authenticator app'
              : 'Enter one of your backup codes'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === 'totp' ? 'Verification Code' : 'Backup Code'}
            </label>
            <Input
              type="text"
              inputMode={mode === 'totp' ? 'numeric' : 'text'}
              placeholder={mode === 'totp' ? '000000' : 'XXXX-XXXX'}
              value={code}
              onChange={(e) => {
                if (mode === 'totp') {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                } else {
                  setCode(e.target.value.toUpperCase().slice(0, 9)); // XXXX-XXXX
                }
              }}
              maxLength={mode === 'totp' ? 6 : 9}
              className={mode === 'totp' ? 'text-center text-2xl tracking-widest' : ''}
              disabled={loading}
              autoFocus
            />
          </div>

          {mode === 'totp' && remainingAttempts <= 3 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {remainingAttempts} attempts remaining
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={verifyCode}
            className="w-full"
            disabled={loading || (mode === 'totp' && code.length !== 6) || (mode === 'backup' && !code)}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>

          <div className="pt-4 border-t">
            {mode === 'totp' ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Don't have your authenticator app?
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode('backup');
                    setCode('');
                    setError(null);
                  }}
                  className="w-full"
                  disabled={loading}
                >
                  Use Backup Code
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Have your authenticator app?
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode('totp');
                    setCode('');
                    setError(null);
                  }}
                  className="w-full"
                  disabled={loading}
                >
                  Use Authenticator App
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Make sure your device time is synced correctly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
