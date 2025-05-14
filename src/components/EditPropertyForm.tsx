import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types/property';
import { updateProperty } from '../services/propertyService';

interface EditPropertyFormProps {
  property: Property;
  onPropertyUpdated?: () => void;
}

export const EditPropertyForm = ({ property, onPropertyUpdated }: EditPropertyFormProps) => {
  const [formData, setFormData] = useState(property);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    // Handle numeric fields
    if (['price', 'bedrooms', 'bathrooms', 'squareFeet'].includes(name)) {
      processedValue = Number(value);
    }
    // Handle arrays
    else if (['images', 'features'].includes(name)) {
      processedValue = value.split('|').map(item => item.trim()).filter(Boolean);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
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

        <FormControl isRequired>
          <FormLabel>Images (pipe-separated URLs)</FormLabel>
          <Input
            name="images"
            value={formData.images.join(' | ')}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Features (pipe-separated)</FormLabel>
          <Input
            name="features"
            value={formData.features.join(' | ')}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="apartment">Apartment</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="for-sale">For Sale</option>
            <option value="for-rent">For Rent</option>
            <option value="sold">Sold</option>
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          isLoading={isLoading}
        >
          Update Property
        </Button>
      </VStack>
    </form>
  );
};
