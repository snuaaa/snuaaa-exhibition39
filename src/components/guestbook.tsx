import React from 'react';
import { css } from '@emotion/css';

import useToken from 'src/hooks/useToken';
import Login from './login';
import GuestbookView from './guestbookView';

const styles = {
  wrapper: css({
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    // animation: `${fadeIn} 1s`,
    // animationDelay: '0.5s',
    // animationFillMode: 'both',
    cursor: 'default',
    background: 'linear-gradient(180deg, #0C0D2D 0%, #091241 68.23%, #1A2273 81.25%, #55277A 94.27%)',
  }),
  loginWrapper: css({
    background: 'rgba(72, 81, 138, 0.4)',
    borderRadius: '3rem',
  }),
};

const Guestbook: React.FC = () => {
  const { isLogin } = useToken();

  return (
    <>
      <div className={styles.wrapper}>
        {
          !isLogin
            ? (
              <div className={styles.loginWrapper}>
                <Login />
              </div>
            )
            : <GuestbookView />
        }
      </div>
    </>
  );
};

export default Guestbook;
