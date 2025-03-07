export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  turnos: { date: string; start: string; end: string }[];
}
