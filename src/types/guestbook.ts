interface Guestbook {
  guestbook_id: number;
  author: {
    user_id: number;
    nickname: string;
  };
  author_id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

export default Guestbook;
