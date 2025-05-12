'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

export default function ImageUpload({ 
  initialImage = '', 
  onImageUpload,
  className = ''
}: ImageUploadProps) {
  const [image, setImage] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // In a real application, you would upload the image to a storage service
      // For now, we'll just create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageUpload(imageUrl);
      
      // In a real application, you would upload the image to a storage service like this:
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setImage(data.imageUrl);
      // onImageUpload(data.imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = () => {
    setImage('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload an image for your blog post (max 5MB)
        </p>
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {image ? (
        <div className="relative">
          <div className="relative h-48 w-full rounded-md overflow-hidden mb-2">
            <Image
              src={image}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              disabled={isUploading}
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              disabled={isUploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleBrowseClick}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"
        >
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Click to upload an image'}
          </p>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
