import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import { LinkName } from 'src/three/constants';
import { SCENE } from 'src/recoils/scene';
import useScene from 'src/hooks/useScene';
import useSelectedPhoto from 'src/hooks/useSelectedPhoto';

const Canvas: React.FC = () => {
  const { scene, setScene } = useScene();
  const { setSelectedPhoto } = useSelectedPhoto();
  const aaaThree = useRef<AaaThree>();

  const styles = useMemo(() => ({
    wrapper: css({
      position: 'relative',
      overflow: 'hidden',
    }),
    canvas: css({
      userSelect: 'none',
      display: scene === SCENE.INTRO ? 'none' : 'block',
    }),
  }), [scene]);

  const canvasWrapper = useCallback((ref: HTMLDivElement) => {
    if (ref && !aaaThree.current) {
      aaaThree.current = new AaaThree();
      aaaThree.current.init(ref);
      aaaThree.current.animate();
      aaaThree.current.onClickLink = (name) => {
        switch (name) {
          case LinkName.MVP:
            setScene(SCENE.MVP);
            break;
          case LinkName.STAR:
          case LinkName.TRAIL:
          case LinkName.GUIDE:
          case LinkName.SOLAR:
            setScene(SCENE.GALLERY);
            break;
          default:
            break;
        }
      };
      aaaThree.current.onClickPhoto = (name) => {
        setSelectedPhoto(name);
      };
    }
  }, [setScene, setSelectedPhoto]);

  useEffect(() => {
    if (aaaThree.current) {
      aaaThree.current.moveCamera(scene);
    }
  }, [scene, aaaThree]);

  return (
    <div className={styles.wrapper}>
      <div ref={canvasWrapper} className={styles.canvas} />
    </div>
  );
};

export default Canvas;
