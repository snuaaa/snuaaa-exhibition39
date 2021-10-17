import { useEffect, useState } from 'react';
import Image from 'next/image';
import { css, cx, keyframes } from '@emotion/css';
import frameTop from 'public/assets/images/frame_top.png';
import frameBottom from 'public/assets/images/frame_bottom.png';
import character from 'public/assets/images/charactor.png';
import spotlight from 'public/assets/images/spotlight.png';
import thinking from 'public/assets/images/thinking.png';

const animation = {
  fadeIn: keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  }),
  fadeInOut: keyframes({
    from: {
      opacity: 0,
    },
    '30%': {
      opacity: 1,
    },
    '70%': {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  }),
  smaller: keyframes({
    from: {
      width: '15rem',
    },
    to: {
      width: '5rem',
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
  characterWrapper: css({
    width: '15rem',
    position: 'relative',
    height: '20rem',
    animation: `${animation.smaller} 2s`,
    animationDelay: '5.5s',
    animationFillMode: 'both',
  }),
  character: css({
    position: 'absolute',
    bottom: '10%',
    width: '75%',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    animation: `${animation.fadeIn} 1s`,
    animationDelay: '0.5s',
    animationFillMode: 'both',
  }),
  spotlight: css({
    position: 'absolute',
    bottom: '0',
    animation: `${animation.fadeInOut} 4s`,
    animationDelay: '2s',
    animationFillMode: 'both',
  }),
  thinking: css({
    position: 'absolute',
    bottom: '8rem',
    right: '-6rem',
    width: '50%',
    animation: `${animation.fadeInOut} 3s`,
    animationDelay: '3s',
    animationFillMode: 'both',
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
    let timeout: number = 0;
    const interval = window.setInterval(() => {
      if (index < messages.length - 1) {
        setIndex((idx) => idx + 1);
      } else {
        timeout = window.setTimeout(() => {
          skip();
        }, 5000);
      }
    }, 2000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [index, skip]);

  const isMessageEnd = index === messages.length - 1;

  return (
    <>
      <div className={cx([styles.wrapper])}>
        {
          isMessageEnd
            ? (
              <div className={styles.characterWrapper}>
                <span className={styles.character}>
                  <Image src={character} alt="character" />
                </span>
                <span className={styles.spotlight}>
                  <Image src={spotlight} alt="spotlight" />
                </span>
                <span className={styles.thinking}>
                  <Image src={thinking} alt="thinking" />
                </span>
              </div>
            ) : (
              <>
                <span className={cx([styles.frame])}>
                  <Image src={frameTop} alt="frame" />
                </span>
                <p className={styles.text} key={index}>
                  {messages[index]}
                </p>
                <span className={styles.frame}>
                  <Image src={frameBottom} alt="frame" />
                </span>
              </>
            )
        }
      </div>
    </>
  );
};

export default Intro;
