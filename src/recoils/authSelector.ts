import { selector } from 'recoil';
import AuthService from 'src/services/authService';
import tokenAtom from './tokenAtom';

interface Auth {
  isLogined: boolean,
  isMember: boolean,
  hasVoted: boolean,
}

const authSelector = selector<Auth>({
  key: 'authState',
  get: async ({ get }) => {
    const token = get(tokenAtom);
    if (token) {
      const { isMember, hasVoted } = await AuthService.getInfo();
      return {
        isLogined: true,
        isMember,
        hasVoted,
      };
    }
    return {
      isLogined: false,
      isMember: false,
      hasVoted: false,
    };
  },
});

export default authSelector;
