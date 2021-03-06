/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  ChangeEvent,
  Fragment, useCallback, useEffect, useMemo, useState,
} from 'react';
import { css } from '@emotion/css';
import { useRecoilValue } from 'recoil';
import photo from 'src/recoils/photoSelector';
import { SERVER_URL } from 'src/config';
import checker from 'src/assets/images/checker.png';
import submitIcon from 'src/assets/icons/submit.svg';
import cancelIcon from 'src/assets/icons/cancel.svg';
import useAuth from 'src/hooks/useAuth';
import useToken from 'src/hooks/useToken';
import useScene from 'src/hooks/useScene';
import PhotoService from 'src/services/photoService';
import AuthService from 'src/services/authService';
import { SCENE } from 'src/recoils/scene';

const gradientSize = '3rem';

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
  }),
  scrollArea: css({
    display: 'flex',
    flexWrap: 'wrap',
    height: '60vh',
    width: '80%',
    justifyContent: 'center',
    overflowY: 'scroll',
    paddingBottom: '5rem',
    maskImage: `linear-gradient(to bottom, transparent, #000000 ${gradientSize}, #000000 calc(100% - ${gradientSize}), transparent 100% ), linear-gradient(#000000, #000000)`,
    maskRepeat: 'no-repeat, no-repeat',
    maskSize: 'auto 100%, auto 0',
    maskPosition: 'left, right',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '@media screen and (max-width: 800px)': {
      width: '100%',
      padding: '0 0.5rem',
    },
  }),
  thumbnail: css({
    height: '8rem',
    cursor: 'pointer',
    display: 'block',
  }),
  selectedThumbnail: css({
    borderColor: '#AC3A63',
  }),
  input: css({
    display: 'none',
    ':checked + label': {
      borderColor: '#AC3A63',
    },
  }),
  label: css({
    border: '3px solid transparent',
    margin: '0.2rem',
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
  starRoomPassInput: css({
    background: 'none',
    border: 'none',
    borderBottom: '2px solid #FFFFFF',
    color: '#FFFFFF',
    userSelect: 'auto',
    '&:focus-visible': {
      outline: 'none',
      borderColor: '#c874f2',
    },
  }),
  iconButton: css({
    background: 'none',
    border: 'none',
    height: '1.5rem',
    width: '1.5rem',
    position: 'relative',
    cursor: 'pointer',
  }),
  icon: css({
    height: '100%',
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
    '&:disabled': {
      cursor: 'not-allowed',
      color: '#AAAAAA',
      borderColor: '#AAAAAA',
    },
  }),
  backButton: css({
    marginTop: '1rem',
    width: '10rem',
    padding: '0.5rem 1.5rem',
    color: '#FFFFFF',
    fontFamily: 'IM_Hyemin-Regular',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all ease 0.3s',
    '&:hover': {
      color: '#c874f2',
    },
  }),
};

const Vote: React.FC = () => {
  const photoList = useRecoilValue(photo);
  const memberCheckerId = 'memberChecker';
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(false);
  const [memberChecker, setMemberChecker] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const { auth, setAuth, authMember } = useAuth();
  const { getToken } = useToken();
  const { setScene } = useScene();

  const onClickPhoto = useCallback((photoId: number) => {
    if (photoId === selectedPhoto) {
      setSelectedPhoto(null);
    } else {
      setSelectedPhoto(photoId);
    }
  }, [selectedPhoto]);

  const onClickMemberChecker = useCallback(() => {
    setMemberChecker(true);
  }, []);

  const submitMemberChecker = useCallback(async () => {
    authMember(password);
  }, [authMember, password]);

  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const submit = useCallback(() => {
    if (selectedPhoto) {
      PhotoService.vote(selectedPhoto)
        .then(() => {
          setAuth({
            ...auth,
            hasVoted: true,
          });
        });
    }
  }, [selectedPhoto, auth, setAuth]);

  const onClickBackButton = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);

  const isMemberChecking = useMemo(() => !auth.isMember && memberChecker, [memberChecker, auth]);

  useEffect(() => {
    if (getToken() && !auth.isLogined && !isAuthChecking) {
      setIsAuthChecking(true);
      AuthService.getInfo()
        .then(({ isMember, hasVoted }) => {
          setAuth({
            isLogined: true,
            isMember,
            hasVoted,
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsAuthChecking(false);
        });
    }
  }, [setAuth, getToken, auth, isAuthChecking, setIsAuthChecking]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.scrollAreaWrapper}>
          <div className={styles.scrollArea}>
            {
              photoList
                .filter((_photo) => _photo.can_be_voted)
                .map((_photo) => {
                  const photoId = `photo${_photo.photo_id}`;
                  return (
                    <Fragment key={`thumbnail_${_photo.photo_id}`}>
                      <input
                        type="radio"
                        name="mvpPhoto"
                        id={photoId}
                        className={styles.input}
                        checked={selectedPhoto === _photo.photo_id}
                        onChange={() => onClickPhoto(_photo.photo_id)}
                      />
                      <label
                        htmlFor={photoId}
                        className={styles.label}
                      >
                        <img
                          className={styles.thumbnail}
                          src={`${SERVER_URL}/static/${_photo.thumbnail_path}`}
                          alt={`thumbnail_${_photo.photo_id}`}
                        />
                      </label>
                    </Fragment>
                  );
                })
            }
          </div>
        </div>
        {
          isMemberChecking
            ? (
              <div className={styles.memberCheck}>
                <p>?????? ??????????????? ????????????????</p>
                <div>
                  <input type="number" className={styles.starRoomPassInput} value={password} onChange={onChangePassword} />
                  <button type="button" className={styles.iconButton} onClick={submitMemberChecker}>
                    <img src={submitIcon} alt="submitIcon" className={styles.icon} />
                  </button>
                  <button type="button" className={styles.iconButton} onClick={() => setMemberChecker(false)}>
                    <img src={cancelIcon} alt="cancelIcon" className={styles.icon} />
                  </button>
                </div>
              </div>
            )
            : (
              <>
                <div className={styles.memberCheck}>
                  <input id={memberCheckerId} type="checkbox" className={styles.memberCheckInput} checked={auth.isMember} onChange={onClickMemberChecker} />
                  <label htmlFor={memberCheckerId} className={styles.memberCheckLabel}>
                    ?????? AAA???????????????.
                  </label>
                </div>
                <button type="button" className={styles.submitButton} onClick={submit} disabled={!selectedPhoto}>
                  ????????????
                </button>
                <button type="button" className={styles.backButton} onClick={onClickBackButton}>
                  ????????????
                </button>
              </>
            )
        }
      </div>
    </>
  );
};

export default Vote;
