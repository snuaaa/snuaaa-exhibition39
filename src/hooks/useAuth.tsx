import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import authAtom from 'src/recoils/authAtom';
import AuthService from 'src/services/authService';
// import useToken from './useToken';

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

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
