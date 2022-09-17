import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import tokenAtom from 'src/recoils/tokenAtom';
// import AuthService from 'src/services/authService';

const useToken = () => {
  const [tokenValue, setTokenValue] = useRecoilState(tokenAtom);

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setTokenValue(token);
  };

  const getToken = () => tokenValue;

  const removeToken = useCallback(() => {
    localStorage.removeItem('token');
    setTokenValue(null);
  }, [setTokenValue]);

  // useEffect(() => {
  //   const localToken = window.localStorage.getItem('token');
  //   if (localToken) {
  //     AuthService.checkToken()
  //       .then(() => {
  //       })
  //       .catch(() => {
  //         removeToken();
  //       });
  //   }
  //   setTokenValue(localToken);
  // }, [setTokenValue, removeToken]);

  const isLogin: boolean = !!tokenValue;

  return {
    isLogin, setToken, getToken, removeToken,
  };
};

export default useToken;
