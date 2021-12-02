import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { css } from '@emotion/css';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';
import musicEnabledIcon from 'src/assets/icons/music_enabled.svg';
import musicDisabledIcon from 'src/assets/icons/music_disabled.svg';
import homeBGM from 'src/assets/bgms/home_bgm.mp3';
import roomBGM from 'src/assets/bgms/room_bgm.mp3';

declare module '*.mp3';

const styles = {
  wrapper: css({
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    zIndex: 20,
  }),
  button: css({
    background: 'none',
  }),
  icon: css({
    width: '3rem',
    height: '3rem',
  }),
};

const Music: React.FC = () => {
  const [isMute, setIsMute] = useState(true);
  const { scene } = useScene();
  const homeBgmRef = useRef<HTMLAudioElement>(null);
  const roomBgmRef = useRef<HTMLAudioElement>(null);

  const onClickButton = useCallback(() => {
    setIsMute(!isMute);
  }, [isMute, setIsMute]);

  useEffect(() => {
    if (homeBgmRef.current && roomBgmRef.current) {
      if (!isMute) {
        if (scene === SCENE.GALLERY) {
          homeBgmRef.current.pause();
          roomBgmRef.current.volume = 1;
          roomBgmRef.current.play();
        } else {
          roomBgmRef.current.pause();
          homeBgmRef.current.volume = 1;
          homeBgmRef.current.play();
        }
      } else {
        homeBgmRef.current.pause();
        roomBgmRef.current.pause();
      }
    }
  }, [isMute, scene]);

  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={onClickButton} className={styles.button}>
        <img src={isMute ? musicDisabledIcon : musicEnabledIcon} alt="music_icon" className={styles.icon} />
      </button>
      { /* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={homeBgmRef}
        src={homeBGM}
        muted={isMute}
        autoPlay
        loop
      />
      { /* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={roomBgmRef}
        src={roomBGM}
        muted={isMute}
        autoPlay
        loop
      />
    </div>
  );
};

export default Music;
