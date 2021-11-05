import React, { useCallback, useEffect, useRef } from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import slogan from 'src/assets/images/slogan.svg';
import { smaller } from 'src/styles/animation';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';
import Notice from './notice';
import MVP from './mvp';

const styles = {
  wrapper: css({
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
  }),
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
  const { scene, setScene } = useScene();
  const aaaThree = useRef<AaaThree>();

  const canvasWrapper = useCallback((ref: HTMLDivElement) => {
    if (ref && !aaaThree.current) {
      aaaThree.current = new AaaThree();
      aaaThree.current.init(ref);
      aaaThree.current.animate();
      aaaThree.current.onClickLink = (name) => {
        if (name === 'link_mvp') {
          setScene(SCENE.MVP);
        }
      };
      // aaaThree.makeTower(towerModel)
    }
  }, [setScene]);

  useEffect(() => {
    if (aaaThree.current) {
      aaaThree.current.moveCamera(scene);
    }
  }, [scene, aaaThree]);

  return (
    <div className={styles.wrapper}>
      <div ref={canvasWrapper} className={styles.canvas} />
      {/* <span > */}
      <img className={styles.slogan} src={slogan} alt="for the STARved" />
      {/* </span> */}
      <Notice />
      {
        scene === SCENE.MVP && <MVP />
      }
    </div>
  );
};

export default Home;
