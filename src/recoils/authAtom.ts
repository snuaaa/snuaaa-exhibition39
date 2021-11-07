import { atom } from 'recoil';

interface Auth {
  isLogined: boolean,
  isMember: boolean,
  hasVoted: boolean,
}

const authAtom = atom<Auth>({
  key: 'auth/atom',
  default: {
    isLogined: false,
    isMember: false,
    hasVoted: false,
  },
});

export default authAtom;
