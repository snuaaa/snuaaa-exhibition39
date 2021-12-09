/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { css, cx } from '@emotion/css';
import instagramIcon from 'src/assets/icons/instagram.svg';
import goodsIcon from 'src/assets/icons/goods.svg';
import cancelIcon from 'src/assets/icons/cancel.svg';

const styles = {
  wrapper: css({
    position: 'absolute',
    bottom: '6rem',
    right: '1rem',
    width: '15rem',
    userSelect: 'none',
    background: 'rgba(73, 81, 138, 0.9)',
    cursor: 'default',
    textAlign: 'center',
    borderRadius: '2rem',
    padding: '1rem',
    color: '#FFFFFF',
    '@media screen and (max-width: 800px)': {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
      width: '80%',
      height: '80%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '@media screen and (max-height: 800px)': {
      height: '90%',
    },
  }),
  title: css({
    fontFamily: 'FOUREYES',
    fontSize: '1.2rem',
    fontWeight: 400,
    margin: '1rem 0',
    '@media screen and (max-height: 800px)': {
      margin: '1rem 0 0 0',
      fontSize: '1.1rem',
    },
    '@media screen and (max-height: 600px)': {
      margin: '0.9rem 0 0 0',
      fontSize: '1rem',
    },
  }),
  text: css({
    lineHeight: 1.5,
    '@media screen and (max-height: 600px)': {
      fontSize: '0.8rem',
    },
  }),
  contact: css({
    display: 'flex',
    justifyContent: 'center',
  }),
  contactText: css({
    textAlign: 'left',
  }),
  button: css({
    height: '3rem',
    width: '100%',
    borderRadius: '1.5rem',
    background: 'rgba(255, 255, 255, 0.3)',
    color: '#FFFFFF',
    fontSize: '1rem',
    border: '1px solid #FFFFFF',
    '@media screen and (max-height: 800px)': {
      fontSize: '0.9rem',
    },
  }),
  cancelButton: css({
    background: 'none',
  }),
  cancelIcon: css({
    height: '1.5rem',
    width: '1.5rem',
  }),
  instagramIconLink: css({
    display: 'flex',
  }),
  instagramIcon: css({
    marginLeft: '1rem',
  }),
};

type Props = {
  close: () => void;
};

const Event: React.FC<Props> = ({ close }) => {
  useEffect(() => {
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, [close]);

  return (
    <>
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <h4 className={styles.title}>* EVENT *</h4>
        <h4 className={styles.title}>사진전 퀴즈 이벤트</h4>
        <p className={styles.text}>
          사진전을 구석구석 둘러보신 후 퀴즈를 풀면 3명을 추첨하여 &lt;블랙 은하 책갈피&gt;를 선물해드립니다!!
          <br />
          <br />
          ~ 12월 16일까지
        </p>
        <a href="https://forms.gle/Bd8FrBhe2rFn8Z6k6" target="_blank" rel="noreferrer">
          <button type="button" className={styles.button}>퀴즈 풀러가기</button>
        </a>
        <h4 className={styles.title}>* GOODS *</h4>
        <img src={goodsIcon} alt="goodsIcon" />
        <a href="https://forms.gle/VwBkBtV73quczMWX8" target="_blank" rel="noreferrer">
          <button type="button" className={styles.button}>굿즈 구매하기</button>
        </a>
        <div className={styles.contact}>
          <p className={cx([styles.text, styles.contactText])}>
            AAA의 다양한 소식
            <br />
            빠르게 보러가기 &gt;&gt;
          </p>
          <a href="https://www.instagram.com/snuaaa/" target="_blank" rel="noreferrer" className={styles.instagramIconLink}>
            <img src={instagramIcon} alt="instagramIcon" className={styles.instagramIcon} />
          </a>
        </div>
        <button type="button" onClick={close} className={styles.cancelButton}>
          <img src={cancelIcon} alt="cancelIcon" className={styles.cancelIcon} />
        </button>
      </div>
    </>
  );
};

export default Event;
