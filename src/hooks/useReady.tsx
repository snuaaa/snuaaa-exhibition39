import { useRecoilState } from 'recoil';
import readyAtom from 'src/recoils/readyAtom';

const useReady = () => {
  const [ready, setReady] = useRecoilState(readyAtom);
  return { ready, setReady };
};

export default useReady;
