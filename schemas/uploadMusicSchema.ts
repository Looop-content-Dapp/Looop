import * as yup from 'yup';

const SUPPORTED_AUDIO_FORMATS = ['audio/mp3', 'audio/m4a', 'audio/wav', 'audio/flac', 'audio/wma', 'audio/aiff'];
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const trackInfoSchema = yup.object({
  trackName: yup.string().required('Track name is required'),
  songType: yup.string().oneOf(['original', 'cover']).required('Song type is required'),
  featuredArtists: yup.array().of(yup.string()),
  primaryGenre: yup.string().required('Primary genre is required'),
  secondaryGenre: yup.string(),
  coverImage: yup.mixed()
    .required('Cover image is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test('fileFormat', 'Unsupported file format', (value) => {
      if (!value) return true;
      return SUPPORTED_IMAGE_FORMATS.includes(value.type);
    })
});

export const fileMetadataSchema = yup.object({
  audioFile: yup.mixed()
    .required('Audio file is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test('fileFormat', 'Unsupported file format', (value) => {
      if (!value) return true;
      return SUPPORTED_AUDIO_FORMATS.includes(value.type);
    }),
  explicitLyrics: yup.string().oneOf(['yes', 'no']).required('Please specify if the song contains explicit lyrics'),
  writers: yup.array().of(yup.string()),
  producers: yup.array().of(yup.string()),
  isrc: yup.string(),
  releaseDate: yup.date().min(new Date(), 'Release date must be in the future')
});
