
"use client"

import { useState, useEffect } from 'react';
import { apiService, MangaWork } from '@/lib/api';
import { useUser } from '@/firebase';
import { MangaCard } from '@/components/manga/MangaCard';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Countdown } from '@/components/home/Countdown';
import Link from 'next/link';
import { 
  ArrowRight, 
  Flame, 
  Clock, 
  CheckCircle, 
  Grid2X2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { user, isLoading: authLoading } = useUser();
  const [works, setWorks] = useState<MangaWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiService.getWorks();
        setWorks(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const recentlyAdded = [...works].sort((a, b) => b.created_at - a.created_at).slice(0, 10);
  const trending = [...works].sort((a, b) => b.reads_count - a.reads_count).slice(0, 6);
  const finished = works.filter(w => w.status === 'Finalizado').slice(0, 6);
  const upcoming = works.filter(w => w.status === 'Próximamente');
  const dailyUpdates = works.filter(w => w.status === 'En emisión').slice(0, 8);
  
  const isAdmin = user?.email === 'richardalexanderdiaz0@gmail.com';

  if (loading || authLoading) {
    return (
      <main className="min-h-screen pb-24 space-y-10 p-6">
        <Skeleton className="h-10 w-40 mb-6" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-4 overflow-hidden">
              <Skeleton className="min-w-[140px] h-48 rounded-2xl" />
              <Skeleton className="min-w-[140px] h-48 rounded-2xl" />
              <Skeleton className="min-w-[140px] h-48 rounded-2xl" />
            </div>
          </div>
        ))}
        <BottomNav isAdmin={isAdmin} />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary tracking-tighter font-headline">Yourmanga</h1>
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center cartoon-shadow border-2 border-primary/20">
          <Flame className="text-primary" />
        </div>
      </header>

      {/* Featured Banner */}
      <section className="px-6 mb-8">
        <div className="relative h-56 rounded-[32px] overflow-hidden cartoon-border border-pink-200 cartoon-shadow group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/promo/800/400" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Promo"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-pink-500/40 to-transparent flex flex-col justify-center p-8 text-white">
            <Badge className="w-fit mb-3 bg-white text-primary font-bold">¡HOT!</Badge>
            <h2 className="text-2xl font-bold font-headline mb-2 leading-tight">Últimas<br/>Actualizaciones</h2>
            <p className="text-xs opacity-90 max-w-[65%] font-medium">No te pierdas los nuevos capítulos que acaban de aterrizar.</p>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        
        {/* Recently Added */}
        <section className="px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Clock size={22} className="text-primary" /> AÑADIDOS RECIENTEMENTE</h2>
            <Link href="/descubre" className="text-primary text-xs font-bold flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">TODO <ArrowRight size={14} /></Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
            {recentlyAdded.map(work => (
              <div key={work.id} className="min-w-[150px] w-[150px]">
                <MangaCard work={work} />
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        {upcoming.length > 0 && (
          <section className="bg-pink-50/50 py-8 border-y border-pink-100">
            <div className="px-6 mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-primary/80"><Calendar size={22} /> PRÓXIMAMENTE</h2>
            </div>
            <div className="px-6 space-y-4">
              {upcoming.map(work => (
                <div key={work.id} className="bg-white rounded-[24px] p-4 flex gap-5 cartoon-border border-pink-100 shadow-sm transition-transform active:scale-[0.98]">
                  <div className="w-24 aspect-[2/3] relative rounded-xl overflow-hidden flex-shrink-0">
                    <img src={work.cover_image} className="object-cover w-full h-full" alt="" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-sm mb-1 text-foreground">{work.title}</h3>
                    <p className="text-[10px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{work.synopsis}</p>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">LANZAMIENTO EN</span>
                      <Countdown targetDate={work.scheduled_at!} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Daily Updates */}
        <section className="px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Sparkles size={22} className="text-yellow-500" /> ACTUALIZACIONES DIARIAS</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
            {dailyUpdates.map(work => (
              <div key={work.id} className="min-w-[140px] w-[140px]">
                <MangaCard work={work} />
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><Flame size={22} className="text-orange-500" /> TÍTULOS EN TENDENCIA</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {trending.map(work => (
              <MangaCard key={work.id} work={work} />
            ))}
          </div>
        </section>

        {/* All Comics & Manhwas Section */}
        <section id="comics-manhwas" className="px-6">
          <Link href="/descubre" className="flex justify-between items-center mb-5 group">
            <h2 className="text-xl font-bold flex items-center gap-3 group-hover:text-primary transition-colors font-headline">
              <Grid2X2 size={24} className="text-primary" /> CÓMICS Y MANHWAS
            </h2>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={20} />
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-5">
            {works.map(work => (
              <MangaCard key={work.id} work={work} showDetails />
            ))}
          </div>
        </section>

        {/* Finished Section */}
        <section className="px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2 text-green-600"><CheckCircle size={22} /> TERMINADOS</h2>
          </div>
          {finished.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {finished.map(work => (
                <MangaCard key={work.id} work={work} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-[32px] border-2 border-dashed border-pink-200">
               <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
               <p className="text-xs font-bold">No hay títulos terminados por ahora.</p>
            </div>
          )}
        </section>

      </div>

      <BottomNav isAdmin={isAdmin} />
    </main>
  );
}
