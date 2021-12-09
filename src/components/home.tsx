import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { css } from '@emotion/css';

import AaaThree from 'src/three/aaaThree';
import slogan from 'src/assets/images/slogan.png';
import useScene from 'src/hooks/useScene';
import useWelcome from 'src/hooks/useWelcome';
import guestbookIcon from 'src/assets/icons/guestbook.svg';
import voteIcon from 'src/assets/icons/vote.svg';
import eventIcon from 'src/assets/icons/event.svg';
import { SCENE } from 'src/recoils/scene';
import useTooltip from 'src/hooks/useTooltip';
import WelcomeMessage from './welcomeMessage';
import TooltipHome from './tooltipHome';
import Event from './event';

const styles = {
  slogan: css({
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    // height: 300,
    maxWidth: 1000,
    width: '25%',
    userSelect: 'none',
    // animation: `${smaller('50%', '25%')} 1s`,
    animationDelay: '0.5s',
    animationFillMode: 'both',
    '@media screen and (max-width: 800px)': {
      width: '50%',
    },
  }),
  buttonWrapper: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: '1rem',
  }),
  button: css({
    background: 'none',
  }),
  icon: css({
    height: '3rem',
  }),
  canvas: css({
    userSelect: 'none',
  }),
};

const Home: React.FC = () => {
  const { scene, setScene } = useScene();
  const aaaThree = useRef<AaaThree>();
  const { hasViewed } = useWelcome();
  const { tooltip } = useTooltip();
  const [viewEvent, setViewEvent] = useState(false);

  useEffect(() => {
    if (aaaThree.current) {
      aaaThree.current.moveScene(scene);
    }
  }, [scene, aaaThree]);

  const onClickGuestBook = useCallback(() => {
    setScene(SCENE.GUESTBOOK);
  }, [setScene]);

  const onClickMVP = useCallback(() => {
    setScene(SCENE.MVP);
  }, [setScene]);

  const openEvent = useCallback(() => {
    setViewEvent(true);
  }, [setViewEvent]);

  const closeEvent = useCallback(() => {
    setViewEvent(false);
  }, [setViewEvent]);

  return (
    <>
      <img className={styles.slogan} src={slogan} alt="for the STARved" />
      <div className={styles.buttonWrapper}>
        <button type="button" className={styles.button} onClick={onClickGuestBook}>
          <img src={guestbookIcon} alt="guestbookIcon" className={styles.icon} />
        </button>
        <button type="button" className={styles.button} onClick={onClickMVP}>
          <img src={voteIcon} alt="voteIcon" className={styles.icon} />
        </button>
        <button type="button" className={styles.button} onClick={openEvent}>
          <img src={eventIcon} alt="eventIcon" className={styles.icon} />
        </button>
      </div>
      {
        viewEvent && <Event close={closeEvent} />
      }
      {
        tooltip.home && <TooltipHome />
      }
      {
        !hasViewed && <WelcomeMessage />
      }
    </>
  );
};

export default Home;
