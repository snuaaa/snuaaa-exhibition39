import { atom } from 'recoil';

const selectedPhotoState = atom<string | null>({
  key: 'selectedPhoto/atom',
  default: null,
  // default: 'photo_1_1',
});

export { selectedPhotoState };
