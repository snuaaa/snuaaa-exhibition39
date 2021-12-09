import React, {
  useCallback,
  useMemo,
} from 'react';
import { css, cx } from '@emotion/css';
import useTooltip from 'src/hooks/useTooltip';
import actionImg from 'src/assets/images/action.svg';

const TooltipHome: React.FC = () => {
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
      position: 'absolute',
      height: '100%',
      left: '40%',
      display: 'flex',
      alignItems: 'center',
      '@media screen and (max-width: 800px)': {
        left: '20%',
      },
      '@media screen and (max-width: 600px)': {
        left: '10%',
      },
    }),
    actionImg: css({
      height: '50%',
    }),
    iconTooltip: css({
      position: 'absolute',
      right: '1rem',
      bottom: '5rem',
      display: 'flex',
    }),
    text: css({
      color: '#FFFFFF',
      lineHeight: 1.5,
      margin: 0,
    }),
    iconText: css({
      width: '3.5rem',
      textAlign: 'center',
    }),
  }), []);

  const { setTooltipHome } = useTooltip();

  const close = useCallback(() => {
    setTooltipHome(false);
  }, [setTooltipHome]);

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
        <div className={styles.actionTooltip}>
          <img src={actionImg} alt="actionImg" className={styles.actionImg} />
          <p className={styles.text}>
            자유롭게
            <br />
            드래그해보세요!
            <br />
          </p>
        </div>
        <div className={styles.iconTooltip}>
          <p className={cx([styles.text, styles.iconText])}>방명록</p>
          <p className={cx([styles.text, styles.iconText])}>MVP</p>
          <p className={cx([styles.text, styles.iconText])}>이벤트</p>
        </div>
      </div>
    </>
  );
};

export default TooltipHome;
