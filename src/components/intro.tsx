import { useEffect, useState } from 'react';
import Image from 'next/image';
import { css, cx, keyframes } from '@emotion/css';
import frameTop from 'public/assets/images/frame_top.png';
import frameBottom from 'public/assets/images/frame_bottom.png';

const animation = {
  fadeIn: keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  }),
};

const styles = {
  wrapper: css({
    height: '100%',
    background: 'linear-gradient(180deg, #0C0D2D 0%, #091241 11.46%, #1A2273 45.83%, #55277A 71.87%, #A04DA6 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  text: css({
    color: '#FFFFFF',
    fontFamily: 'IM_Hyemin-Regular',
    animation: `${animation.fadeIn} 1s`,
  }),
  frame: css({
    width: '40rem',
    margin: '2rem 0',
  }),
};

const messages = [
  '때는 바야흐로 2021년.',
  '심각한 역병이 세상을 위협했고,',
  '사람들은 안온한 일상에 주려가고 있었다.',
  '그 중엔 특히 별에 굶주린 자가 있었으니...',
];

type Props = {
  skip: () => void;
};

const Intro: React.FC<Props> = ({ skip }) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (index < messages.length - 1) {
        setIndex((idx) => idx + 1);
      } else {
        skip();
      }
    }, 2000);
    return () => window.clearInterval(interval);
  }, [index, skip]);

  return (
    <>
      <div className={cx([styles.wrapper])}>
        <span className={cx([styles.frame])}>
          <Image src={frameTop} alt="frame" />
        </span>
        <p className={styles.text} key={index}>
          {messages[index]}
        </p>
        <span className={styles.frame}>
          <Image src={frameBottom} alt="frame" />
        </span>
      </div>
    </>
  );
};

export default Intro;
