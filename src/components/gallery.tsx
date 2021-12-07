import React, { Suspense, useCallback } from 'react';
import { css } from '@emotion/css';

import { SCENE } from 'src/recoils/scene';
import homeIcon from 'src/assets/icons/home.png';
import useScene from 'src/hooks/useScene';
import useSelectedPhoto from 'src/hooks/useSelectedPhoto';
import useTooltip from 'src/hooks/useTooltip';
import PhotoDetail from './photoDetail';
import TooltipGallery from './tooltipGallery';

const styles = {
  homeButton: css({
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    userSelect: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  }),
  icon: css({
    height: '3rem',
    width: '3rem',
  }),
};

const Gallery: React.FC = () => {
  const { setScene } = useScene();
  const { selectedPhoto } = useSelectedPhoto();
  const onClickHome = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);
  const { tooltip } = useTooltip();

  return (
    <>
      {
        selectedPhoto
        && (
          <Suspense fallback={<div>loading.....</div>}>
            <PhotoDetail modelName={selectedPhoto} />
          </Suspense>
        )
      }
      <button type="button" className={styles.homeButton} onClick={onClickHome}>
        <img src={homeIcon} alt="homeIcon" className={styles.icon} />
      </button>
      {
        tooltip.gallery && <TooltipGallery />
      }
    </>
  );
};

export default Gallery;
