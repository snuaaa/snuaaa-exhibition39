import React, { useMemo, useState } from 'react';
import { css, cx } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import star from 'src/assets/images/star.png';

const Notice: React.FC = () => {
  const [isOpened, setIsOpened] = useState<boolean>(true);

  const styles = useMemo(() => ({
    wrapper: css({
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      background: 'linear-gradient(180deg, rgba(12, 13, 45, 0.9) 0%, rgba(9, 18, 65, 0.9) 68.23%, rgba(26, 34, 115, 0.9) 81.25%, rgba(85, 39, 122, 0.9) 94.27%)',
      display: isOpened ? 'flex' : 'none',
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
  }), [isOpened]);

  return (
    <>
      <div className={cx([styles.wrapper])}>
        <img src={star} alt="star" width={30} height={30} />
        <p className={styles.text}>
          전세계적 팬데믹은 많은 사람들을 불안과 혼란 속에 빠뜨렸습니다. 각 개인의 큰 노력과
          희생에도 불구하고 우리나라 또한 이 난국을 완전히 피해가지는 못했습니다.
          <br />
          <br />
          &apos;몸은 멀리, 별은 가까이&apos; 이 불편한 시국을 헤쳐나가기 위해 서로를 멀리 떨어뜨린
          우리 동아리원들은 언제나 하늘에서 빛나고 있는 별을 보며 다시 하나가 되었습니다.
          그러한 활동은 사진으로 기록되어 남았습니다.
          <br />
          <br />
          동아리원들의 1년간의 발자취에 당신을 초대합니다.
          <br />
          <br />
          - AAA 83대 회장 오종주
        </p>
        <button className={styles.button} type="button" onClick={() => setIsOpened(false)}>사진전 입장하기</button>
      </div>
    </>
  );
};

export default Notice;
