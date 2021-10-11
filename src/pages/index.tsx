import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback } from 'react';
import Image from 'next/image';
import AaaThree from 'src/three/aaaThree';
import slogan from 'public/assets/images/slogan.svg';
import { css } from '@emotion/css';

// import towerModel from 'public/assets/models/tower.gltf';

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
    '@media screen and (max-width: 800px)': {
      width: '100%',
    },
  }),
};

const Home: NextPage = () => {
  const canvasWrapper = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      const aaaThree = new AaaThree();
      aaaThree.init(ref);
      aaaThree.animate();
      aaaThree.onClickLink = (name) => {
        console.log(`[HOME] onClickLink ${name}`)
      }
      // aaaThree.makeTower(towerModel)
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div ref={canvasWrapper} />
      <span className={styles.slogan}>
        <Image src={slogan} alt="for the STARved" />
      </span>
    </div>
  );
};

export default Home;
