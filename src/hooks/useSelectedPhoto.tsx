import { useRecoilState } from 'recoil';
import { selectedPhotoState } from 'src/recoils/selectedPhotoAtom';

const useSelectedPhoto = () => {
  const [selectedPhoto, setSelectedPhoto] = useRecoilState(selectedPhotoState);

  return { selectedPhoto, setSelectedPhoto };
};

export default useSelectedPhoto;
