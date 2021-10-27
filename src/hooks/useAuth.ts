import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from 'src/recoils/auth';

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setAuth({ token });
  }, [setAuth]);

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    setAuth({ token });
  };
  const isLogin: boolean = !!auth.token;

  return { isLogin, setToken };
};

export default useAuth;
