
"use client"

import { useState, useEffect } from 'react';
import { apiService, MangaWork, MangaChapter } from '@/lib/api';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  Share2, 
  MoreVertical, 
  Eye, 
  ArrowLeft, 
  PlayCircle,
  Flag,
  ListFilter,
  Heart,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MangaPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [work, setWork] = useState<MangaWork | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [sortAsc, setSortAsc] = useState(false); // Default to newest first
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const w = await apiService.getWorkById(parseInt(id as string));
        setWork(w);
        const c = await apiService.getChaptersByWorkId(parseInt(id as string));
        setChapters(c);
        
        // Check if liked in library
        if (user) {
          const library = await apiService.getLibrary(user.uid);
          setIsLiked(library.some(item => item.manga_id === w.id && item.type === 'like'));
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error al cargar la obra' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user]);

  if (loading || !work) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  const sortedChapters = [...chapters].sort((a, b) => 
    sortAsc ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
  );

  const handleInteraction = async (type: 'like' | 'read') => {
    if (!user) {
      toast({ title: '¡Inicia sesión!', description: 'Debes estar logueado para interactuar.' });
      router.push('/login');
      return;
    }
    try {
      await apiService.interact(work.id, type, user.uid);
      if (type === 'like') {
        setIsLiked(!isLiked);
        toast({ title: !isLiked ? '¡Añadido a favoritos!' : 'Eliminado de favoritos' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    const text = `¡NO DEJO DE LEER ${work.title.toUpperCase()} TE INVITO A LEER EN YOURMANGA!`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: work.title, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast({ title: 'Enlace copiado', description: '¡Compártelo con tus amigos!' });
    }
  };

  const handleReport = () => {
    toast({ 
      title: 'Reporte Enviado', 
      description: 'Gracias por ayudarnos a mantener la comunidad segura. Revisaremos la obra.' 
    });
  };

  const isAdmin = user?.email === 'richardalexanderdiaz0@gmail.com';

  return (
    <main className="min-h-screen bg-background pb-32">
      <div className="relative h-[550px] w-full">
        <div className="absolute inset-0">
          <img 
            src={work.cover_image} 
            className="w-full h-full object-cover" 
            alt={work.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
          <div className="mb-2">
            <Badge className={cn(
              "font-bold cartoon-shadow border-none",
              work.status === 'Finalizado' ? "bg-green-500" : "bg-primary"
            )}>
              {work.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold font-headline mb-3 text-foreground drop-shadow-md">{work.title}</h1>
          <p className="text-sm font-bold text-primary mb-4">{work.work_type} • {work.author}</p>
          
          <div className="flex gap-2 mb-6 overflow-x-auto justify-center max-w-full no-scrollbar pb-1">
            {work.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-pink-50 text-primary text-[10px] font-bold rounded-full border border-pink-100 uppercase whitespace-nowrap">{tag}</span>
            ))}
          </div>
          
          <div className="flex items-center gap-8 text-sm mb-8 text-muted-foreground font-bold">
            <span className="flex items-center gap-2"><Eye size={20} className="text-primary" /> {work.reads_count}</span>
            <span className="flex items-center gap-2"><Star size={20} className={isLiked ? "text-primary fill-primary" : "text-yellow-400"} /> {work.likes_count}</span>
          </div>

          <div className="flex gap-4 w-full max-w-md">
            <Button 
              onClick={() => {
                if (chapters.length > 0) {
                  handleInteraction('read');
                  router.push(`/reader/${sortedChapters[0].id}`);
                }
              }}
              className="flex-1 rounded-[24px] h-14 gap-3 text-lg font-bold cartoon-shadow transition-all active:scale-95"
              disabled={chapters.length === 0}
            >
              <PlayCircle size={24} /> LEER AHORA
            </Button>
            
            <Button onClick={() => handleInteraction('like')} variant="outline" size="icon" className={cn("w-14 h-14 rounded-[24px] border-2 border-pink-100 bg-white shadow-sm transition-all active:scale-95", isLiked && "border-primary bg-pink-50")}>
              <Heart size={24} className={cn(isLiked ? "text-primary fill-primary" : "text-primary")} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-14 h-14 rounded-[24px] border-2 border-pink-100 bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform">
                  <MoreVertical size={24} className="text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-[24px] p-2 border-2 border-pink-50 shadow-xl min-w-[160px]">
                <DropdownMenuItem onClick={handleShare} className="text-xs font-bold gap-3 p-3 rounded-xl cursor-pointer">
                  <Share2 size={16} className="text-primary" /> Compartir Obra
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport} className="text-xs font-bold gap-3 p-3 rounded-xl text-destructive cursor-pointer">
                  <Flag size={16} /> Reportar Problema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <section className="px-8 mt-10">
        <h2 className="text-xl font-bold font-headline mb-4 text-primary">Sinopsis</h2>
        <div className="bg-pink-50/30 p-6 rounded-[32px] border-2 border-dashed border-pink-100">
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed font-medium",
            !showFullSynopsis && "line-clamp-3"
          )}>
            {work.synopsis}
          </p>
          <button 
            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
            className="text-primary font-bold text-xs mt-3 uppercase tracking-wider hover:underline"
          >
            {showFullSynopsis ? "Leer menos" : "Leer más"}
          </button>
        </div>
      </section>

      <section className="px-8 mt-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold font-headline">Episodios</h2>
            <span className="text-xs font-bold text-primary">{chapters.length} CAPÍTULOS DISPONIBLES</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortAsc(!sortAsc)}
            className="text-xs text-primary font-bold gap-2 rounded-full bg-pink-50 px-4 h-9 active:scale-95"
          >
            <ListFilter size={16} /> {sortAsc ? "Antiguos" : "Recientes"}
          </Button>
        </div>
        
        <div className="space-y-5">
          {sortedChapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              href={`/reader/${chapter.id}`}
              className="flex gap-5 p-3 bg-white rounded-[24px] border-2 border-pink-50 hover:border-primary/40 hover:bg-pink-50/20 transition-all active:scale-[0.98] group"
            >
              <div className="w-28 aspect-video relative rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
                <img src={chapter.cover_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white" size={32} />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Capítulo {chapter.chapter_number}</span>
                <h3 className="font-bold text-sm text-foreground line-clamp-1">{chapter.title || `Episodio ${chapter.chapter_number}`}</h3>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium">Toca para empezar a leer</p>
              </div>
            </Link>
          ))}
          
          {chapters.length === 0 && (
            <div className="text-center py-10 bg-muted/20 rounded-[32px] border-2 border-dashed border-pink-100">
              <p className="text-xs font-bold text-muted-foreground">Pronto habrá capítulos disponibles.</p>
            </div>
          )}
        </div>
      </section>

      <BottomNav isAdmin={isAdmin} />
    </main>
  );
}
