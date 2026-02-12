import { Suspense } from 'react';
import { Verify2FAContent } from './verify-2fa-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Verify2FALoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<Verify2FALoading />}>
      <Verify2FAContent />
    </Suspense>
  );
}
