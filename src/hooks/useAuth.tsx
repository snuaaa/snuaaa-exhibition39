import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import authAtom from 'src/recoils/authAtom';
import tokenAtom from 'src/recoils/tokenAtom';
import AuthService from 'src/services/authService';

const useAuth = () => {
  const tokenValue = useRecoilValue(tokenAtom);
  const [auth, setAuth] = useRecoilState(authAtom);

  useEffect(() => {
    (async () => {
      if (tokenValue) {
        const { isMember, hasVoted } = await AuthService.getInfo();
        setAuth({
          isLogined: true,
          isMember,
          hasVoted,
        });
      }
    })();
  }, [tokenValue, setAuth]);

  const authMember = useCallback(async (password: string) => {
    const { isMember, hasVoted } = await AuthService.authMember(password);
    setAuth({
      ...auth,
      isMember,
      hasVoted,
    });
  }, [auth, setAuth]);

  return { auth, setAuth, authMember };
};

export default useAuth;
