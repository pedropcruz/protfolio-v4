---
displayId: '1'
title: 'WEDDING_MIP'
tags: ['VUE 3', 'SUPABASE', 'MOBILE', 'SPOTIFY']
description:
  en: 'REAL-TIME WEDDING COMPANION APP BUILT IN 30 DAYS UNDER EXTREME DEADLINE.'
  pt: 'APP COMPANHEIRA DE CASAMENTO EM TEMPO REAL CONSTRUÍDA EM 30 DIAS SOB PRAZO EXTREMO.'
details:
  stack:
    - name: 'VUE 3 + VITE'
      reason:
        en: 'Maximum development velocity and performance'
        pt: 'Velocidade de desenvolvimento e performance máxima'
    - name: 'SUPABASE'
      reason:
        en: 'Instant backend: Auth, Realtime DB & Storage'
        pt: 'Backend instantâneo: Auth, DB Realtime & Storage'
    - name: 'SPOTIFY API'
      reason:
        en: 'Crowdsourced playlist management'
        pt: 'Gestão de playlist colaborativa'
  images:
    - 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200'
---

::locale-content{lang="en"}
::project-section{heading="THE CHALLENGE"}
With only 30 days until the event, the groom (a backend dev) underestimated the complexity of coordinating 150+ guests. We needed a centralized system to manage critical logistics: dietary restrictions (vegan/allergies), location guides, and a crowdsourced music playlist. The biggest hurdle was time: we needed a robust, production-ready app yesterday.
::
::
::locale-content{lang="pt"}
::project-section{heading="O DESAFIO"}
A apenas 30 dias do evento, o noivo (dev backend) subestimou a complexidade de coordenar 150+ convidados. Precisávamos de um sistema centralizado para gerir logística crítica: restrições alimentares (vegan/alergias), guias de localização e uma playlist de música colaborativa. O maior obstáculo foi o tempo: precisávamos de uma app robusta e pronta para produção "para ontem".
::
::

::project-image{src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200" alt="Tech at Wedding Context"}
::

::locale-content{lang="en"}
::project-section{heading="THE SOLUTION"}
I architected a mobile-first PWA using Vue 3 for speed and Supabase for an instant backend.

**Key Features Delivered:**

- **Real-time Social Feed:** Guests uploaded photos/videos directly to Supabase Storage, appearing instantly on everyone's feed via websockets.
- **Dietary Management:** A structured form that categorized guests by dietary needs, solving the catering logistics nightmare.
- **Spotify Integration:** A voting system where guests suggested songs, but the groom retained "admin veto" power to curate the vibe.

Despite the tight timeline, the app ran flawlessly during the event, becoming the central hub for memories and logistics.
::
::
::locale-content{lang="pt"}
::project-section{heading="A SOLUÇÃO"}
Arquitetei uma PWA mobile-first usando Vue 3 para velocidade e Supabase para um backend instantâneo.

**Funcionalidades Chave:**

- **Feed Social Real-time:** Convidados faziam upload de fotos/vídeos direto para o Supabase Storage, aparecendo instantaneamente no feed de todos via websockets.
- **Gestão Alimentar:** Um formulário estruturado categorizou convidados por necessidades dietéticas, resolvendo o pesadelo logístico do catering.
- **Integração Spotify:** Um sistema de votação onde convidados sugeriam músicas, mas o noivo mantinha poder de "veto de admin" para curar a vibe.

Apesar do prazo apertado, a app correu sem falhas durante o evento, tornando-se o hub central para memórias e logística.
::
::

::project-image{src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200" alt="Party and Music"}
::
