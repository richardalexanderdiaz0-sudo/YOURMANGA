
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MangaWork } from '@/lib/api';
import { Star, Eye, Sparkles } from 'lucide-react';

interface MangaCardProps {
  work: MangaWork;
  showDetails?: boolean;
}

export function MangaCard({ work, showDetails = false }: MangaCardProps) {
  const getStatusBadge = () => {
    switch (work.status) {
      case 'Finalizado': return <Badge className="bg-green-500 hover:bg-green-600 text-white border-none text-[9px] font-bold cartoon-shadow h-5">FINALIZADO</Badge>;
      case 'En emisión': return <Badge className="bg-primary hover:bg-primary/90 text-white border-none text-[9px] font-bold cartoon-shadow h-5">EN EMISIÓN</Badge>;
      case 'Próximamente': return <Badge variant="secondary" className="text-[9px] font-bold h-5 bg-pink-100 text-primary border-none">PRÓXIMAMENTE</Badge>;
      default: return null;
    }
  };

  const isNew = work.created_at > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/manga/${work.id}`} className="group block">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[24px] cartoon-border bg-white transition-all duration-500 group-hover:-translate-y-2 group-hover:cartoon-shadow">
        <Image
          src={work.cover_image || `https://picsum.photos/seed/${work.id}/400/600`}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {getStatusBadge()}
          {isNew && (
            <Badge className="bg-yellow-400 text-black border-none text-[9px] font-bold h-5 flex gap-1 items-center">
              <Sparkles size={8} /> NUEVO
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="text-white text-[10px] flex gap-4 font-bold">
            <span className="flex items-center gap-1.5"><Eye size={14} className="text-primary" /> {work.reads_count}</span>
            <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> {work.likes_count}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">{work.title}</h3>
        {showDetails && <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{work.author}</p>}
      </div>
    </Link>
  );
}
