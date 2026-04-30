
const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:manga-reader';

export type WorkStatus = 'En emisión' | 'Finalizado' | 'Próximamente';
export type WorkType = 'Manga' | 'Manhwa' | 'Comic';

export interface MangaWork {
  id: number;
  title: string;
  synopsis: string;
  work_type: WorkType;
  status: WorkStatus;
  cover_image: string;
  author: string;
  reads_count: number;
  likes_count: number;
  scheduled_at?: string;
  tags: string[];
  categories: string[];
  created_at: number;
}

export interface MangaChapter {
  id: number;
  manga_work_id: number;
  chapter_number: number;
  title: string;
  pages: string[]; 
  cover_image: string;
  created_at: number;
}

export interface LibraryItem {
  id: number;
  user_id: string;
  manga_id: number;
  type: 'like' | 'read';
  manga: MangaWork;
}

export const apiService = {
  getWorks: async (params?: { work_type?: WorkType; status?: WorkStatus }) => {
    const url = new URL(`${BASE_URL}/manga`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) url.searchParams.append(key, val);
      });
    }
    const res = await fetch(url.toString(), { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch works: ${res.status}`);
    return (await res.json()) as MangaWork[];
  },

  getWorkById: async (id: number) => {
    const res = await fetch(`${BASE_URL}/manga/${id}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch work: ${res.status}`);
    return (await res.json()) as MangaWork;
  },

  getChaptersByWorkId: async (workId: number) => {
    const res = await fetch(`${BASE_URL}/chapter?manga_id=${workId}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch chapters: ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data : []) as MangaChapter[];
  },

  getChapterById: async (id: number) => {
    const res = await fetch(`${BASE_URL}/chapter/${id}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch chapter: ${res.status}`);
    return (await res.json()) as MangaChapter;
  },

  interact: async (workId: number, type: 'like' | 'dislike' | 'read', userId: string) => {
    return fetch(`${BASE_URL}/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manga_id: workId, type, user_id: userId }),
    });
  },

  getLibrary: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/library?user_id=${userId}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    return (await res.json()) as LibraryItem[];
  },

  publishWork: async (work: Partial<MangaWork>, adminEmail: string) => {
    if (adminEmail !== 'richardalexanderdiaz0@gmail.com') throw new Error('Unauthorized');
    const res = await fetch(`${BASE_URL}/admin/publish-work`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
    });
    if (!res.ok) throw new Error('Failed to publish work');
    return await res.json();
  },

  addChapter: async (chapter: Partial<MangaChapter>, adminEmail: string) => {
    if (adminEmail !== 'richardalexanderdiaz0@gmail.com') throw new Error('Unauthorized');
    const res = await fetch(`${BASE_URL}/admin/add-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chapter),
    });
    if (!res.ok) throw new Error('Failed to add chapter');
    return await res.json();
  }
};
