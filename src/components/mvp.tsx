import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import useAuth from 'src/hooks/useAuth';
import Login from './login';

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
    width: '50rem',
    padding: '1rem',
    borderRadius: '2rem',
    background: 'rgba(172, 58, 99, 0.7)',
    transition: 'all ease 0.3s',
  }),
  text: css({
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'IM_Hyemin-Regular',
    fontSize: '2rem',
    lineHeight: 1.5,
    animation: `${fadeIn} 1s`,
  }),
};

const MVP: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const { isLogin } = useAuth();

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

  const makeView = useCallback(() => {
    if (!isMessageEnd) {
      return (
        <p className={styles.text} key={index}>
          {messages[index]}
        </p>
      );
    }
    if (!isLogin) {
      return <Login />;
    }
    return <div>kkk</div>;
  }, [index, isMessageEnd, isLogin]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          {makeView()}
        </div>
      </div>
    </>
  );
};

export default MVP;
