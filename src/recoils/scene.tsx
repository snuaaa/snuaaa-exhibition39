import { atom } from 'recoil';

export enum SCENE {
  INTRO,
  HOME,
  GALLERY,
  MVP,
  GUESTBOOK,
  NEWBIE_PROJECT,
}

const sceneState = atom({
  key: 'sceneState',
  default: SCENE.INTRO,
  // default: SCENE.HOME,
});

export { sceneState };
