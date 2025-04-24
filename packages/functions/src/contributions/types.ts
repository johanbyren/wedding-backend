export interface Contribution {
  contributionId: string;
  weddingId: string;
  userId: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContributionInput {
  weddingId: string;
  userId: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
}

export interface UpdateContributionInput {
  amount?: number;
  message?: string;
  isAnonymous?: boolean;
} 