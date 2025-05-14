import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const fileName = generateUniqueFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', fileName);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { imageUrl } = await response.json();
    return imageUrl; // The server now returns the correct public path
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const generateUniqueFileName = (originalName: string): string => {
  const extension = originalName.split('.').pop();
  const uniqueId = uuidv4();
  const timestamp = new Date().getTime();
  return `${uniqueId}-${timestamp}.${extension}`;
};
