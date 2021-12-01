import React, { useCallback, useEffect, useRef } from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import slogan from 'src/assets/images/slogan.png';
import useScene from 'src/hooks/useScene';
import useWelcome from 'src/hooks/useWelcome';
import guestbookIcon from 'src/assets/icons/guestbook.svg';
import voteIcon from 'src/assets/icons/vote.svg';
import { SCENE } from 'src/recoils/scene';
import WelcomeMessage from './welcomeMessage';

const styles = {
  slogan: css({
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    // height: 300,
    maxWidth: 1000,
    width: '25%',
    userSelect: 'none',
    // animation: `${smaller('50%', '25%')} 1s`,
    animationDelay: '0.5s',
    animationFillMode: 'both',
    '@media screen and (max-width: 800px)': {
      width: '50%',
    },
  }),
  buttonWrapper: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: '1rem',
  }),
  button: css({
    background: 'none',
  }),
  icon: css({
    width: '3rem',
  }),
  canvas: css({
    userSelect: 'none',
  }),
};

const Home: React.FC = () => {
  const { scene, setScene } = useScene();
  const aaaThree = useRef<AaaThree>();
  const { hasViewed } = useWelcome();

  useEffect(() => {
    if (aaaThree.current) {
      aaaThree.current.moveScene(scene);
    }
  }, [scene, aaaThree]);

  const onClickGuestBook = useCallback(() => {
    setScene(SCENE.GUESTBOOK);
  }, [setScene]);

  const onClickMVP = useCallback(() => {
    setScene(SCENE.MVP);
  }, [setScene]);

  return (
    <>
      <img className={styles.slogan} src={slogan} alt="for the STARved" />
      <div className={styles.buttonWrapper}>
        <button type="button" className={styles.button} onClick={onClickGuestBook}>
          <img src={guestbookIcon} alt="guestbookIcon" className={styles.icon} />
        </button>
        <button type="button" className={styles.button} onClick={onClickMVP}>
          <img src={voteIcon} alt="voteIcon" className={styles.icon} />
        </button>
      </div>
      {
        !hasViewed && <WelcomeMessage />
      }
    </>
  );
};

export default Home;
