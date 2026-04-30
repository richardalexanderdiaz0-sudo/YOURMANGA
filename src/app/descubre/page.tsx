
"use client"

import { useState, useEffect } from 'react';
import { apiService, MangaWork } from '@/lib/api';
import { useUser } from '@/firebase';
import { MangaCard } from '@/components/manga/MangaCard';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, Heart } from 'lucide-react';

export default function DiscoverPage() {
  const { user } = useUser();
  const [works, setWorks] = useState<MangaWork[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
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

  const genres = ['Acción', 'Aventura', 'Romance', 'Fantasía', 'Drama', 'Horror', 'Vida Escolar', 'BL', 'Yaoi', '+18'];

  const filteredWorks = works.filter(w => 
    (w.title.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'all' || w.categories.includes(filter) || w.tags.includes(filter))
  );

  const isAdmin = user?.email === 'richardalexanderdiaz0@gmail.com';

  return (
    <main className="min-h-screen pb-32">
      <div className="p-6 sticky top-0 bg-background/80 backdrop-blur-md z-40 space-y-4 border-b border-pink-50">
        <h1 className="text-2xl font-bold font-headline">Descubre</h1>
        <div className="relative">
          <Input 
            placeholder="Buscar por nombre o autor..." 
            className="rounded-2xl border-pink-100 pl-12 h-12 bg-white/50 focus:bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            className="rounded-xl px-4 font-bold text-xs"
            onClick={() => setFilter('all')}
          >
            TODO
          </Button>
          {genres.map(genre => (
            <Button 
              key={genre}
              variant={filter === genre ? 'default' : 'outline'} 
              size="sm" 
              className="rounded-xl px-4 font-bold text-xs border-pink-100 whitespace-nowrap"
              onClick={() => setFilter(genre)}
            >
              {genre.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-6 pt-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="aspect-[2/3] bg-pink-50 rounded-2xl" />
                <div className="h-4 bg-pink-50 rounded w-3/4" />
                <div className="h-3 bg-pink-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
              <span>MOSTRANDO {filteredWorks.length} RESULTADOS</span>
              <div className="flex gap-3">
                 <span className="flex items-center gap-1"><Eye size={12}/> LEÍDOS</span>
                 <span className="flex items-center gap-1"><Heart size={12}/> POPULAR</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {filteredWorks.map(work => (
                <MangaCard key={work.id} work={work} showDetails />
              ))}
            </div>
            {filteredWorks.length === 0 && (
              <div className="text-center py-32 space-y-4">
                <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Search size={32} className="text-primary/30" />
                </div>
                <p className="font-bold text-muted-foreground">No encontramos lo que buscas...</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav isAdmin={isAdmin} />
    </main>
  );
}
