import { Navigate } from 'react-router-dom';

interface Props {
  element: JSX.Element;
  role?: string;
}

export default function ProtectedRoute({ element, role }: Props) {
  const user = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (!user) return <Navigate to="/" />;

  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/" />;

  return element;
}
