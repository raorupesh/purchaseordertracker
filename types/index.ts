export type POStatus = 'pending' | 'confirmed' | 'shipped' | 'received';

export const STATUS_CYCLE: Record<POStatus, POStatus> = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'received',
  received: 'pending',
};

export const STATUS_LABELS: Record<POStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  received: 'Received',
};

export const STATUS_NEXT_LABEL: Record<POStatus, string> = {
  pending: 'Mark Confirmed',
  confirmed: 'Mark Shipped',
  shipped: 'Mark Received',
  received: 'Re-open',
};

export interface LineItem {
  dept: string;
  sku: string;
  upc: string;
  vendorPartNum: string;
  description: string;
  retail: number;
  cost: number;
  extCost: number;
  ctns: number;
  cspk: number;
  extQty: number;
  cube: number;
  kilograms: number;
}

// One entry per status change, oldest first. changedBy is the username of
// whoever triggered advanceStatus see actions/updateStatus.ts.
export interface StatusChangeEntry {
  fromStatus: POStatus;
  toStatus: POStatus;
  changedBy: string;
  changedAt: string; // Timestamp in ISO 8601 format
}

export interface PurchaseOrder {
  poNumber: string;
  refMasterPO: string;
  buyer: string;
  shipTerms: string;
  shipDate: string;
  createdDate: string;
  vendor: string;
  shipTo: string;
  billTo: string;
  brand: string;
  status: POStatus;
  totalCost: number;
  lineItems: LineItem[];
  statusHistory: StatusChangeEntry[];
}

export interface OrderSummary {
  poNumber: string;
  brand: string;
  vendor: string;
  shipDate: string;
  itemCount: number;
  totalCost: number;
  status: POStatus;
  lastUpdatedAt: string | null; // ISO 8601 timestamp of the most recent status change, if any
}

export interface UserProfile {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  position: string;
}

export type PublicUser = Omit<UserProfile, 'password'>;
