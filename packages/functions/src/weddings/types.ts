export type WeddingVisibility = "public" | "password" | "private";

export interface Wedding {
  weddingId: string;
  userId: string;
  title: string;
  date: string;
  location: string;
  story: string;
  coverPhotoUrl: string;
  additionalPhotos: string[];
  visibility: WeddingVisibility;
  customUrl: string;
  theme: string;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeddingInput {
  userId: string;
  title: string;
  date: string;
  location: string;
  story: string;
  coverPhotoUrl: string;
  additionalPhotos: string[];
  visibility: WeddingVisibility;
  customUrl: string;
  theme: string;
  primaryColor: string;
}

export interface UpdateWeddingInput {
  title?: string;
  date?: string;
  location?: string;
  story?: string;
  coverPhotoUrl?: string;
  additionalPhotos?: string[];
  visibility?: WeddingVisibility;
  customUrl?: string;
  theme?: string;
  primaryColor?: string;
} 