export interface Track {
  _id: string;
  title: string;
  duration: number;
  songData: {
    _id: string;
    fileUrl: string;
    duration: number;
  };
  artist: {
    name: string;
    image: string;
  };
  release: {
    artwork: {
      high: string;
      medium: string;
      low: string;
      thumbnail: string;
    };
  };
}

export interface AlbumInfo {
  title: string;
  type: "album" | "single" | "ep" | "track";
  coverImage: string;
}
