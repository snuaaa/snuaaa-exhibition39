interface Photo {
  photo_id: number,
  photograper: string,
  title: string,
  location: string,
  date: string,
  equipment: string,
  exposure: string,
  processing: string,
  story: string,
  rotation: number,
  thumbnail_path: string,
  file_path: string,
  can_be_voted: boolean,
  is_video: boolean
  model_name: string,
}

export default Photo;
