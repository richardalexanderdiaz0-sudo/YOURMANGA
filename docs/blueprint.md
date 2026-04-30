# **App Name**: Yourmanga

## Core Features:

- User Authentication & Profile: Secure user registration and login functionality using Firebase (supporting Google, email, and password), with user data synchronized for library and preferences in Xano.
- Dynamic Home Feed: Display customizable home sections such as 'AÑADIDOS RECIENTEMENTE', 'PRÓXIMAMENTE' (with animated countdown based on 'scheduled_at'), 'TERMINADOS', 'ACTUALIZACIONES DIARIAS', 'TÍTULOS EN TENDENCIA', and a main 'CÓMICS Y MANHWAS' grid, all loaded from Xano with skeleton loading for optimal UX.
- Work Discovery and Details: Navigate a comprehensive catalog of comics, mangas, and manhwas. Filter by genres, status (New, Updated, Finalized), likes, and read counts. View detailed work pages including cover, synopsis (with 'leer más'), categories, status, author, read count, and comments.
- Immersive Chapter Reader: Experience full-screen chapter viewing with intuitive tap-to-show-controls UI for navigation (previous/next chapter, episode list), info (back to work details), sharing (to external apps like TikTok, WhatsApp), and a 'heart' button for notifications about new chapters.
- User Engagement & Sharing: Allow users to like/dislike, post comments, reply to comments, and report works with a reason. Facilitate sharing of work links to external applications with a customizable message (e.g., '¡NO DEJO DE LEER [NOMBRE] TE INVITO A LEER!').
- Admin Publishing Studio: A dedicated, authenticated administrator panel (accessible via 'Estudio' link and validated with richardalexanderdiaz0@gmail.com) for creating, uploading, and managing new comic, manga, and manhwa works and their chapters. This includes setting work type, title, full synopsis, status (En emisión/Finalizado), episode content, categories, tags, and scheduling releases for the 'Próximamente' section.
- Personal Library & Notifications: Automatically save all read comics, mangas, and manhwas to the user's personal 'Biblioteca'. Users receive bell icon notifications when new chapters are published for works they have interacted with or favorited.

## Style Guidelines:

- Primary color: A lively, warm pink (#FF44B2) for a playful, energetic cartoon aesthetic.
- Background color: A very light, desaturated pink (#FAF5F7) providing a clean, bright canvas while maintaining thematic consistency.
- Accent color: A vibrant, slightly deeper violet-pink (#E817E8) for highlighting interactive elements and important information, ensuring strong contrast.
- Headline font: 'Poppins' (sans-serif) for its modern, geometric, and playful characteristics, suiting the cartoon style.
- Body font: 'Inter' (sans-serif) for high legibility and a clean, neutral appearance across all devices, perfect for longer texts like synopses and comments.
- Use rounded, clean, and expressive icons that complement the cartoon visual style. Icons should be easily understandable and hint at their function (e.g., a bell for notifications, a speech bubble for comments).
- Employ a responsive grid-based layout for content browsing, prioritizing large, engaging cover images. Utilize a sticky bottom navigation bar with icons for 'Home', 'Descubre', 'Biblioteca', 'Perfil', and 'Estudio' (admin only).
- Implement subtle and fluid animations for transitions between pages, loading states (skeleton screens for all content fetching), 'Próximamente' countdown, and interactive element feedback to enhance the dynamic feel.