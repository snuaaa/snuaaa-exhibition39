import { atom } from 'recoil';

interface Auth {
  token: string | null,
}

const authState = atom<Auth>({
  key: 'authState',
  default: {
    token: null,
  },
});

export { authState };
