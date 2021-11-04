import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import tokenAtom from 'src/recoils/tokenAtom';

const useToken = () => {
  const [tokenValue, setTokenValue] = useRecoilState(tokenAtom);

  useEffect(() => {
    const localToken = window.localStorage.getItem('token');
    setTokenValue(localToken);
  }, [setTokenValue]);

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    setTokenValue(token);
  };

  const getToken = () => tokenValue;

  const isLogin: boolean = !!tokenValue;

  return { isLogin, setToken, getToken };
};

export default useToken;
