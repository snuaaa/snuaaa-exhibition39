import { selector } from 'recoil';
import PhotoService from 'src/services/photoService';

const photoSelector = selector({
  key: 'photoSelector',
  get: async () => {
    const photos = await PhotoService.retrieveAll();
    return photos;
  },
});

export default photoSelector;
