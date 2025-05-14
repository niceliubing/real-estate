import { useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Textarea } from '@chakra-ui/textarea';
import { Select } from '@chakra-ui/select';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import type { Property } from '../types/property';
import { saveProperty } from '../services/propertyService';

interface AddPropertyFormProps {
  onPropertyAdded?: () => void;
}

export const AddPropertyForm = ({ onPropertyAdded }: AddPropertyFormProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      // Reset all form fields to their default values
      const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
      inputs.forEach(input => {
        input.value = '';
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Get form values with validation
      const title = formData.get('title')?.toString() || '';
      const address = formData.get('address')?.toString() || '';
      const price = formData.get('price')?.toString() || '';
      const bedrooms = formData.get('bedrooms')?.toString() || '';
      const bathrooms = formData.get('bathrooms')?.toString() || '';
      const squareFeet = formData.get('squareFeet')?.toString() || '';
      const description = formData.get('description')?.toString() || '';
      const images = formData.get('images')?.toString() || '';
      const features = formData.get('features')?.toString() || '';
      const type = formData.get('type')?.toString() || '';
      const status = formData.get('status')?.toString() || '';

      // Validate required fields
      if (!title || !address || !price || !bedrooms || !bathrooms ||
          !squareFeet || !description || !images || !features || !type || !status) {
        throw new Error('All fields are required');
      }

      // Parse numeric values
      const priceNum = Number(price);
      const bedroomsNum = Number(bedrooms);
      const bathroomsNum = Number(bathrooms);
      const squareFeetNum = Number(squareFeet);

      // Validate numeric fields
      if (isNaN(priceNum) || isNaN(bedroomsNum) ||
          isNaN(bathroomsNum) || isNaN(squareFeetNum)) {
        throw new Error('Invalid numeric values');
      }

      // Parse arrays
      const imageList = images.split('|')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      const featureList = features.split('|')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);

      // Validate arrays
      if (imageList.length === 0 || featureList.length === 0) {
        throw new Error('Images and features cannot be empty');
      }

      // Validate property type
      if (!['house', 'condo', 'townhouse', 'apartment'].includes(type)) {
        throw new Error('Invalid property type');
      }

      // Validate status
      if (!['for-sale', 'for-rent', 'sold'].includes(status)) {
        throw new Error('Invalid property status');
      }

      const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        address,
        price: priceNum,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        squareFeet: squareFeetNum,
        description,
        images: imageList,
        features: featureList,
        type: type as Property['type'],
        status: status as Property['status']
      };

      await saveProperty(newProperty);

      toast({
        title: 'Property added',
        description: 'The property has been successfully added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      resetForm();

      // Notify parent component
      onPropertyAdded?.();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add property. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
        <Box display="flex" flexDirection="column" gap={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" placeholder="Enter property title" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Input name="address" placeholder="Enter property address" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              type="number"
              min={0}
              placeholder="Enter price"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Bedrooms</FormLabel>
            <Input
              name="bedrooms"
              type="number"
              min={0}
              placeholder="Number of bedrooms"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Bathrooms</FormLabel>
            <Input
              name="bathrooms"
              type="number"
              min={0}
              placeholder="Number of bathrooms"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Square Feet</FormLabel>
            <Input
              name="squareFeet"
              type="number"
              min={0}
              placeholder="Square footage"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" placeholder="Enter property description" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Images (pipe-separated URLs)</FormLabel>
            <Input name="images" placeholder="Enter image URLs, separated by | character" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Features (pipe-separated)</FormLabel>
            <Input name="features" placeholder="Enter features, separated by | character" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Select name="type" placeholder="Select property type">
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select name="status" placeholder="Select property status">
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
              <option value="sold">Sold</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            isLoading={isLoading}
            mt={4}
          >
            Add Property
          </Button>
        </Box>
      </Box>
    </form>
  );
};