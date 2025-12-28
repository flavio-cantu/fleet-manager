
export interface User {
  id: number;
  name: string;
  documentApprover: boolean;
  username: string;
  email: string;

  roles?: string[];
}