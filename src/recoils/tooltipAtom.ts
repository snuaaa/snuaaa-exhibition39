import { atom } from 'recoil';

interface Tooltip {
  home: boolean,
  gallery: boolean,
}

const authAtom = atom<Tooltip>({
  key: 'tooltip/atom',
  default: {
    home: true,
    gallery: true,
  },
});

export default authAtom;
