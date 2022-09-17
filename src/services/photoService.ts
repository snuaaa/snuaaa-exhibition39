import BaseService from './index';
import Photo from '../types/photo';

const PhotoService = {

  retrieve(photo_id: number) {
    return BaseService.get<Photo>(`photo/${photo_id}`);
  },

  retrieveAll() {
    return BaseService.get<Photo[]>('/data/photo.json');
  },

  vote(photo_id: number) {
    return BaseService.post('photo/vote', { photo_id });
  },
};

export default PhotoService;
