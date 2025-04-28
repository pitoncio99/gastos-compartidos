// app/admin-grupos/layout.tsx
import { ReactNode } from 'react';

export const metadata = {
  title: 'Administrar Grupos',
  icons: {
    icon: '/calculadora.svg', // Esto busca el favicon en /public/favicon.ico
  },
};

export default function AdminGruposLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
