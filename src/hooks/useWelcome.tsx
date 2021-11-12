import { useRecoilState } from 'recoil';

import welcomeAtom from 'src/recoils/welcomeAtom';

const useWelcome = () => {
  const [hasViewed, setHasViewed] = useRecoilState(welcomeAtom);

  return { hasViewed, setHasViewed };
};

export default useWelcome;
