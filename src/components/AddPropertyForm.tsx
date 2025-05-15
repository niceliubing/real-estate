import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import type { Property } from '../types/property';
import { saveProperty } from '../services/propertyService';
import { uploadImage } from '../services/imageService';

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  address: HTMLInputElement;
  price: HTMLInputElement;
  bedrooms: HTMLInputElement;
  bathrooms: HTMLInputElement;
  squareFeet: HTMLInputElement;
  description: HTMLTextAreaElement;
  features: HTMLInputElement;
  type: HTMLSelectElement;
  status: HTMLSelectElement;
}

interface PropertyFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface AddPropertyFormProps {
  onPropertyAdded?: () => void;
}

export const AddPropertyForm = ({ onPropertyAdded }: AddPropertyFormProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const formRef = useRef<PropertyFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prevImages) => [...prevImages, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages: File[]) => prevImages.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls: string[]) => {
      const newUrls = prevUrls.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevUrls[index]); // Clean up the URL
      return newUrls;
    });
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      // Reset all form fields to their default values
      const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
      inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
        input.value = '';
      });
    }

    // Clear image previews and selected images
    previewUrls.forEach((url: string) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedImages([]);
  };

  const handleSubmit = async (e: React.FormEvent<PropertyFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedImages.length === 0) {
        throw new Error('Please select at least one image');
      }

      const form = e.currentTarget;
      const elements = form.elements;

      // Get form values
      const title = elements.title.value;
      const address = elements.address.value;
      const price = elements.price.value;
      const bedrooms = elements.bedrooms.value;
      const bathrooms = elements.bathrooms.value;
      const squareFeet = elements.squareFeet.value;
      const description = elements.description.value;
      const features = elements.features.value;
      const type = elements.type.value as Property['type'];
      const status = elements.status.value as Property['status'];

      // Validate required fields
      if (!title || !address || !price || !bedrooms || !bathrooms ||
          !squareFeet || !description || !features || !type || !status) {
        throw new Error('All fields are required');
      }

      // Validate numeric fields
      const priceNum = Number(price);
      const bedroomsNum = Number(bedrooms);
      const bathroomsNum = Number(bathrooms);
      const squareFeetNum = Number(squareFeet);

      if (isNaN(priceNum) || isNaN(bedroomsNum) ||
          isNaN(bathroomsNum) || isNaN(squareFeetNum)) {
        throw new Error('Invalid numeric values');
      }

      // Upload images first
      const uploadedImageUrls = await Promise.all(
        selectedImages.map((file: File) => uploadImage(file))
      );

      // Make sure we have the image URLs
      if (uploadedImageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }

      const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        address,
        price: priceNum,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        squareFeet: squareFeetNum,
        description,
        images: uploadedImageUrls, // Use the uploaded image URLs
        features: features.split(',')
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
        type,
        status
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
          {/* Image Upload Section */}
          <FormControl isRequired>
            <FormLabel>Property Images</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              hidden
              ref={fileInputRef}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              colorScheme="blue"
              mb={4}
            >
              Select Images
            </Button>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} mb={4}>
                {previewUrls.map((url, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Button
                      size="sm"
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </FormControl>

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
            <FormLabel>Features (comma-separated)</FormLabel>
            <Input name="features" placeholder="Enter features, separated by commas" />
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