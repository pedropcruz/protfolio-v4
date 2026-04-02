export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;
  if (to.path === from.path) return;

  const { play } = useTransitionCurtain();

  return new Promise<void>((resolve) => {
    play(() => {
      resolve();
    });
  });
});
