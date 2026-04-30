
"use client"

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, MangaChapter, MangaWork } from '@/lib/api';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Heart, 
  Info, 
  Share2,
  X,
  PlayCircle,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function ReaderPage() {
  const { chapterId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [chapter, setChapter] = useState<MangaChapter | null>(null);
  const [work, setWork] = useState<MangaWork | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [allChapters, setAllChapters] = useState<MangaChapter[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const c = await apiService.getChapterById(parseInt(chapterId as string));
        setChapter(c);
        const w = await apiService.getWorkById(c.manga_work_id);
        setWork(w);
        const chapters = await apiService.getChaptersByWorkId(c.manga_work_id);
        setAllChapters(chapters.sort((a, b) => a.chapter_number - b.chapter_number));
        
        // Register read interaction automatically
        if (user) {
          apiService.interact(w.id, 'read', user.uid);
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error al cargar el capítulo' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId, user]);

  const toggleControls = () => setShowControls(!showControls);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `¡NO DEJO DE LEER ${work?.title} TE INVITO A LEER!`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: work?.title, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast({ title: 'Enlace copiado al portapapeles' });
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: 'Inicia sesión', description: 'Debes estar logueado para guardar favoritos.' });
      router.push('/login');
      return;
    }
    
    try {
      setIsFavorited(!isFavorited);
      await apiService.interact(work!.id, 'like', user.uid);
      if (!isFavorited) {
        toast({ title: '¡AGREGADO!', description: 'RECIBÍRAS UNA NOTIFICACIÓN CUANDO HAYA UNA NUEVA ACTUALIZACIÓN' });
      }
    } catch (err) {
      setIsFavorited(isFavorited); // rollback
      toast({ variant: 'destructive', title: 'Error al actualizar favoritos' });
    }
  };

  const goToChapter = (id: number) => {
    router.push(`/reader/${id}`);
    setShowChapterList(false);
    setShowControls(false);
  };

  const nextChapter = allChapters.find(c => c.chapter_number === (chapter?.chapter_number || 0) + 1);
  const prevChapter = allChapters.find(c => c.chapter_number === (chapter?.chapter_number || 0) - 1);

  if (loading || !chapter) return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white select-none relative overflow-x-hidden">
      
      {/* Immersive Scroll View */}
      <div 
        className="flex flex-col items-center w-full min-h-screen relative z-0" 
        onClick={toggleControls}
      >
        {chapter.pages.map((url, idx) => (
          <img 
            key={idx}
            src={url}
            alt={`Pag ${idx + 1}`}
            className="w-full max-w-4xl h-auto pointer-events-none"
            loading={idx < 3 ? 'eager' : 'lazy'}
          />
        ))}
        
        {/* Next Chapter Button at end of scroll */}
        {nextChapter && (
          <div className="py-20 px-8 w-full max-w-xl">
            <Button 
              onClick={(e) => { e.stopPropagation(); goToChapter(nextChapter.id) }}
              className="w-full h-16 rounded-[24px] font-bold text-lg gap-3 cartoon-shadow"
            >
              SIGUIENTE CAPÍTULO <ChevronRight size={24} />
            </Button>
          </div>
        )}
      </div>

      {/* Header Overlay Controls */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md p-6 transition-transform duration-500 ease-out border-b border-white/10",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft size={28} />
            </button>
            <div className="max-w-[180px]">
              <h2 className="text-sm font-bold truncate">{work?.title}</h2>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Capítulo {chapter.chapter_number}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleFavoriteToggle} 
              className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", isFavorited ? "text-primary bg-primary/20" : "text-white bg-white/10")}
            >
              {isFavorited ? <Heart size={22} fill="currentColor" /> : <PlusCircle size={22} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); router.push(`/manga/${work?.id}`) }} 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            >
              <Info size={22} />
            </button>
            <button 
              onClick={handleShare} 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Overlay Controls */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md px-6 py-8 transition-transform duration-500 ease-out border-t border-white/10",
        showControls ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); prevChapter && goToChapter(prevChapter.id) }} 
            disabled={!prevChapter}
            className={cn("w-14 h-14 rounded-3xl flex items-center justify-center transition-all", prevChapter ? "bg-white/10 hover:bg-white/20" : "opacity-20 pointer-events-none")}
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setShowChapterList(true) }} 
            className="flex flex-col items-center gap-2 bg-primary px-8 py-3 rounded-[24px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Menu size={28} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Capítulos</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); nextChapter && goToChapter(nextChapter.id) }} 
            disabled={!nextChapter}
            className={cn("w-14 h-14 rounded-3xl flex items-center justify-center transition-all", nextChapter ? "bg-white/10 hover:bg-white/20" : "opacity-20 pointer-events-none")}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Chapter List Menu (Sidebar/Overlay) */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl transition-all duration-500",
        showChapterList ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="p-8 h-full flex flex-col max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold font-headline">Lista de Episodios</h2>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">{work?.title}</p>
            </div>
            <button onClick={() => setShowChapterList(false)} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <X size={28} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-10">
            {allChapters.map(c => (
              <div 
                key={c.id}
                onClick={() => goToChapter(c.id)}
                className={cn(
                  "flex gap-5 p-4 rounded-[28px] border-2 transition-all cursor-pointer group",
                  c.id === chapter.id 
                    ? "border-primary bg-primary/20 scale-[1.02]" 
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="w-24 aspect-video relative rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img src={c.cover_image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className={c.id === chapter.id ? "text-primary" : "text-white/40"} size={24} />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Capítulo {c.chapter_number}</p>
                   <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{c.title || `Capítulo ${c.chapter_number}`}</h3>
                   {c.id === chapter.id && <span className="text-[9px] font-bold text-primary mt-2">LEYENDO AHORA</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
