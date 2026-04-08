export interface EcommerceResponse {
  uid: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceCreateRequest {
  name: string;
  slug: string;
}

export interface EcommerceStatusRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ApiKeyResponse {
  keyId: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface ApiKeyCreateResponse {
  keyId: string;
  key: string;
  prefix: string;
  createdAt: string;
}
