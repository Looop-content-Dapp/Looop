interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateBasicInfo = (albumData: any): ValidationResult => {
  if (!albumData.albumName.trim()) {
    return { isValid: false, message: "Album name is required" };
  }
  if (!albumData.numberOfSongs) {
    return { isValid: false, message: "Number of songs is required" };
  }
  if (!albumData.primaryGenre) {
    return { isValid: false, message: "Primary genre is required" };
  }
  if (!albumData.coverImage) {
    return { isValid: false, message: "Album cover is required" };
  }
  return { isValid: true, message: "" };
};

export const validateTrackInfo = (tracks: any[]): ValidationResult => {
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (!track.trackName.trim()) {
      return { isValid: false, message: `Track ${i + 1} name is required` };
    }
    if (!track.songType) {
      return { isValid: false, message: `Track ${i + 1} type is required` };
    }
    if (!track.audioFile) {
      return { isValid: false, message: `Audio file for track ${i + 1} is required` };
    }
    if (!track.explicitLyrics) {
      return { isValid: false, message: `Explicit lyrics status for track ${i + 1} is required` };
    }
  }
  return { isValid: true, message: "" };
};