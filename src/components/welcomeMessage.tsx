import React, { useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { fadeIn, fadeInOut } from 'src/styles/animation';
import star from 'src/assets/images/star.png';
import useWelcome from 'src/hooks/useWelcome';
import useReady from 'src/hooks/useReady';

const WelcomeMessage: React.FC = () => {
  const { hasViewed, setHasViewed } = useWelcome();
  const { ready } = useReady();

  const styles = useMemo(() => ({
    wrapper: css({
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      background: 'linear-gradient(180deg, rgba(12, 13, 45, 0.9) 0%, rgba(9, 18, 65, 0.9) 68.23%, rgba(26, 34, 115, 0.9) 81.25%, rgba(85, 39, 122, 0.9) 94.27%)',
      display: !hasViewed ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      animation: `${fadeIn} 1s`,
      animationDelay: '0.5s',
      animationFillMode: 'both',
    }),
    text: css({
      width: '50%',
      textAlign: 'center',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      lineHeight: 1.5,
      marginTop: '2rem',
      marginBottom: '4rem',
      animation: `${fadeIn} 1s`,
      '@media screen and (max-width: 800px)': {
        width: '90%',
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
      transition: 'all ease 0.3s',
      '&:hover': {
        color: '#c874f2',
        borderColor: '#c874f2',
      },
    }),
    loader: css({
      animation: `${fadeInOut} 2s `,
      animationTimingFunction: 'ease',
      animationIterationCount: 'infinite',
    }),
  }), [hasViewed]);

  return (
    <>
      <div className={cx([styles.wrapper])}>
        <img src={star} alt="star" width={30} height={30} />
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
