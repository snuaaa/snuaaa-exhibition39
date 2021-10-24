import { useMemo } from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'styles/animation';

const Login: React.FC = () => {
  const styles = useMemo(() => ({
    wrapper: css({
      position: 'relative',
      padding: '1rem 5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    title: css({
      fontSize: '1.2rem',
      textAlign: 'center',
    }),
    text: css({
      fontSize: '0.8rem',
      lineHeight: 1.5,
      marginTop: '2rem',
      marginBottom: '4rem',
      animation: `${fadeIn} 1s`,
    }),
    loginButton: css({
      border: '2px solid #FFFFFF',
      borderRadius: '2rem',
      padding: '0.5rem 1.5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all ease 0.3s',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
        // color: '#c874f2',
        // borderColor: '#c874f2',
      },
    }),
    cancelButton: css({
      position: 'absolute',
      right: 0,
      bottom: '1rem',
      padding: '0.5rem 1.5rem',
      color: '#FFFFFF',
      fontFamily: 'IM_Hyemin-Regular',
      background: 'transparent',
      cursor: 'pointer',
      border: 'none',
    }),
  }), []);

  return (
    <>
      <div className={styles.wrapper}>
        <h5 className={styles.title}>투표를 위해서는 구글 로그인이 필요합니다. 로그인 하시겠습니까?</h5>
        <p className={styles.text}>
          서울대학교 아마추어 천문회 AAA는 아래의 목적으로 개인정보를 수집 및 이용하며,
          개인 정보를 안전하게 취급하는데 최선을 다합니다.
          <br />
          <br />
          * 이 사이트에서 수집하는 정보는 다음과 같습니다.
          <br />
          구글 로그인 정보 : MVP 투표, 방명록 작성 시 이용자 식별 및 중복 방지를 위해 수집합니다.
          <br />
          이메일 주소 : 이벤트에 참여하실 때 당첨 시 연락을 위해 수집합니다.
          <br />
          <br />
          수집된 개인정보는 사진전 전시와 이벤트가 모두 종료되는 2021.11.XX 이후로부터 N일 이내에 파기됩니다.
        </p>
        <button type="button" className={styles.loginButton}>로그인 하기</button>
        <button type="button" className={styles.cancelButton}>뒤로가기</button>
      </div>
    </>
  );
};

export default Login;
