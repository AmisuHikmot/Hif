'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface SetupStep {
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
}

export default function Setup2FAPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<'generate' | 'verify' | 'backup'>('generate');
  const [setupData, setSetupData] = useState<SetupStep | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate TOTP setup on mount
  useEffect(() => {
    generateSetup();
  }, []);

  const generateSetup = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to generate 2FA setup');
      }

      const data = await response.json();
      setSetupData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('[v0] Setup 2FA error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a 6-digit code');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Verification failed');
      }

      toast({
        title: 'Success',
        description: '2FA has been enabled'
      });

      setStep('backup');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      console.error('[v0] Verify 2FA error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    if (!setupData?.backupCodes) return;

    const text = setupData.backupCodes.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);

    toast({
      title: 'Copied',
      description: 'Backup codes copied to clipboard'
    });
  };

  const copySecret = () => {
    if (!setupData?.secret) return;

    navigator.clipboard.writeText(setupData.secret);
    toast({
      title: 'Copied',
      description: 'Secret key copied to clipboard'
    });
  };

  const completeSetup = () => {
    router.push('/dashboard/profile');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 'generate' && (
          <>
            <CardHeader>
              <CardTitle>Set Up Two-Factor Authentication</CardTitle>
              <CardDescription>
                Scan the QR code with your authenticator app or enter the secret key manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {setupData && (
                <>
                  {/* QR Code Placeholder */}
                  <div className="bg-muted border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        QR Code would be displayed here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (In production, use a QR code library like qrcode.react)
                      </p>
                      <div className="p-4 bg-background rounded border text-center font-mono text-xs">
                        {setupData.qrCodeUri}
                      </div>
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        {showSecret ? (
                          <code className="flex-1 p-3 bg-muted rounded font-mono text-sm break-all">
                            {setupData.secret}
                          </code>
                        ) : (
                          <div className="flex-1 p-3 bg-muted rounded text-sm text-muted-foreground">
                            ••••••••••••••••
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowSecret(!showSecret)}
                          className="p-2 hover:bg-muted rounded"
                        >
                          {showSecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copySecret}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter this key manually if you can't scan the QR code
                    </p>
                  </div>

                  {/* Next Step */}
                  <Button
                    onClick={() => setStep('verify')}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Next: Verify Setup'}
                  </Button>
                </>
              )}
            </CardContent>
          </>
        )}

        {step === 'verify' && (
          <>
            <CardHeader>
              <CardTitle>Verify Setup</CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app
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
                <label className="text-sm font-medium">Verification Code</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('generate')}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={verifySetup}
                  className="flex-1"
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Make sure your device time is synced correctly
              </p>
            </CardContent>
          </>
        )}

        {step === 'backup' && (
          <>
            <CardHeader>
              <CardTitle>Save Backup Codes</CardTitle>
              <CardDescription>
                Save these codes in a secure location. You can use them to recover your account if you lose access to your authenticator app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Each code can only be used once. Keep them safe!
                </AlertDescription>
              </Alert>

              {setupData && (
                <>
                  <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm max-h-48 overflow-y-auto">
                    {setupData.backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{code}</span>
                        <span className="text-muted-foreground">#{index + 1}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={copyBackupCodes}
                    className="w-full"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Codes
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={completeSetup}
                    className="w-full"
                  >
                    I've Saved My Codes
                  </Button>
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
