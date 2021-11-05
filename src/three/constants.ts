export const SPEED = 1;
export const SPEED_ROTATE = 0.005;
export const HALL_HEIGHT = 80;
export const HALL_SIZE_UNIT = 300;
export const HALL_SIZE_X = 10;
export const HALL_SIZE_Y = 10;
export const PHOTO_HEIGHT = 25;
export const POINTLIGHT_INTENSITY = 0.2;
export const HEMISPHERELIGHT_INTENSITY = 0.3;

export enum LinkName {
  INTRO = 'link_intro',
  PROJECT = 'link_project',
  STAR = 'link_star',
  TRAIL = 'link_trail',
  GUIDE = 'link_guide',
  SOLAR = 'link_solar',
  MVP = 'link_mvp',
}

export const mapName = (modelName: LinkName) => {
  const map = {
    link_intro: '동아리소개',
    link_project: '신입생 프로젝트',
    link_star: '점상',
    link_trail: '트레일',
    link_guide: '가이드',
    link_solar: '태양계',
    link_mvp: 'MVP',
  };

  return map[modelName];
};
