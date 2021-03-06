import React, { useCallback, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import { SCENE } from 'src/recoils/scene';
import useScene from 'src/hooks/useScene';
import { GOOGLE_CLIENT_ID } from 'src/config';
import useToken from 'src/hooks/useToken';
import AuthService from 'src/services/authService';

const Login: React.FC = () => {
  const styles = useMemo(() => ({
    wrapper: css({
      position: 'relative',
      padding: '1rem 5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '@media screen and (max-width: 800px)': {
        padding: '1rem 3rem',
      },
    }),
    title: css({
      fontSize: '1.2rem',
      textAlign: 'center',
      '@media screen and (max-width: 800px)': {
        fontSize: '1rem',
      },
    }),
    text: css({
      fontSize: '0.8rem',
      lineHeight: 1.5,
      marginTop: '2rem',
      marginBottom: '4rem',
      animation: `${fadeIn} 1s`,
    }),
    loginButton: css({
      cursor: 'pointer',
    }),
    cancelButton: css({
      position: 'absolute',
      right: 0,
      bottom: '1rem',
      padding: '0.5rem 1.5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      background: 'transparent',
      cursor: 'pointer',
      border: 'none',
    }),
  }), []);

  const { setScene } = useScene();
  const { setToken } = useToken();

  const onLoadGoogle = useCallback(() => {
    const handleCredentialResponse = async (response: any) => {
      const authResponse = await AuthService.authGoogle(response.credential);
      setToken(authResponse.token);
    };
    const { google } = (window as any);
    if (google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById('loginButton'),
        {
          theme: 'outline',
          size: 'smalll',
        },
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
    }
  }, [setToken]);

  const isGoogleLoaded = useMemo(() => !!(window as any).google, []);

  useEffect(() => {
    if (!isGoogleLoaded) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        onLoadGoogle();
      };
      document.head.appendChild(script);
    }
  }, [isGoogleLoaded, onLoadGoogle]);

  useEffect(() => {
    if (isGoogleLoaded) {
      onLoadGoogle();
    }
  }, [isGoogleLoaded, onLoadGoogle]);

  return (
    <>
      <div className={styles.wrapper}>
        <h5 className={styles.title}>????????? ???????????? ???????????? ?????? ???????????? ???????????????. ????????? ???????????????????</h5>
        <p className={styles.text}>
          ??????????????? ???????????? ????????? AAA??? ????????? ???????????? ??????????????? ?????? ??? ????????????,
          ?????? ????????? ???????????? ??????????????? ????????? ????????????.
          <br />
          <br />
          * ??? ??????????????? ???????????? ????????? ????????? ????????????.
          <br />
          ?????? ????????? ?????? : MVP ??????, ????????? ?????? ??? ????????? ?????? ??? ?????? ????????? ?????? ???????????????.
          <br />
          ????????? ?????? : ???????????? ???????????? ??? ?????? ??? ????????? ?????? ???????????????.
          <br />
          <br />
          ????????? ??????????????? ????????? ????????? ???????????? ?????? ???????????? 2021.12.14 ??????????????? 30??? ????????? ???????????????.
        </p>
        <div id="loginButton" className={styles.loginButton}>?????? ?????? ?????? ??????????????? ????????? ?????????.</div>
        <button type="button" className={styles.cancelButton} onClick={() => setScene(SCENE.HOME)}>????????????</button>
      </div>
    </>
  );
};

export default Login;
