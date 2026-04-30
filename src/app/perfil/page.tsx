
"use client"

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Shield, Info, LogOut, ChevronRight, User, LogIn, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    setLoggingOut(true);
    try {
      await signOut(auth);
      toast({ title: 'Sesión cerrada', description: '¡Vuelve pronto a Yourmanga!' });
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al cerrar sesión' });
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  const isAdmin = user?.email === 'richardalexanderdiaz0@gmail.com';

  const menuItems = [
    { icon: Bell, label: 'Notificaciones', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Shield, label: 'Privacidad y Seguridad', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Settings, label: 'Configuración', color: 'text-gray-500', bg: 'bg-gray-50' },
    { icon: Info, label: 'Ayuda y Soporte', color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <main className="min-h-screen pb-32">
      <header className="p-8 pt-12 flex flex-col items-center bg-gradient-to-b from-pink-50/50 to-transparent">
        {user ? (
          <>
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-[40px] cartoon-border border-pink-200 overflow-hidden cartoon-shadow bg-white p-1">
                <Avatar className="w-full h-full rounded-[34px]">
                  <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`} />
                  <AvatarFallback><User size={40} /></AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                <Settings size={16} />
              </div>
            </div>
            <h1 className="text-2xl font-bold font-headline">{user.displayName || 'Lector'}</h1>
            <p className="text-xs font-medium text-primary mt-1">{user.email}</p>
            {isAdmin && <Badge className="mt-4 bg-primary text-white border-none font-bold text-[10px] px-4 py-1.5 cartoon-shadow">ADMINISTRADOR</Badge>}
          </>
        ) : (
          <div className="text-center py-10 space-y-6">
            <div className="w-24 h-24 bg-pink-50 rounded-[32px] flex items-center justify-center mx-auto text-primary cartoon-border border-pink-100">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-headline">¿Aún no te has unido?</h2>
              <p className="text-xs text-muted-foreground mt-2 max-w-[200px] mx-auto">Inicia sesión para guardar tus favoritos y sincronizar tu lectura.</p>
            </div>
            <Button onClick={() => router.push('/login')} className="rounded-2xl h-14 font-bold px-8 cartoon-shadow gap-2 transition-all active:scale-95">
              <LogIn size={20} /> INICIAR SESIÓN
            </Button>
          </div>
        )}
      </header>

      <div className="px-8 mt-6 space-y-4">
        <div className="bg-white rounded-[32px] p-4 cartoon-border border-pink-50 shadow-sm space-y-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx}
                className="w-full flex items-center justify-between p-3 hover:bg-pink-50/30 rounded-2xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            )
          })}
        </div>

        {user && (
          <Button 
            variant="destructive" 
            disabled={loggingOut}
            onClick={handleLogout}
            className="w-full h-14 rounded-[24px] font-bold text-md cartoon-shadow gap-2 mt-4 transition-all active:scale-95"
          >
            {loggingOut ? <Loader2 className="animate-spin" /> : <LogOut size={20} />}
            CERRAR SESIÓN
          </Button>
        )}
        
        <p className="text-[10px] text-center text-muted-foreground mt-10 font-medium uppercase tracking-widest opacity-60">Yourmanga v1.0.0 • Hecho para lectores</p>
      </div>

      <BottomNav isAdmin={isAdmin} />
    </main>
  );
}
