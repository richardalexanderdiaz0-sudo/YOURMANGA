
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Chrome, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión con Google.' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: '¡Cuenta creada!', description: 'Bienvenido a Yourmanga.' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: '¡Hola de nuevo!', description: 'Has iniciado sesión correctamente.' });
      }
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-pink-50 to-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto w-20 h-20 bg-primary rounded-[32px] flex items-center justify-center cartoon-shadow border-4 border-white animate-bounce">
          <Flame className="text-white" size={40} />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tighter text-primary">Yourmanga</h1>
          <p className="text-muted-foreground font-medium mt-2">La aventura comienza aquí.</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] cartoon-border cartoon-shadow space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleGoogleLogin} 
              variant="outline" 
              disabled={loading}
              className="w-full h-14 rounded-2xl border-2 border-pink-50 hover:bg-pink-50 gap-3 font-bold text-md transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Chrome size={20} className="text-primary" />} 
              Continuar con Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-pink-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-muted-foreground font-bold">O CON CORREO</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase ml-1">Email</Label>
              <Input 
                type="email" 
                placeholder="tu@email.com" 
                className="rounded-xl border-2 border-pink-50 h-12 focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase ml-1">Contraseña</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="rounded-xl border-2 border-pink-50 h-12 focus:border-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-bold text-lg gap-2 cartoon-shadow transition-all active:scale-95">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'CREAR CUENTA' : 'ENTRAR'} <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          <button 
            type="button"
            disabled={loading}
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold text-xs uppercase tracking-widest hover:underline disabled:opacity-50"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </main>
  );
}
