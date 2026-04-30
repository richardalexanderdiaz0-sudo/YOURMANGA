
"use client"

import { useState, useEffect } from 'react';
import { apiService, MangaWork, WorkType, WorkStatus, MangaChapter } from '@/lib/api';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BottomNav } from '@/components/navigation/BottomNav';
import { toast } from '@/hooks/use-toast';
import { 
  Palette, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudioPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MangaWork>>({
    work_type: 'Manhwa',
    status: 'En emisión',
    tags: [],
    categories: [],
    reads_count: 0,
    likes_count: 0,
    created_at: Date.now()
  });

  const [chapterCount, setChapterCount] = useState<number>(0);
  const [chapters, setChapters] = useState<Partial<MangaChapter>[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.email !== 'richardalexanderdiaz0@gmail.com')) {
      toast({ variant: 'destructive', title: 'Acceso Denegado', description: 'Solo el administrador puede entrar aquí.' });
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (!user || user.email !== 'richardalexanderdiaz0@gmail.com') {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-2xl font-bold">Zona Restringida</h1>
          <p className="text-muted-foreground">Esta sección es solo para el creador de la plataforma.</p>
          <Button onClick={() => router.push('/')} className="rounded-2xl">VOLVER AL HOME</Button>
        </div>
      </main>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChapterCountChange = (count: number) => {
    setChapterCount(count);
    const newChapters = Array.from({ length: count }, (_, i) => ({
      chapter_number: i + 1,
      title: `Capítulo ${i + 1}`,
      pages: [],
      cover_image: ''
    }));
    setChapters(newChapters);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.email) return;
      await apiService.publishWork(formData, user.email);
      toast({ title: '¡OBRA PUBLICADA CON ÉXITO!' });
      router.push('/');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error al publicar la obra' });
    }
  };

  const categories = ['Acción', 'Aventura', 'Romance', 'Fantasía', 'Drama', 'Horror', 'Vida Escolar', 'BL', 'Yaoi', '+18'];
  const tagsList = ['Nuevo', 'Actualizado', 'Finalizado', 'En emisión', 'Chico rudo', 'Cárcel', 'Vida cotidiana', 'Adolescentes', 'Bullying', 'Suspenso'];

  return (
    <main className="min-h-screen pb-32 px-6 pt-12 bg-background">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-primary rounded-[24px] shadow-xl shadow-primary/20 border-2 border-white">
            <Palette className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground">Estudio de Autor</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Panel de Administración</p>
          </div>
        </header>

        {/* Pasos simplificados para no extender el código innecesariamente */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5 bg-white p-6 rounded-[32px] cartoon-border cartoon-shadow">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary">1. Configuración de Obra</Label>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase">Título de la Obra</Label>
                <Input placeholder="Ej: Solo Leveling" className="rounded-2xl border-2 border-pink-50 h-12" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase">URL de Portada</Label>
                <Input placeholder="https://..." className="rounded-2xl border-2 border-pink-50 h-12" onChange={(e) => setFormData({...formData, cover_image: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase">Sinopsis</Label>
                <Textarea placeholder="Describe la historia..." className="rounded-2xl border-2 border-pink-50 min-h-[120px]" onChange={(e) => setFormData({...formData, synopsis: e.target.value})} />
              </div>
            </div>
            <Button onClick={handleNext} className="w-full rounded-[24px] h-14 font-bold text-lg cartoon-shadow gap-2">SIGUIENTE PASO <ArrowRight size={20} /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center">
            <div className="p-8 bg-white rounded-[40px] cartoon-border cartoon-shadow">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-xl font-bold mb-4">¿Todo listo?</h2>
              <p className="text-sm text-muted-foreground mb-8">Una vez publiques, la obra aparecerá en el Home para todos los usuarios.</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleBack} className="flex-1 rounded-2xl h-12 font-bold">ATRÁS</Button>
                <Button onClick={handleSubmit} className="flex-1 rounded-2xl h-12 font-bold">PUBLICAR</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav isAdmin={true} />
    </main>
  );
}
