import * as yup from 'yup';

export const baseTrackSchema = yup.object({
  trackName: yup.string().required('Track name is required'),
  songType: yup.string().required('Song type is required'),
  audioFile: yup.mixed().required('Audio file is required'),
  explicitLyrics: yup.string().required('Please specify if lyrics are explicit'),
  writers: yup.array().of(yup.string()),
  producers: yup.array().of(yup.string()),
  isrc: yup.string(),
  releaseDate: yup.date().nullable(),
  creatorUrl: yup.string()
});

export const albumSchema = yup.object({
  albumName: yup.string().required('Album name is required'),
  numberOfSongs: yup.number().min(2).max(20).required('Number of songs is required'),
  primaryGenre: yup.string().required('Primary genre is required'),
  secondaryGenre: yup.string(),
  coverImage: yup.mixed().required('Cover image is required'),
  tracks: yup.array().of(baseTrackSchema).min(2)
});

export const epSchema = yup.object({
  epName: yup.string().required('EP name is required'),
  numberOfSongs: yup.number().min(2).max(6).required('Number of songs is required'),
  primaryGenre: yup.string().required('Primary genre is required'),
  secondaryGenre: yup.string(),
  coverImage: yup.mixed().required('Cover image is required'),
  tracks: yup.array().of(baseTrackSchema).min(2).max(6)
});
