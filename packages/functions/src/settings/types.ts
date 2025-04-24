export interface Settings {
  userId: string;
  name: string;
  email: string;
  
  // Wedding Page Settings
  pageVisibility: string;
  customUrl: string;
  theme: string;
  primaryColor: string;
  
  // Payment Settings
  paymentMethod: string;
  accountEmail: string;
  notifyOnContribution: string;
  autoThankYou: string;
  
  // Notification Settings
  emailNotifications: string;
  contributionAlerts: string;
  weeklyDigest: string;
  marketingEmails: string;
  
  // Privacy Settings
  showContributorNames: string;
  showContributionAmounts: string;
  allowGuestComments: string;
  showRegistry: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse extends Omit<Settings, 
  'notifyOnContribution' | 'autoThankYou' | 
  'emailNotifications' | 'contributionAlerts' | 'weeklyDigest' | 'marketingEmails' |
  'showContributorNames' | 'showContributionAmounts' | 'allowGuestComments' | 'showRegistry'
> {
  notifyOnContribution: boolean;
  autoThankYou: boolean;
  emailNotifications: boolean;
  contributionAlerts: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  showContributorNames: boolean;
  showContributionAmounts: boolean;
  allowGuestComments: boolean;
  showRegistry: boolean;
}

export interface UpdateSettingsInput {
  name?: string;
  email?: string;
  
  // Wedding Page Settings
  pageVisibility?: string;
  customUrl?: string;
  theme?: string;
  primaryColor?: string;
  
  // Payment Settings
  paymentMethod?: string;
  accountEmail?: string;
  notifyOnContribution?: boolean;
  autoThankYou?: boolean;
  
  // Notification Settings
  emailNotifications?: boolean;
  contributionAlerts?: boolean;
  weeklyDigest?: boolean;
  marketingEmails?: boolean;
  
  // Privacy Settings
  showContributorNames?: boolean;
  showContributionAmounts?: boolean;
  allowGuestComments?: boolean;
  showRegistry?: boolean;
} 