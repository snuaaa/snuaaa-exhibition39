import { atom } from 'recoil';

const tokenAtom = atom<string | null>({
  key: 'tokenAtom',
  default: null,
});

export default tokenAtom;
