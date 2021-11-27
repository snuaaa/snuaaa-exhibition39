import React, { Suspense, useCallback } from 'react';
import { css } from '@emotion/css';

import { SCENE } from 'src/recoils/scene';
import homeIcon from 'src/assets/icons/home.png';
import useScene from 'src/hooks/useScene';
import useSelectedPhoto from 'src/hooks/useSelectedPhoto';
import PhotoDetail from './photoDetail';

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
  const { selectedPhoto } = useSelectedPhoto();
  const onClickHome = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);

  return (
    <>
      {
        selectedPhoto
        && (
          <Suspense fallback={<div>loading.....</div>}>
            <PhotoDetail photoId={selectedPhoto} />
          </Suspense>
        )
      }
      <button type="button" className={styles.homeButton} onClick={onClickHome}>
        <img src={homeIcon} alt="homeIcon" />
      </button>
    </>
  );
};

export default Gallery;
