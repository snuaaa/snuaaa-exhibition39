import { useRecoilState } from 'recoil';
import { sceneState } from 'src/recoils/scene';

const useScene = () => {
  const [scene, setScene] = useRecoilState(sceneState);

  return { scene, setScene };
};

export default useScene;
