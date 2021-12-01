import React, {
  Suspense,
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import useToken from 'src/hooks/useToken';
import useAuth from 'src/hooks/useAuth';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';
import Login from './login';
import Vote from './vote';

const messages = [
  '안녕하세요? 이곳은 MVP Zone입니다.',
  'MVP Zone은 투표를 통해 최고의 사진을 뽑는 곳이에요.',
  '당신의 마음을 가장 크게 울린 사진 한 장은 무엇이엇나요?',
];

const styles = {
  wrapper: css({
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    animation: `${fadeIn} 1s`,
    animationDelay: '0.5s',
    animationFillMode: 'both',
  }),
  textWrapper: css({
    width: '50%',
    padding: '1rem',
    borderRadius: '2rem',
    background: 'rgba(172, 58, 99, 0.7)',
    transition: 'all ease 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media screen and (max-width: 1200px)': {
      width: '60%',
    },
    '@media screen and (max-width: 1000px)': {
      width: '80%',
    },
    '@media screen and (max-width: 800px)': {
      width: '90%',
      padding: 0,
    },
  }),
  text: css({
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'IM_Hyemin-Regular',
    fontSize: '2rem',
    lineHeight: 1.5,
    animation: `${fadeIn} 1s`,
    '@media screen and (max-width: 800px)': {
      fontSize: '1.3rem',
    },
  }),
  button: css({
    width: '10rem',
    background: 'none',
    padding: '0.5rem',
    border: '2px solid #FFFFFF',
    borderRadius: '2rem',
    color: '#FFFFFF',
    fontSize: '1.3rem',
    cursor: 'pointer',
  }),
};

const MVP: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const { isLogin } = useToken();
  const { auth: { hasVoted } } = useAuth();
  const { setScene } = useScene();

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (index < messages.length) {
        setIndex((idx) => idx + 1);
      }
    }, 2000);
    return () => {
      window.clearInterval(interval);
    };
  }, [index]);

  const isMessageEnd = useMemo(() => (index === messages.length), [index]);

  const onClickButton = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);

  const makeView = useCallback(() => {
    if (hasVoted) {
      return (
        <div className={styles.textWrapper}>
          <p className={styles.text}>
            MVP 투표에 참여해주셔서 감사합니다!
          </p>
          <button type="button" className={styles.button} onClick={onClickButton}>홈으로</button>
        </div>
      );
    }
    if (!isMessageEnd) {
      return (
        <div className={styles.textWrapper}>
          <p className={styles.text} key={index}>
            {messages[index]}
          </p>
        </div>
      );
    }
    if (!isLogin) {
      return (
        <div className={styles.textWrapper}>
          <Login />
        </div>
      );
    }
    return (
      <Suspense fallback={<div>loading.....</div>}>
        <Vote />
      </Suspense>
    );
  }, [index, isMessageEnd, isLogin, hasVoted, onClickButton]);

  return (
    <>
      <div className={styles.wrapper}>
        {makeView()}
      </div>
    </>
  );
};

export default MVP;
