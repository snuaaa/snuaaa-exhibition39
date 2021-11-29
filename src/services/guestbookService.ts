import BaseService from './index';
import GuestBook from '../types/guestbook';

const GeustbookService = {

  retrieve(page: number) {
    return BaseService.get<GuestBook>('guestbook');
  },

  create(name: string, text: string) {
    return BaseService.post('guestbook', { name, text });
  },
};

export default GeustbookService;
