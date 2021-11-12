import { atom } from 'recoil';

const welcomeAtom = atom<boolean>({
  key: 'welcome/atom',
  default: false,
});

export default welcomeAtom;
