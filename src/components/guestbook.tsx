import React, {
  ChangeEvent, useCallback, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/css';
import dayjs from 'dayjs';

import guestbookTitle from 'src/assets/images/guestbook_title.png';
import useScene from 'src/hooks/useScene';
import useToken from 'src/hooks/useToken';
import cancelIcon from 'src/assets/icons/cancel.svg';
import { SCENE } from 'src/recoils/scene';
import GuestbookService from 'src/services/guestbookService';
import GuestbookType from 'src/types/guestbook';
import Login from './login';

const gradientSize = '3rem';

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
    // animation: `${fadeIn} 1s`,
    // animationDelay: '0.5s',
    // animationFillMode: 'both',
    background: 'linear-gradient(180deg, #0C0D2D 0%, #091241 68.23%, #1A2273 81.25%, #55277A 94.27%)',
  }),
  loginWrapper: css({
    background: 'rgba(72, 81, 138, 0.4)',
    borderRadius: '3rem',
  }),
  guestbook: css({
    position: 'relative',
    width: '50%',
    height: '90%',
    background: 'none',
    padding: '2rem 1rem',
    color: '#FFFFFF',
    '@media screen and (max-width: 1200px)': {
      width: '70%',
    },
    '@media screen and (max-width: 800px)': {
      width: '90%',
    },
  }),
  guestbookList: css({
    position: 'relative',
    overflow: 'auto',
    height: '50%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    padding: `${gradientSize} 0`,
    maskImage: `linear-gradient(to bottom, transparent, #000000 ${gradientSize}, #000000 calc(100% - ${gradientSize}), transparent 100% ), linear-gradient(#000000, #000000)`,
    maskRepeat: 'no-repeat, no-repeat',
    maskSize: 'auto 100%, auto 0',
    maskPosition: 'left, right',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  guestbookUnit: css({
    width: '100%',
    padding: '1rem',
    background: 'rgba(73, 81, 138, 0.4)',
    borderRadius: '1rem',
    margin: '0.5rem 0',
    display: 'flex',
  }),
  guestbookLeft: css({
    width: '7rem',
    flexShrink: 0,
  }),
  guestbookInfo: css({
    margin: '0.2rem 0',
    fontSize: '0.8rem',
  }),
  guestbookText: css({
    // lineBreak: 'anywhere',
    wordBreak: 'break-all',
    lineHeight: 1.4,
  }),
  titleImg: css({
    width: '100%',
  }),
  inputWrapper: css({
    width: '100%',
    height: '7rem',
    border: '1px solid #FFFFFF',
    borderRadius: '1.5rem',
    // paddingRight: '-5rem',
    display: 'flex',
  }),
  nicknameWrapper: css({
    position: 'relative',
    width: '6rem',
    marginLeft: '1rem',
    marginRight: '0.5rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  }),
  input: css({
    background: 'none',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    width: '100%',
    marginTop: '0.3rem',
    padding: '0.2rem',
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: 'rgba(73, 81, 138, 0.4)',
    },
  }),
  textarea: css({
    resize: 'none',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    background: 'none',
    flexGrow: 1,
    margin: '1rem 2rem 1rem 0',
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: 'rgba(73, 81, 138, 0.4)',
    },
  }),
  submitButton: css({
    backgroundColor: '#49518A',
    color: '#FFFFFF',
    borderRadius: '1rem',
    height: 'calc(100% + 2px)',
    width: '5rem',
    marginTop: '-1px',
    marginBottom: '-1px',
    marginLeft: '-1rem',
    marginRight: '-1rem',
  }),
  cancelButton: css({
    left: 0,
    right: 0,
    margin: 'auto',
    marginTop: '1rem',
    height: '3rem',
    width: '3rem',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background 0.3s ease',
    '&:hover': {
      backgroundColor: '#49518A',
    },
  }),
  cancelIcon: css({
    height: '1rem',
    width: '1rem',
  }),
};

const Guestbook: React.FC = () => {
  const { setScene } = useScene();
  const { isLogin } = useToken();
  const [guestbooks, setGuestbooks] = useState<GuestbookType[]>([]);
  const [text, setText] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [canSubmit, setCanSubmit] = useState(true);

  const onTextChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, [setText]);

  const onNicknameChnage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }, [setNickname]);

  const fetch = useCallback(() => {
    GuestbookService.retrieve()
      .then((data) => {
        setGuestbooks(data);
      }).catch((err) => {
        console.error(err);
      });
  }, []);

  const submit = useCallback(() => {
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (text.length < 2) {
      alert('2글자 이상 입력해주세요.');
      return;
    }
    setCanSubmit(false);
    GuestbookService.create(text, nickname)
      .then(() => {
        setText('');
        fetch();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setCanSubmit(true);
      });
  }, [text, nickname, fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const guestbookListView = useMemo(() => (
    guestbooks.map((guestbook) => (
      <div className={styles.guestbookUnit}>
        <div className={styles.guestbookLeft}>
          <p className={styles.guestbookInfo}>
            {guestbook.author.nickname}
          </p>
          <p className={styles.guestbookInfo}>
            {dayjs(guestbook.created_at).format('YY.MM.DD hh:mm')}
          </p>
        </div>
        <div className={styles.guestbookText}>
          {guestbook.text}
        </div>
      </div>
    ))
  ), [guestbooks]);

  return (
    <>
      <div className={styles.wrapper}>
        {
          !isLogin
            ? (
              <div className={styles.loginWrapper}>
                <Login />
              </div>
            )
            : (
              <div className={styles.guestbook}>
                <img src={guestbookTitle} alt="guestbookTitle" className={styles.titleImg} />
                <div className={styles.guestbookList}>
                  {guestbookListView}
                </div>
                <div className={styles.inputWrapper}>
                  <div className={styles.nicknameWrapper}>
                    <label htmlFor="nickname">
                      닉네임
                      <input type="text" id="nickname" className={styles.input} onChange={onNicknameChnage} value={nickname} autoComplete="off" />
                    </label>
                  </div>
                  <textarea className={styles.textarea} onChange={onTextChange} value={text} />
                  <button type="submit" className={styles.submitButton} onClick={submit} disabled={!canSubmit}>ENTER</button>
                </div>
                <button type="button" onClick={() => setScene(SCENE.HOME)} className={styles.cancelButton}>
                  <img src={cancelIcon} alt="cancelIcon" className={styles.cancelIcon} />
                </button>
              </div>
            )
        }
      </div>
    </>
  );
};

export default Guestbook;
