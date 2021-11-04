/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { css } from '@emotion/css';
// import { fadeIn } from 'src/styles/animation';
import { useRecoilValue } from 'recoil';
import photo from 'src/recoils/photoSelector';
import { SERVER_URL } from 'src/config';
import checker from 'src/assets/images/checker.png';

const styles = {
  wrapper: css({
    height: '100%',
    width: '100%',
    position: 'relative',
    background: 'linear-gradient(180deg, rgb(12 13 45 / 80%) 0%, rgb(9 18 65 / 80%) 68.23%, rgb(26 34 115 / 80%) 81.25%, rgb(85 39 122 / 80%) 94.27%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }),
  scrollAreaWrapper: css({
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    '&::after': {
      position: 'absolute',
      bottom: '-5rem',
      height: '10rem',
      width: '100%',
      background: 'linear-gradient(180deg, rgb(80 81 113 / 0%) 0%, rgb(34 38 112) 50%, rgb(80 81 113 / 0%) 100%)',
      content: '""',
    },
  }),
  scrollArea: css({
    display: 'flex',
    flexWrap: 'wrap',
    height: '60vh',
    width: '80%',
    justifyContent: 'center',
    overflowY: 'scroll',
    paddingBottom: '5rem',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  thumbnail: css({
    height: '8rem',
    margin: '0.5rem',
  }),
  memberCheck: css({
    zIndex: 1,
    marginTop: '2rem',
    color: '#FFFFFF',
  }),
  memberCheckInput: css({
    display: 'none',
    ':checked + label:before': {
      backgroundColor: '#AC3A63',
      backgroundImage: `url(${checker})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      borderColor: '#AC3A63',
    },
  }),
  memberCheckLabel: css({
    position: 'relative',
    fontFamily: 'IM_Hyemin-Regular',
    cursor: 'pointer',
    paddingLeft: '1.5rem',
    // userSelect: 'none',
    '&::before': {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      margin: 'auto 0',
      height: '1rem',
      width: '1rem',
      border: '2px solid #FFFFFF',
      content: '""',
    },
  }),
  submitButton: css({
    marginTop: '1rem',
    width: '10rem',
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
};

const Vote: React.FC = () => {
  const photoList = useRecoilValue(photo);
  const memberCheckerId = 'memberChecker';

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.scrollAreaWrapper}>
          <div className={styles.scrollArea}>
            {
              photoList.map((_photo) => (
                <img
                  className={styles.thumbnail}
                  src={`${SERVER_URL}/static/${_photo.thumbnail_path}`}
                  alt={`thumbnail_${_photo.photo_id}`}
                  key={`thumbnail_${_photo.photo_id}`}
                />
              ))
            }
          </div>
        </div>
        <div className={styles.memberCheck}>
          <input id={memberCheckerId} type="checkbox" className={styles.memberCheckInput} />
          <label htmlFor={memberCheckerId} className={styles.memberCheckLabel}>
            나는 AAA회원입니다.
          </label>
        </div>
        <button type="button" className={styles.submitButton}>
          투표하기
        </button>
      </div>
    </>
  );
};

export default Vote;
