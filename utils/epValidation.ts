interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEPBasicInfo = (epData: any): ValidationResult => {
  if (!epData.epName.trim()) {
    return { isValid: false, message: "EP name is required" };
  }
  if (!epData.numberOfSongs) {
    return { isValid: false, message: "Number of songs is required" };
  }
  const songCount = parseInt(epData.numberOfSongs);
  if (songCount < 2 || songCount > 6) {
    return { isValid: false, message: "EP must have between 2 and 6 songs" };
  }
  if (!epData.primaryGenre) {
    return { isValid: false, message: "Primary genre is required" };
  }
  if (!epData.coverImage) {
    return { isValid: false, message: "EP cover is required" };
  }
  return { isValid: true, message: "" };
};

export const validateEPTrackInfo = (tracks: any[]): ValidationResult => {
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