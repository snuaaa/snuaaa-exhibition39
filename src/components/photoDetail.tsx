import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { fadeIn } from 'src/styles/animation';
import photoSelector from 'src/recoils/photoSelector';
import { useRecoilValue } from 'recoil';
import { SERVER_URL } from 'src/config';
import userIcon from 'src/assets/icons/user.svg';
import dateIcon from 'src/assets/icons/date.svg';
import locationIcon from 'src/assets/icons/location.svg';
import equipmentIcon from 'src/assets/icons/equipment.svg';
import exposureIcon from 'src/assets/icons/exposure.svg';
import processingIcon from 'src/assets/icons/processing.svg';

type Props = {
  photoId: string;
};

const PhotoDetail: React.FC<Props> = ({ photoId }) => {
  const styles = useMemo(() => ({
    wrapper: css({
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      animation: `${fadeIn} 1s`,
      animationDelay: '0.5s',
      animationFillMode: 'both',
      cursor: 'default',
      '@media screen and (max-width: 800px)': {
        flexDirection: 'column',
      },
    }),
    imgWrapper: css({
      display: 'flex',
      width: '60%',
      height: '100%',
      background: '#000000',
      '@media screen and (max-width: 800px)': {
        width: '100%',
      },
    }),
    img: css({
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'contain',
    }),
    detailWrapper: css({
      width: '40%',
      background: '#00204E',
      height: '100%',
      display: 'flex',
      padding: '3rem',
      justifyContent: 'center',
      flexDirection: 'column',
      '@media screen and (max-width: 800px)': {
        width: '100%',
      },
    }),
    icon: css({
      height: '1.2rem',
      // width: '3rem',
      textAlign: 'left',
      marginRight: '1rem',
    }),
    title: css({
      fontSize: '1.5rem',
      color: '#FFD45F',
    }),
    info: css({
      fontSize: '1rem',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
    }),
    description: css({
      fontSize: '0.9rem',
      color: '#FFFFFF',
      lineHeight: 1.5,
    }),
    detailTop: css({
      height: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }),
    detailBottom: css({
      height: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }),
    divider: css({
      width: '100%',
      overflow: 'hidden',
      letterSpacing: '1rem',
      textAlign: 'center',
      color: '#FFFFFF',
      '&::after': {
        content: '"........................"',
      },
    }),
  }), []);

  const photoList = useRecoilValue(photoSelector);
  const photoInfo = useMemo(
    () => photoList.find((photo) => photo.photo_id === photoId),
    [photoId, photoList],
  );

  return (
    <>
      {
        photoInfo
        && (
          <div className={styles.wrapper}>
            <div className={styles.imgWrapper}>
              <img
                className={styles.img}
                src={`${SERVER_URL}/static/${photoInfo.file_path}`}
                alt={photoInfo.photo_id}
              />
            </div>
            <div className={styles.detailWrapper}>
              <div className={styles.detailTop}>
                <h3 className={styles.title}>{photoInfo.title}</h3>
                <p className={styles.info}>
                  <img className={styles.icon} src={userIcon} alt="userIcon" />
                  {photoInfo.photograper}
                </p>
                <p className={styles.description}>
                  {photoInfo.story}
                </p>
              </div>
              <div className={styles.divider} />
              <div className={styles.detailBottom}>
                <p className={styles.info}>
                  <img className={styles.icon} src={dateIcon} alt="dateIcon" />
                  {photoInfo.date.substr(0, 10)}
                </p>
                <p className={styles.info}>
                  <img className={styles.icon} src={locationIcon} alt="locationIcon" />
                  {photoInfo.location}
                </p>
                <p className={styles.info}>
                  <img className={styles.icon} src={equipmentIcon} alt="equipmentIcon" />
                  {photoInfo.equipment}
                </p>
                <p className={styles.info}>
                  <img className={styles.icon} src={exposureIcon} alt="exposureIcon" />
                  {photoInfo.exposure}
                </p>
                <p className={styles.info}>
                  <img className={styles.icon} src={processingIcon} alt="processIcon" />
                  {photoInfo.processing}
                </p>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default PhotoDetail;
