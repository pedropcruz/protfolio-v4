export const useTransitionCurtain = () => {
  const transitionRef = useState<any>('transitionCurtain', () => null);

  const register = (ref: Ref) => {
    transitionRef.value = ref;
  };

  const play = (onMiddleCallback?: () => void) => {
    if (transitionRef.value?.play) {
      transitionRef.value.play(onMiddleCallback);
    } else {
      if (onMiddleCallback) onMiddleCallback();
    }
  };

  return {
    register,
    play
  };
};
