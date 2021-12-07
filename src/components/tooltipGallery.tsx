import React, {
  useCallback,
  useMemo,
} from 'react';
import { css, cx } from '@emotion/css';
import useTooltip from 'src/hooks/useTooltip';
import actionImg from 'src/assets/images/action.svg';
import frameImg from 'src/assets/images/frame.png';

const TooltipGallery: React.FC = () => {
  const styles = useMemo(() => ({
    wrapper: css({
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      zIndex: 10,
      cursor: 'default',
      background: 'rgba(0, 0, 0, 0.7)',
    }),
    musicTooltip: css({
      position: 'absolute',
      top: '2rem',
      left: '6rem',
    }),
    actionTooltip: css({
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '@media screen and (max-width: 800px)': {
        flexDirection: 'column',
      },
    }),
    actionImg: css({
      height: '50%',
      '@media screen and (max-width: 800px)': {
        width: '10rem',
      },
      '@media screen and (max-width: 600px)': {
        width: '8rem',
      },
    }),
    actionText: css({
      '@media screen and (max-width: 800px)': {
        marginTop: '-4rem',
      },
    }),
    frameImg: css({
      border: '5px solid rgba(255, 255, 255, 0.6)',
      '@media screen and (max-width: 800px)': {
        width: '10rem',
      },
      '@media screen and (max-width: 600px)': {
        width: '8rem',
      },
    }),
    frameText: css({
      '@media screen and (max-width: 800px)': {
        width: '10rem',
      },
      '@media screen and (max-width: 600px)': {
        width: '8rem',
      },
    }),
    centerTooltip: css({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }),
    photoTooltip: css({
      display: 'flex',
      flexDirection: 'column',
    }),
    iconTooltip: css({
      position: 'absolute',
      right: '1.5rem',
      bottom: '5rem',
      display: 'flex',
    }),
    joystickTooltip: css({
      position: 'absolute',
      left: '10rem',
      bottom: '5rem',
    }),
    text: css({
      color: '#FFFFFF',
      lineHeight: 1.5,
      margin: 0,
      '@media screen and (max-width: 800px)': {
        fontSize: '0.8rem',
      },
    }),
    iconText: css({
      width: '3rem',
      textAlign: 'center',
    }),
  }), []);

  const { setTooltipGallery } = useTooltip();

  const close = useCallback(() => {
    setTooltipGallery(false);
  }, [setTooltipGallery]);

  return (
    <>
      <div className={cx([styles.wrapper])} onClick={close} onKeyDown={() => { }} role="none">
        <div className={styles.musicTooltip}>
          <p className={styles.text}>
            아름다운 음악이 흘러나오고 있어요!
            <br />
            꼭 소리를 켜고 관람해주세요 :)
          </p>
        </div>
        <div className={styles.joystickTooltip}>
          <p className={styles.text}>
            키보드 방향키 혹은 좌측의 화살표를
            <br />
            클릭하여 움직이세요.
          </p>
        </div>
        <div className={styles.centerTooltip}>
          <div>
            <img src={frameImg} alt="frameImg" className={styles.frameImg} />
            <p className={cx([styles.text, styles.frameText])}>
              사진에 가까이 가신 후 사진을 클릭하시면
              <br />
              상세 설명을 보실 수 있습니다.
            </p>
          </div>
          <div className={styles.actionTooltip}>
            <img src={actionImg} alt="actionImg" className={styles.actionImg} />
            <p className={cx([styles.text, styles.actionText])}>
              자유롭게
              <br />
              드래그해보세요!
              <br />
            </p>
          </div>
        </div>
        <div className={styles.iconTooltip}>
          <p className={cx([styles.text, styles.iconText])}>HOME</p>
        </div>
      </div>
    </>
  );
};

export default TooltipGallery;
