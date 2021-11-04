import React from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import { useRecoilValue } from 'recoil';
import photo from 'src/recoils/photoSelector';

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

const Vote: React.FC = () => {
  const photoList = useRecoilValue(photo);
  console.log(photoList);
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          {
            photoList.map((_photo) => (
              <p>
                {_photo.photo_id}
              </p>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default Vote;
