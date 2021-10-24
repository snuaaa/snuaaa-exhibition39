import type { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import slogan from 'public/assets/images/slogan.svg';
import { smaller } from 'styles/animation';
import Notice from './notice';
import MVP from './mvp';

const styles = {
  wrapper: css({
    position: 'relative',
    overflow: 'hidden',
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

const Home: NextPage = () => {
  const [isMVP, setIsMVP] = useState(false);

  const canvasWrapper = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      const aaaThree = new AaaThree();
      aaaThree.init(ref);
      aaaThree.animate();
      aaaThree.onClickLink = (name) => {
        console.log(`[HOME] onClickLink ${name}`);
        if (name === 'link_mvp') {
          setIsMVP(true);
        }
      };
      // aaaThree.makeTower(towerModel)
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div ref={canvasWrapper} className={styles.canvas} />
      <span className={styles.slogan}>
        <Image src={slogan} alt="for the STARved" />
      </span>
      <Notice />
      {
        isMVP && <MVP />
      }
    </div>
  );
};

export default Home;
