import React, { useCallback } from 'react';
import { css } from '@emotion/css';

import homeIcon from 'src/assets/icons/home.png';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';

const styles = {
  homeButton: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    userSelect: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  }),
};

const Gallery: React.FC = () => {
  const { setScene } = useScene();
  const onClickHome = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);

  return (
    <>
      <button type="button" className={styles.homeButton} onClick={onClickHome}>
        <img src={homeIcon} alt="homeIcon" />
      </button>
    </>
  );
};

export default Gallery;
