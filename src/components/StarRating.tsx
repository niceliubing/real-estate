import { HStack, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating = ({ rating, onRatingChange, readonly = false }: StarRatingProps) => {
  return (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Icon
          key={value}
          as={FaStar}
          boxSize={5}
          color={value <= rating ? 'yellow.400' : 'gray.200'}
          cursor={readonly ? 'default' : 'pointer'}
          onClick={!readonly && onRatingChange ? () => onRatingChange(value) : undefined}
          _hover={!readonly ? {
            color: 'yellow.400',
            transform: 'scale(1.1)',
          } : undefined}
          transition={!readonly ? 'all 0.2s' : undefined}
        />
      ))}
    </HStack>
  );
};
