import React, {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { css, cx } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import { LinkName, RoomName } from 'src/three/constants';
import { SCENE } from 'src/recoils/scene';
import useScene from 'src/hooks/useScene';
import useSelectedPhoto from 'src/hooks/useSelectedPhoto';
import useReady from 'src/hooks/useReady';
import forwardIcon from 'src/assets/icons/forward.svg';
import leftIcon from 'src/assets/icons/left.svg';
import rightIcon from 'src/assets/icons/right.svg';
import backwardIcon from 'src/assets/icons/backward.svg';

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
    joystick: css({
      position: 'absolute',
      bottom: '4rem',
      left: '4rem',
      userSelect: 'none',
      height: '3rem',
      width: '3rem',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)',
    }),
    iconButton: css({
      position: 'absolute',
      background: 'none',
      padding: 0,
      userSelect: 'none',
    }),
    leftIconButton: css({
      left: '-100%',
    }),
    rightIconButton: css({
      right: '-100%',
    }),
    forwardIconButton: css({
      top: '-100%',
    }),
    backwardIconButton: css({
      bottom: '-100%',
    }),
    icon: css({
      height: '3rem',
      width: '3rem',
      display: 'block',
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
          case LinkName.PROJECT:
            setScene(SCENE.NEWBIE_PROJECT);
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

  const onClickLeft = useCallback(() => {
    if (aaaThree.current) {
      aaaThree.current.moveLeft();
    }
  }, []);

  const onClickRight = useCallback(() => {
    if (aaaThree.current) {
      aaaThree.current.moveRight();
    }
  }, []);

  const onClickForward = useCallback(() => {
    if (aaaThree.current) {
      aaaThree.current.moveForward();
    }
  }, []);

  const onClickBackword = useCallback(() => {
    if (aaaThree.current) {
      aaaThree.current.moveBackward();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {
        scene === SCENE.GALLERY
        && (
          <div className={styles.joystick}>
            <button type="button" className={cx([styles.iconButton, styles.leftIconButton])} onClick={onClickLeft}>
              <img src={leftIcon} alt="leftIcon" className={styles.icon} />
            </button>
            <button type="button" className={cx([styles.iconButton, styles.rightIconButton])} onClick={onClickRight}>
              <img src={rightIcon} alt="rightIcon" className={styles.icon} />
            </button>
            <button type="button" className={cx([styles.iconButton, styles.forwardIconButton])} onClick={onClickForward}>
              <img src={forwardIcon} alt="frontIcon" className={styles.icon} />
            </button>
            <button type="button" className={cx([styles.iconButton, styles.backwardIconButton])} onClick={onClickBackword}>
              <img src={backwardIcon} alt="backIcon" className={styles.icon} />
            </button>
          </div>
        )
      }
      <div ref={canvasWrapper} className={styles.canvas} />
    </div>
  );
};

export default Canvas;
