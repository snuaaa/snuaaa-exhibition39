import { atom } from 'recoil';

const readyAtom = atom<boolean>({
  key: 'ready/atom',
  default: false,
});

export default readyAtom;
