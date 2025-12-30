---
id: "3"
category: "MOTION"
date: "2024.10.05"
title:
  en: "GSAP VS CSS TRANSITIONS: PERFORMANCE AUDIT"
  pt: "GSAP VS CSS TRANSITIONS: AUDITORIA DE PERFORMANCE"
analytics:
  views: 15234
  reads: 9876
  avgTime: "5:45"
  shares: 892
---

::locale-content{lang="en"}
I benchmarked 1000 animations. The results surprised me. CSS isn't always faster, and GSAP isn't always smoother. **Context matters.**

## The Test Setup

I tested simple transforms, complex sequences, scroll-triggered animations, and SVG path morphing. Each test ran 100 times on both M1 Mac and mid-range Android.

Metrics tracked: frame rate, paint time, composite time, and main thread blocking.

## Simple Transforms: CSS Wins

For basic hover effects and simple transitions, CSS is 15-20% more performant. The browser's compositor handles these without JavaScript intervention.

But the moment you need sequencing or dynamic values, CSS becomes a maintenance nightmare.

## Complex Sequences: GSAP Dominates

Timeline-based animations showed GSAP at 60fps while CSS keyframes dropped to 45fps on the same complexity level. GSAP's RAF-based loop is simply more optimized.

## The Verdict

Use CSS for: hovers, simple page transitions, loading states. Use GSAP for: scroll animations, complex sequences, anything with dynamic values. Don't be a purist—use the right tool.
::

::locale-content{lang="pt"}
Fiz benchmark a 1000 animações. Os resultados surpreenderam-me. CSS não é sempre mais rápido, e GSAP não é sempre mais suave. **Contexto importa.**

## O Setup de Teste

Testei transforms simples, sequências complexas, animações triggered por scroll, e morphing de paths SVG. Cada teste correu 100 vezes em M1 Mac e Android mid-range.

Métricas tracked: frame rate, paint time, composite time, e blocking de main thread.

## Transforms Simples: CSS Ganha

Para efeitos hover básicos e transições simples, CSS é 15-20% mais performante. O compositor do browser trata destes sem intervenção JavaScript.

Mas no momento em que precisas de sequenciamento ou valores dinâmicos, CSS torna-se um pesadelo de manutenção.

## Sequências Complexas: GSAP Domina

Animações timeline-based mostraram GSAP a 60fps enquanto CSS keyframes caiu para 45fps no mesmo nível de complexidade. O loop RAF-based do GSAP é simplesmente mais otimizado.

## O Veredito

Usa CSS para: hovers, transições de página simples, estados de loading. Usa GSAP para: animações scroll, sequências complexas, qualquer coisa com valores dinâmicos. Não sejas purista—usa a ferramenta certa.
::
