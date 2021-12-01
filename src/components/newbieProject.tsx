import React, { useCallback, useState } from 'react';
import { css } from '@emotion/css';

import background from 'src/assets/images/background_star.png';
import cancelIcon from 'src/assets/icons/cancel.svg';
import useScene from 'src/hooks/useScene';
import { SCENE } from 'src/recoils/scene';
import img1 from 'src/assets/images/newbie_project1.jpg';
import img2 from 'src/assets/images/newbie_project2.jpg';
import img3 from 'src/assets/images/newbie_project3.jpg';
import img4 from 'src/assets/images/newbie_project4.jpg';
import img5 from 'src/assets/images/newbie_project5.jpg';
import img6 from 'src/assets/images/newbie_project6.jpg';
import img7 from 'src/assets/images/newbie_project7.jpg';
import img8 from 'src/assets/images/newbie_project8.jpg';
import img9 from 'src/assets/images/newbie_project9.jpg';
import prevIcon from 'src/assets/icons/prev.svg';
import nextIcon from 'src/assets/icons/next.svg';

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
    cursor: 'default',
    backgroundImage: `url(${background})`,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '15rem',
    '@media screen and (max-width: 1200px)': {
      padding: '10rem',
    },
    '@media screen and (max-width: 1000px)': {
      padding: '5rem',
    },
    '@media screen and (max-width: 800px)': {
      padding: '1rem',
    },
    // opacity: 0.4,
  }),
  loginWrapper: css({
    background: 'rgba(72, 81, 138, 0.4)',
    borderRadius: '3rem',
  }),
  cancelButton: css({
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    padding: '1rem',
    boxShadow: 'none',
  }),
  cancelIcon: css({
    height: '1rem',
    width: '1rem',
    display: 'block',
  }),
  title: css({
    fontSize: '1.5rem',
    color: '#FFD45F',
  }),
  contentWrapper: css({
    display: 'flex',
    '@media screen and (max-width: 800px)': {
      flexDirection: 'column',
      overflow: 'auto',
    },
  }),
  row: css({
    display: 'flex',
    width: '50%',
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: 'column',
    position: 'relative',
    margin: '1rem',
    '@media screen and (max-width: 800px)': {
      margin: 0,
      width: '100%',
    },
  }),
  text: css({
    color: '#FFFFFF',
    lineHeight: 1.5,
    margin: 0,
  }),
  image: css({
    width: '100%',
  }),
  buttonWrapper: css({
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 0 1rem auto',
  }),
  button: css({
    background: 'none',
  }),
  icon: css({
    width: '1.5rem',
    height: '1.5rem',
  }),
};

const imageData = [
  {
    title: '해시계 설계 과정',
    img: img1,
  },
  {
    title: '완성된 해시계 도안',
    img: img2,
  },
  {
    title: '돔에서 야광 스티커와 펜으로 열심히 꾸미는 모습',
    img: img3,
  },
  {
    title: '동아리원이 설계한 별자리 및 실제 모습',
    img: img4,
  },
  {
    title: '완성된 해시계를 야간에 밖에서 촬영한 모습',
    img: img5,
  },
  {
    title: '야간에 밖에서 사용하는 모습',
    img: img6,
  },
  {
    title: '야간에 밖에서 사용하는 모습 (2)',
    img: img7,
  },
  {
    title: '낮에 직접 사용하는 모습',
    img: img8,
  },
  {
    title: '낮에 직접 사용하는 모습 (2)',
    img: img9,
  },
];

const NewbieProject: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { setScene } = useScene();

  const onClickPrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index, setIndex]);

  const onClickNext = useCallback(() => {
    if (index < imageData.length - 1) {
      setIndex(index + 1);
    }
  }, [index, setIndex]);

  const onClickClose = useCallback(() => {
    setScene(SCENE.HOME);
  }, [setScene]);

  return (
    <>
      <div className={styles.wrapper}>
        <button type="button" className={styles.cancelButton} onClick={onClickClose}>
          <img src={cancelIcon} alt={cancelIcon} className={styles.cancelIcon} />
        </button>
        <h3 className={styles.title}>신입생 프로젝트</h3>
        <div className={styles.contentWrapper}>
          <div className={styles.row}>
            <img src={imageData[index].img} alt={`img_${index + 1}`} className={styles.image} />
            <div className={styles.buttonWrapper}>
              <button type="button" className={styles.button} onClick={onClickPrev}>
                <img src={prevIcon} alt="prevIcon" className={styles.icon} />
              </button>
              <p className={styles.text}>{`${index + 1} / ${imageData.length}`}</p>
              <button type="button" className={styles.button} onClick={onClickNext}>
                <img src={nextIcon} alt="nextIcon" className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.row}>
            <p className={styles.text}>
              매년 AAA 신입생들이 주제를 정하여 프로젝트를 수행하는 신입생 프로젝트는 &apos;열정&apos; 이라는 한 단어로 함축될 수 있습니다.
              2021년, 신입생들은 &apos;열정&apos;이라는 일념으로 뭉쳐 코로나 19라는 장애물을 뛰어넘고 성공적으로 프로젝트를 마무리 하였습니다.
              &quot;STARving the stars&quot;라고 제목을 붙인 2021년 신입생 프로젝트는 신입생들이 각각 가상의 별자리를 만들어,
              다양한 시간에 AAA를 대표하는 장소인 돔에서 사진을 찍어 온라인 사진전에 게시하는 형태로 계획되었습니다.
              <br />
              <br />
              바라보는 관점에 따라 별은 소원이자, 환상이자, 동심이기도 합니다.이 사진전을 찾아주신 여러분들께서
              별을 바라보며 가지는 생각은 모두 다르겠지만, 각자 나름의 이유를 가지고 별을 응시하고 있다는 공통점이 있습니다.
              <br />
              <br />
              별을 바라보는 여러분께,  2021년 신입생 프로젝트를 선물합니다.
              <br />
              <br />
              For the STARved & STARving the stars.
              별고픈 이들이여, 별을 보아라.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewbieProject;
