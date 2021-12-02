import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { css, cx } from '@emotion/css';
import { fadeInOut } from 'src/styles/animation';
import useWelcome from 'src/hooks/useWelcome';
import useReady from 'src/hooks/useReady';
import slogan from 'src/assets/images/slogan.png';
import background from 'src/assets/images/background_star.png';

const WelcomeMessage: React.FC = () => {
  const { hasViewed, setHasViewed } = useWelcome();
  const { ready } = useReady();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = () => {
        setIsImageLoaded(true);
      };
    }
  }, []);

  const styles = useMemo(() => ({
    wrapper: css({
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      backgroundImage: `url(${background})`,
      background: 'linear-gradient(180deg, #0C0D2D 0%, #091241 11.46%, #1A2273 45.83%, #55277A 71.87%, #A04DA6 100%);',
      display: !hasViewed ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      cursor: 'default',
    }),
    text: css({
      width: '50%',
      textAlign: 'center',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      lineHeight: 1.5,
      marginTop: '2rem',
      marginBottom: '4rem',
      // animation: `${fadeIn} 1s`,
      opacity: isImageLoaded ? 1 : 0,
      transition: 'all ease 0.5s',
      '@media screen and (max-width: 800px)': {
        width: '80%',
        fontSize: '0.9rem',
      },
    }),
    button: css({
      border: '2px solid #FFFFFF',
      borderRadius: '2rem',
      padding: '0.5rem 1.5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all ease 0.5s',
      zIndex: 1,
      opacity: isImageLoaded ? 1 : 0,
      '&:hover': {
        color: '#c874f2',
        borderColor: '#c874f2',
      },
    }),
    loader: css({
      animation: `${fadeInOut} 2s `,
      animationTimingFunction: 'ease',
      animationIterationCount: 'infinite',
      margin: 0,
      opacity: isImageLoaded ? 1 : 0,
      transition: 'all ease 0.5s',
    }),
    slogan: css({
      width: '30rem',
      opacity: isImageLoaded ? 1 : 0,
      transition: 'all ease 0.5s',
      '@media screen and (max-width: 800px)': {
        width: '80%',
      },
    }),
    background: css({
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
    }),
  }), [hasViewed, isImageLoaded]);

  return (
    <>
      <div className={cx([styles.wrapper])}>
        <img ref={imgRef} className={styles.background} src={background} alt="background" />
        <img src={slogan} alt="star" className={styles.slogan} />
        <p className={styles.text}>
          지난 1년간 코로나바이러스 유행이 더 심화됨에 따라, 동아리 활동에도 큰 차질이 있었습니다.
          <br />
          하지만 동아리원들의 열정은 사그라들지 않았고, 주어진 여건 내에서도 항상 별을 찾았습니다.
          <br />
          <br />
          저 깊은 어둠 속에서 묵묵히 빛을 내는,
          <br />
          별들의 아름다움을 보여주기 위해서.
          <br />
          이 힘든 상황 속에서도 꿋꿋이 살아가는,
          <br />
          별고픈 모든 이들을 위하여.
          <br />
          <br />
          그러한 1년간 활동의 흔적에 당신을 초대합니다.
          <br />
          <br />
          - AAA 83대 회장 오종주
        </p>
        {
          ready
            ? <button className={styles.button} type="button" onClick={() => setHasViewed(true)}>사진전 입장하기</button>
            : <p className={cx([styles.text, styles.loader])}>Loading...</p>
        }
      </div>
    </>
  );
};

export default WelcomeMessage;
