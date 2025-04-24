export type GiftStatus = "available" | "reserved" | "purchased";

export interface Gift {
  giftId: string;
  weddingId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: GiftStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGiftInput {
  weddingId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status?: GiftStatus;
}

export interface UpdateGiftInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  status?: GiftStatus;
} 