'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserData = localStorage.getItem('adminUser');
    
    if (!adminToken || !adminUserData) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(adminUserData);
      setAdminUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Depósitos', href: '/admin/depositos', icon: '💰' },
    { name: 'Histórico de Jogadas', href: '/admin/jogadas', icon: '🎮' },
    { name: 'Saques Afiliados', href: '/admin/saques-afiliados', icon: '👥' },
    { name: 'Saques Usuários', href: '/admin/saques-usuarios', icon: '💳' },
    { name: 'Usuários', href: '/admin/usuarios', icon: '👤' },
    { name: 'Afiliados', href: '/admin/afiliados', icon: '🤝' },
    { name: 'Trackeamento', href: '/admin/trackeamento', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">Painel Administrativo</h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full mt-8"
            >
              <span className="mr-3">🚪</span>
              Sair
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 