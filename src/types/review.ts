export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userEmail: string;
  userName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
