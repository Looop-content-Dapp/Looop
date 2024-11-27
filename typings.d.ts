// typings.d.ts

declare namespace App {
    type Artist = {
      __v: number;
      _id: string;
      addinationalInfo: string;
      bio: string;
      createdAt: string;
      email: string;
      genre: string;
      name: string;
      password: string;
      profileImage: string;
      updatedAt: string;
      verified: boolean;
    };

    type FetchedArtists = {
      data: Artist[];
      message: string;
    };

    // Define the Preference type based on your application's requirements
    type Preference = {
      // Example fields; adjust according to actual preference structure
      category: string;
      value: string;
    };

    type User = {
      __v: number;
      _id: string;
      bio: string;
      createdAt: string;
      email: string;
      isPremium: boolean;
      password: string;
      profileImage: string;
      updatedAt: string;

      // New properties added to match the provided object structure
      artistPlayed: number;
      faveArtists: Artist[]; // Assuming faveArtists are of type Artist
      following: number;
      friendsCount: number;
      preferences: Preference[]; // Array of Preference objects
    };

    type FetchedUser = {
      data: User;
      message: string;
    };

    type Song = {
      __v: number;
      _id: string;
      fileUrl: string;
      streams: number;
      playlistAdditions: number;
      shares: number;
    };

    type Track = {
      __v: number;
      _id: string;
      title: string;
      duration: string;
      track_number: number;
      artistId: string;
      songId: string;
      genre: string;
      streams: number; // Added this property to match the expected requirements
      ft?: string;
      song: Song[];
    };

    type Release = {
      __v: number;
      _id: string;
      title: string;
      release_date: string;
      cover_image: string;
      genre: string;
      label: string;
      type: "single" | "album" | "ep";
      artistId: string;
      number_of_streams?: number;
      tracklists: Track[];
    };

    type FetchedReleases = {
      data: Release[];
      message: string;
    };
  }
