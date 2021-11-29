import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/css';

import guestbookTitle from 'src/assets/images/guestbook_title.png';
import useScene from 'src/hooks/useScene';
import useToken from 'src/hooks/useToken';
import cancelIcon from 'src/assets/icons/cancel.svg';
import { SCENE } from 'src/recoils/scene';
import Login from './login';

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
    background: 'linear-gradient(180deg, #0C0D2D 0%, #091241 68.23%, #1A2273 81.25%, #55277A 94.27%)',
  }),
  loginWrapper: css({
    background: 'rgba(72, 81, 138, 0.4)',
    borderRadius: '3rem',
  }),
  guestbook: css({
    position: 'relative',
    width: '50%',
    height: '90%',
    background: 'none',
    padding: '2rem 1rem',
    color: '#FFFFFF',
  }),
  paper: css({
    width: '100%',
    height: '100%',
    // background: '#49518A',
  }),
  inputWrapper: css({
    width: '100%',
    border: '1px solid #FFFFFF',
    borderRadius: '1.5rem',
    padding: '1rem',
    display: 'flex',
  }),
  nicknameWrapper: css({
    position: 'relative',
    width: '6rem',
  }),
  input: css({
    background: 'none',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    width: '100%',
    padding: '0.2rem',
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: '#49518A',
    },
  }),
  textarea: css({
    resize: 'none',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    background: 'none',
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: '#49518A',
    },

  }),
};

const Guestbook: React.FC = () => {
  const { setScene } = useScene();
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
            : (
              <div className={styles.guestbook}>
                <img src={guestbookTitle} alt="guestbookTitle" />
                <div className={styles.inputWrapper}>
                  <div className={styles.nicknameWrapper}>
                    <label htmlFor="nickname">
                      닉네임
                      <input type="text" id="nickname" className={styles.input} />
                    </label>
                  </div>
                  <textarea className={styles.textarea} />
                  <button type="submit">ENTER</button>
                </div>
                <button type="button" onClick={() => setScene(SCENE.HOME)}>
                  <img src={cancelIcon} alt="cancelIcon" />
                </button>
              </div>
            )
        }
      </div>
    </>
  );
};

export default Guestbook;
