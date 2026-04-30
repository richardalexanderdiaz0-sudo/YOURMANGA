
"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, BookOpen, Clock, Heart, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiService, LibraryItem } from '@/lib/api';
import { MangaCard } from '@/components/manga/MangaCard';

export default function LibraryPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (user) {
      setFetching(true);
      apiService.getLibrary(user.uid)
        .then(setLibrary)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const isAdmin = user?.email === 'richardalexanderdiaz0@gmail.com';
  const reads = library.filter(item => item.type === 'read').map(item => item.manga);
  const favorites = library.filter(item => item.type === 'like').map(item => item.manga);

  return (
    <main className="min-h-screen pb-32">
      <header className="p-8 pt-12 text-center bg-gradient-to-b from-pink-50 to-background rounded-b-[48px] mb-8">
        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
          <Library className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold font-headline mb-1">Mi Biblioteca</h1>
        <p className="text-sm text-muted-foreground font-medium">Tus historias guardadas automáticamente</p>
      </header>

      <div className="px-6">
        {!user ? (
          <div className="bg-white p-8 rounded-[40px] cartoon-border cartoon-shadow text-center space-y-6 mt-10">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-primary">
              <LogIn size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold">¡Inicia sesión!</h2>
              <p className="text-xs text-muted-foreground mt-2">Necesitas una cuenta para guardar tu progreso y favoritos.</p>
            </div>
            <Button onClick={() => router.push('/login')} className="w-full rounded-2xl h-12 font-bold cartoon-shadow">
              IR A LOGIN
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="w-full bg-pink-50 p-1 h-12 rounded-2xl mb-8">
              <TabsTrigger value="recent" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs gap-2">
                <Clock size={16} /> RECIENTES
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-xs gap-2">
                <Heart size={16} /> FAVORITOS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              {fetching ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : reads.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {reads.map(manga => (
                    <MangaCard key={manga.id} work={manga} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                    <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={24} className="text-primary/30" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">¡Aún no has leído nada!</p>
                    <p className="text-[10px] text-muted-foreground mt-1 px-10">Tus lecturas aparecerán aquí para que continúes donde lo dejaste.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              {fetching ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {favorites.map(manga => (
                    <MangaCard key={manga.id} work={manga} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                    <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart size={24} className="text-primary/30" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">Guarda tus favoritos</p>
                    <p className="text-[10px] text-muted-foreground mt-1 px-10">Dale amor a tus mangas favoritos para recibir notificaciones.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNav isAdmin={isAdmin} />
    </main>
  );
}
