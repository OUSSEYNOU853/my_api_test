
interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}
