import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Image,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types/property';
import { updateProperty } from '../services/propertyService';
import { uploadImage } from '../services/imageService';

interface EditPropertyFormProps {
  property: Property;
  onPropertyUpdated?: () => void;
}

export const EditPropertyForm = ({ property, onPropertyUpdated }: EditPropertyFormProps) => {
  const [formData, setFormData] = useState<Property>(property);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const navigate = useNavigate();

  // Ensure formData stays synced with property prop
  useEffect(() => {
    setFormData(property);
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    // Handle numeric fields
    if (['price', 'bedrooms', 'bathrooms', 'squareFeet'].includes(name)) {
      processedValue = parseFloat(value) || 0;
    }
    // Handle features array
    else if (name === 'features') {
      processedValue = value.split(',').map(item => item.trim()).filter(Boolean);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageUrl = await uploadImage(file);
        return imageUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImageUrls]
      }));

      toast({
        title: 'Images uploaded',
        description: 'Images have been successfully uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProperty(formData);

      toast({
        title: 'Property updated',
        description: 'The property has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onPropertyUpdated?.();
      navigate(`/property/${property.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update property',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Bedrooms</FormLabel>
          <Input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Bathrooms</FormLabel>
          <Input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Square Feet</FormLabel>
          <Input
            name="squareFeet"
            type="number"
            value={formData.squareFeet}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Images</FormLabel>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadingImage}
            leftIcon={<AddIcon />}
            mb={4}
          >
            Add Images
          </Button>

          <Box maxH="300px" overflowY="auto">
            {formData.images?.map((imageUrl, index) => (
              <HStack key={index} mb={2}>
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <IconButton
                  aria-label="Remove image"
                  icon={<DeleteIcon />}
                  onClick={() => handleImageRemove(imageUrl)}
                  colorScheme="red"
                  size="sm"
                />
              </HStack>
            ))}
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>Features (comma-separated)</FormLabel>
          <Input
            name="features"
            value={formData.features?.join(', ') || ''}
            onChange={handleChange}
            placeholder="e.g. Garage, Pool, Garden"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="for-sale">For Sale</option>
            <option value="for-rent">For Rent</option>
            <option value="sold">Sold</option>
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isLoading}
          width="full"
        >
          Update Property
        </Button>
      </VStack>
    </form>
  );
};
