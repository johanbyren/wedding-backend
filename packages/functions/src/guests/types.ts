export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: boolean;
  plusOne: boolean;
  dietaryRestrictions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestInput {
  name: string;
  email: string;
  plusOne: boolean;
  dietaryRestrictions?: string;
}

export interface UpdateGuestInput {
  name?: string;
  email?: string;
  rsvp?: boolean;
  plusOne?: boolean;
  dietaryRestrictions?: string;
} 