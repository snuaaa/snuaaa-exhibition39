import BaseService from './index';
import GuestBook from '../types/guestbook';

const GuestbookService = {

  retrieve(page: number = 1) {
    return BaseService.get<GuestBook[]>('/data/guestbook.json');
  },

  create(text: string, nickname?: string) {
    return BaseService.post('guestbook', { text, nickname });
  },
};

export default GuestbookService;
