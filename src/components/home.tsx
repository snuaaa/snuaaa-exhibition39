import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import slogan from 'src/assets/images/slogan.svg';
import { smaller } from 'src/styles/animation';
import useScene from 'src/hooks/useScene';
import useWelcome from 'src/hooks/useWelcome';
import WelcomeMessage from './welcomeMessage';

const styles = {
  slogan: css({
    position: 'absolute',
    top: 0,
    right: 0,
    // height: 300,
    maxWidth: 1000,
    width: '50%',
    userSelect: 'none',
    animation: `${smaller('50%', '25%')} 1s`,
    animationDelay: '0.5s',
    animationFillMode: 'both',
    '@media screen and (max-width: 800px)': {
      width: '100%',
    },
  }),
  canvas: css({
    userSelect: 'none',
  }),
};

const Home: React.FC = () => {
  const { scene } = useScene();
  const aaaThree = useRef<AaaThree>();
  const { hasViewed, setHasViewed } = useWelcome();

  useEffect(() => {
    if (aaaThree.current) {
      aaaThree.current.moveCamera(scene);
    }
  }, [scene, aaaThree]);

  return (
    <>
      <img className={styles.slogan} src={slogan} alt="for the STARved" />
      {
        !hasViewed && <WelcomeMessage />
      }
    </>
  );
};

export default Home;
