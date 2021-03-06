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
        <h5 className={styles.title}>기능을 사용하기 위해서는 구글 로그인이 필요합니다. 로그인 하시겠습니까?</h5>
        <p className={styles.text}>
          서울대학교 아마추어 천문회 AAA는 아래의 목적으로 개인정보를 수집 및 이용하며,
          개인 정보를 안전하게 취급하는데 최선을 다합니다.
          <br />
          <br />
          * 이 사이트에서 수집하는 정보는 다음과 같습니다.
          <br />
          구글 로그인 정보 : MVP 투표, 방명록 작성 시 이용자 식별 및 중복 방지를 위해 수집합니다.
          <br />
          이메일 주소 : 이벤트에 참여하실 때 당첨 시 연락을 위해 수집합니다.
          <br />
          <br />
          수집된 개인정보는 사진전 전시와 이벤트가 모두 종료되는 2021.12.14 이후로부터 30일 이내에 파기됩니다.
        </p>
        <div id="loginButton" className={styles.loginButton}>앱이 아닌 다른 브라우저를 사용해 주세요.</div>
        <button type="button" className={styles.cancelButton} onClick={() => setScene(SCENE.HOME)}>뒤로가기</button>
      </div>
    </>
  );
};

export default Login;
