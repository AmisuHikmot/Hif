'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertCircle, Loader2 } from 'lucide-react';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  eventReminders: boolean;
  donationUpdates: boolean;
  communityDigest: boolean;
  generalAnnouncements: boolean;
}

const PREFERENCE_GROUPS = [
  {
    label: 'Essential',
    description: 'Important account and security notifications',
    preferences: [
      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive emails for important updates' },
      { key: 'generalAnnouncements', label: 'General Announcements', description: 'Announcements about our services' }
    ]
  },
  {
    label: 'Community & Events',
    description: 'Stay updated about community activities',
    preferences: [
      { key: 'eventReminders', label: 'Event Reminders', description: 'Notifications for upcoming events' },
      { key: 'communityDigest', label: 'Community Digest', description: 'Weekly community activity summary' }
    ]
  },
  {
    label: 'Donations & Support',
    description: 'Updates about your donations and support',
    preferences: [
      { key: 'donationUpdates', label: 'Donation Updates', description: 'Impact reports for your donations' }
    ]
  },
  {
    label: 'Marketing',
    description: 'Promotional and marketing communications',
    preferences: [
      { key: 'newsletter', label: 'Newsletter', description: 'Subscribe to our newsletter' },
      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive SMS notifications' }
    ]
  }
];

export function NotificationPreferences() {
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/profile/notifications');

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data);
      setChanged(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preferences';
      setError(message);
      console.error('[v0] Fetch preferences error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
    setChanged(true);
  };

  const handleSave = async () => {
    try {
      if (!preferences) return;

      setSaving(true);
      setError(null);

      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      setChanged(false);

      toast({
        title: 'Success',
        description: 'Notification preferences updated'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save preferences';
      setError(message);
      console.error('[v0] Save preferences error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
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
          <Bell className="h-5 w-5" />
          <div>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {preferences && (
          <>
            {PREFERENCE_GROUPS.map((group) => (
              <div key={group.label} className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">{group.label}</h3>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>

                <div className="space-y-2">
                  {group.preferences.map((pref) => (
                    <label
                      key={pref.key}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={preferences[pref.key as keyof NotificationPreferences]}
                        onChange={() => handleToggle(pref.key as keyof NotificationPreferences)}
                        className="mt-1"
                        disabled={saving}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {group !== PREFERENCE_GROUPS[PREFERENCE_GROUPS.length - 1] && (
                  <div className="border-t pt-4" />
                )}
              </div>
            ))}

            <div className="pt-4 border-t flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!changed || saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
              {changed && (
                <span className="text-sm text-amber-600 flex items-center">
                  You have unsaved changes
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
