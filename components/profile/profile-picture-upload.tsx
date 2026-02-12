'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, AlertCircle } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess: () => void;
  userId: string;
}

export function ProfilePictureUpload({
  currentImageUrl,
  onUploadSuccess,
  onDeleteSuccess,
  userId
}: ProfilePictureUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPEG, PNG, or WebP image');
        return;
      }

      if (file.size > maxSizeBytes) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setLoading(true);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/picture/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();

      onUploadSuccess(data.url);

      toast({
        title: 'Success',
        description: 'Profile picture updated'
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      setPreview(currentImageUrl || null);
      console.error('[v0] Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!currentImageUrl) return;

      setLoading(true);
      setError(null);

      const response = await fetch('/api/profile/picture/upload', {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      setPreview(null);
      onDeleteSuccess();

      toast({
        title: 'Success',
        description: 'Profile picture removed'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      console.error('[v0] Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        {/* Current or Preview Image */}
        <div className="relative w-32 h-32 mx-auto">
          {preview ? (
            <Image
              src={preview}
              alt="Profile picture preview"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No picture</span>
            </div>
          )}
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
        />

        {/* Upload Button */}
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? 'Uploading...' : 'Upload Picture'}
        </Button>

        {/* Delete Button */}
        {preview && currentImageUrl && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Picture
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        JPEG, PNG, or WebP • Max 5MB • Recommended: 400×400px
      </p>
    </div>
  );
}
