import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import { LinkName, RoomName } from 'src/three/constants';
import { SCENE } from 'src/recoils/scene';
import useScene from 'src/hooks/useScene';
import useSelectedPhoto from 'src/hooks/useSelectedPhoto';
import useReady from 'src/hooks/useReady';

const Canvas: React.FC = () => {
  const { scene, setScene } = useScene();
  const { setSelectedPhoto } = useSelectedPhoto();
  const { setReady } = useReady();
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
          case LinkName.INTRO:
            window.open('https://www.snuaaa.net/');
            break;
          case LinkName.MVP:
            setScene(SCENE.MVP);
            aaaThree.current?.moveScene(SCENE.MVP);
            break;
          case LinkName.STAR:
            setScene(SCENE.GALLERY);
            aaaThree.current?.moveScene(SCENE.GALLERY);
            aaaThree.current?.moveRoom(RoomName.STAR);
            break;
          case LinkName.TRAIL:
            setScene(SCENE.GALLERY);
            aaaThree.current?.moveScene(SCENE.GALLERY);
            aaaThree.current?.moveRoom(RoomName.TRAIL);
            break;
          case LinkName.GUIDE:
            setScene(SCENE.GALLERY);
            aaaThree.current?.moveScene(SCENE.GALLERY);
            aaaThree.current?.moveRoom(RoomName.GUIDE);
            break;
          case LinkName.SOLAR:
            setScene(SCENE.GALLERY);
            aaaThree.current?.moveScene(SCENE.GALLERY);
            aaaThree.current?.moveRoom(RoomName.SOLAR);
            break;
          default:
            break;
        }
      };
      aaaThree.current.onClickPhoto = (modelName) => {
        setSelectedPhoto(modelName);
      };
      aaaThree.current.onLoad = () => {
        setReady(true);
      };
    }
  }, [setScene, setSelectedPhoto, setReady]);

  useEffect(() => {
    if (aaaThree.current) {
      if (scene === SCENE.HOME) {
        aaaThree.current.moveScene(SCENE.HOME);
      }
    }
  }, [scene, aaaThree]);

  return (
    <div className={styles.wrapper}>
      <div ref={canvasWrapper} className={styles.canvas} />
    </div>
  );
};

export default Canvas;
