export enum UserRole {
  STORE = 'STORE',
  FOOTMAN = 'FOOTMAN',
  RIDER = 'RIDER',
}

export enum OrderStatus {
  PENDING_PICKUP = 'Pending Pickup',
  CLAIMED_BY_FOOTMAN = 'Claimed by Footman',
  SHARED_WITH_RIDERS = 'Shared with Riders',
  CLAIMED_BY_RIDER = 'Claimed by Rider',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum OrderUrgency {
  NORMAL = 'Normal',
  URGENT = 'Urgent',
  ASAP = 'ASAP',
}

export interface ConfirmationDetails {
  timestamp: Date;
  method: 'photo_message' | 'signature_checkbox';
  photoFileName?: string; // Changed from photoUrl
  message?: string;
  signatureReceived?: boolean;
  confirmedBy: string; // footmanId or riderId
}

export interface Order {
  id: string;
  storeId: string;
  description: string;
  destination: string;
  urgency: OrderUrgency;
  weight?: string;
  isFragile?: boolean;
  itemPhotoFileName?: string; // New: photo of the item itself
  distanceKm?: number; // New: distance for delivery
  calculatedCost?: number; // New: Customer facing cost in KES
  status: OrderStatus;
  postedAt: Date;
  footmanId?: string;
  riderId?: string;
  pickupConfirmation?: ConfirmationDetails;
  deliveryConfirmation?: ConfirmationDetails;
  sharedByFootmanAt?: Date;
  claimedByRiderAt?: Date;
  deliveredAt?: Date;
  assignedTo?: string; // footmanId or riderId currently responsible
  lastUpdated: Date;
  payout: number; // Payout for this specific order completion in KES
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string; // New: contact phone
  password?: string; // For login simulation
}

export interface DeliveryAgent extends User {
  tasksCompleted: number;
  totalGrossEarnings: number; // Sum of all payouts earned in KES
  // rating?: number;
}

export interface DailyEarningsData {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  totalPayout: number; // Gross payout for the day in KES
  companyShare: number; // In KES
  netEarnings: number; // In KES
  bonusAwarded?: number; // Bonus amount included in netEarnings
}

export interface EarningsViewProps {
  agent: DeliveryAgent;
  allAgentsOfSameType: DeliveryAgent[]; // For calculating rank and bonus eligibility
}


// Used for context
export interface AppState {
  orders: Order[];
  footmen: DeliveryAgent[];
  riders: DeliveryAgent[];
  currentUser: User | DeliveryAgent | null;
  currentRole: UserRole | null; // Can be null if not authenticated
  isAuthenticated: boolean;
  theme: 'light' | 'dark'; // New: For theme switching
}

export interface LoginCredentials {
  identifier: string; // e.g., name or email
  password?: string; // Password is used for simulation
}

export interface SignupCredentials extends User {
  confirmPassword?: string;
}


export interface AppActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void; // New: For theme switching
  postOrder: (orderData: Omit<Order, 'id' | 'status' | 'postedAt' | 'lastUpdated' | 'payout' | 'calculatedCost'> & { storeId: string }) => void;
  claimOrderByFootman: (orderId: string, footmanId: string) => void;
  shareOrderWithRiders: (orderIds: string[], footmanId: string, confirmation: ConfirmationDetails) => void; // Takes multiple order IDs for batch
  deliverOrderByFootman: (orderId: string, footmanId: string, confirmation: ConfirmationDetails) => void;
  claimSharedOrderByRider: (orderId: string, riderId: string) => void;
  confirmRiderPickupFromAgent: (orderId: string, riderId: string, confirmation: ConfirmationDetails) => void;
  deliverOrderByRider: (orderId: string, riderId: string, confirmation: ConfirmationDetails) => void;
}

export interface AppContextType extends AppState, AppActions {}