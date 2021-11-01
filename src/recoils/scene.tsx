import { atom } from 'recoil';

export enum SCENE {
  INTRO,
  HOME,
  GALLERY,
  MVP,
  GUESTBOOK,
}

const sceneState = atom({
  key: 'sceneState',
  default: SCENE.INTRO,
});

export { sceneState };
