export type Network = {
  name: string;
  rpcUrl: string;
  chainId: string;
  symbol: string;
  explorer: string;
  image: string;
};

export type Option = {
  title: string;
  icon: string; // Use the FontAwesomeIconName type here
  networks: string[];
  // ... rest of the properties ...
};

type GradientColors = {
  start: string;
  end: string;
};

const PLACEHOLDER_IMAGE = 'data:image/png;base64,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';

const stringToHue = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const getGradientColors = (genre: string): GradientColors => {
  // Generate base hue from genre name
  const baseHue = stringToHue(genre);

  // Create two complementary colors
  const startColor = hslToHex(baseHue, 75, 55);
  const endColor = hslToHex((baseHue + 40) % 360, 65, 65);

  return {
    start: startColor,
    end: endColor,
  };
};

export const lib = [
  {
    value: "Favourite",
    iconName: "heart-outline",
  },
  {
    value: "Downloads",
    iconName: "download-outline",
  },
  {
    value: "Playlist",
    iconName: "list",
  },
  {
    value: "Music",
    iconName: "musical-notes",
  },
  {
    value: "Albums",
    iconName: "albums-outline",
  },
  {
    value: "Podcast",
    iconName: "headset",
  },
  {
    value: "Videos",
    iconName: "archive",
  },
  {
    value: "Creators",
    iconName: "people",
  },
  {
    value: "Recorded live session",
    iconName: "recording",
  },
  {
    value: "Event",
    iconName: "glasses",
  },
  {
    value: "Nft",
    iconName: "contrast",
  },
];

export function hasHttpsCaseInsensitive(str: string) {
  return str.toLowerCase().startsWith("https://");
}

export const truncate = (text: string, count = 35) =>
  text?.length > count ? `${text.substring(0, count)}...` : text;

export const city = [
  {
    city: "Paris",
    monument: "Eiffel Tower",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
  },
  {
    city: "New York",
    monument: "Statue of Liberty",
    image: "https://images.pexels.com/photos/600622/pexels-photo-600622.jpeg",
  },
  {
    city: "Rome",
    monument: "Colosseum",
    image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
  },
  {
    city: "London",
    monument: "Big Ben",
    image:
      "https://images.pexels.com/photos/326807/pexels-photo-326807.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    city: "Sydney",
    monument: "Sydney Opera House",
    image: "https://images.pexels.com/photos/462331/pexels-photo-462331.jpeg",
  },
  {
    city: "Cairo",
    monument: "Pyramids of Giza",
    image:
      "https://images.pexels.com/photos/3689859/pexels-photo-3689859.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export const newStuff = [
  {
    title: "Like that",
    artist: ["Metro Boomin", "Future"],
    type: "single",
    tracks: [
      {
        title: "Like That",
        artist: ["Metro Boomin", "Future"],
      },
    ],
    image: require("../assets/images/metro.webp"),
  },
  {
    title: "Not Now I’m Busy",
    artist: ["Joyner Lucas"],
    type: "album",
    tracks: [
      {
        title: "Put me on",
        artist: ["Joyner Lucas"],
        uri: "",
      },
      {
        title: "I`m Ill",
        artist: ["Joyner Lucas"],
        uri: "",
      },
      {
        title: "Waiting on this",
        artist: ["Joyner Lucas"],
        uri: "",
      },
      {
        title: "Put me on",
        artist: ["Joyner Lucas"],
        uri: "",
      },
    ],
    image: require("../assets/images/music2.png"),
  },
  {
    title: "Calm Down",
    artist: ["Rema", "Selena Gomez"],
    type: "single",
    tracks: [
      {
        title: "Calm Down",
        artist: ["Rema", "Selena Gomez"],
      },
    ],
    image: require("../assets/images/calmdown.jpg"),
  },
  {
    title: "I Told Them",
    artist: ["Burna Boy"],
    type: "album",
    tracks: [
      {
        title: "I told them",
        artist: ["Burna Boy"],
        uri: "",
      },
      {
        title: "Sitting on top of the world",
        artist: ["Burna boy", "21 Savage"],
        uri: "",
      },
      {
        title: "Virgil",
        artist: ["Burna Boy"],
        uri: "",
      },
      {
        title: "Normal",
        artist: ["Burna Boy"],
        uri: "",
      },
      {
        title: "Tested, Approved & trusted",
        artist: ["Burna Boy"],
        uri: "",
      },
      {
        title: "Cheat on me",
        artist: ["Burna Boy", "Dave"],
        uri: "",
      },
    ],
    image: require("../assets/images/itoldthem.webp"),
  },
];

export const feed = [
    {
      id: "1",
      user: {
        name: "Rema",
        verified: true,
        avatar: require("../assets/images/remaAvatar.png"),
        username: "Afroravers official",
        role: "owner",
      },
      timePosted: "5h",
      content:
        "Heyy y'all...heard you guys are enjoying HEIS!!! excited to announce that i'm already working on some new music to be out soon 😉",
      media: {
        type: "audio",
        url: [
          "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"
        ],
      },
      engagement: {
        plays: "1.8k",
        shares: "857",
        likes: "5.2k",
        comments: "1.1k",
      },
      actions: {
        like: true,
        comment: true,
        share: true,
      },
      comments: [
        {
          id: "1-1",
          user: {
            name: "Burna Boy",
            verified: true,
            avatar: require("../assets/images/BurnaAvatar.png"),
            username: "Outsiders",
            role: "moderator",
          },
          timePosted: "3h",
          content: "Can't wait to hear the new tracks, man!",
          replies: [
            {
              id: "1-1-1",
              user: {
                name: "Wizkid",
                verified: true,
                avatar: require("../assets/images/remaAvatar.png"),
                username: "Wiz FC",
                role: "user",
              },
              timePosted: "2h",
              content: "Same here! It's going to be fire 🔥",
            },
          ],
        },
        {
          id: "1-2",
          user: {
            name: "BNXN",
            verified: true,
            avatar: require("../assets/images/buju.jpg"),
            username: "$BNXN",
            role: "user",
          },
          timePosted: "4h",
          content: "We're all waiting! Keep it up, Rema!",
        },
      ],
    },
    {
      id: "2",
      user: {
        name: "Burna Boy",
        verified: true,
        avatar: require("../assets/images/BurnaAvatar.png"),
        username: "Outsiders",
        role: "owner",
      },
      timePosted: "7h",
      content: "EMPTY CHAIRS OUT SOON!",
      media: null,
      engagement: {
        likes: "5.2k",
        comments: "1.1k",
      },
      actions: {
        like: true,
        comment: true,
        share: true,
      },
      comments: [
        {
          id: "2-1",
          user: {
            name: "Rema",
            verified: true,
            avatar: require("../assets/images/remaAvatar.png"),
            username: "Afroravers official",
            role: "moderator",
          },
          timePosted: "6h",
          content: "Can't wait to hear it!",
        },
      ],
    },
    {
      id: "3",
      user: {
        name: "Wizkid",
        verified: true,
        avatar: require("../assets/images/remaAvatar.png"),
        username: "Wiz FC",
        role: "owner",
      },
      timePosted: "7h",
      content: "09/11 🦅",
      media: {
        type: "image",
        url: [
          "https://w0.peakpx.com/wallpaper/789/907/HD-wallpaper-wizkid-mil-soco.jpg",
        ],
      },
      engagement: {
        likes: "5.2k",
        comments: "1.1k",
      },
      actions: {
        like: false,
        comment: true,
        share: true,
      },
      comments: [
        {
          id: "3-1",
          user: {
            name: "BNXN",
            verified: true,
            avatar: require("../assets/images/buju.jpg"),
            username: "$BNXN",
            role: "user",
          },
          timePosted: "5h",
          content: "Marking my calendar already!",
        },
      ],
    },
    {
      id: "4",
      user: {
        name: "Kanye West",
        verified: true,
        avatar: require("../assets/images/remaAvatar.png"),
        username: "$YE",
        role: "owner",
      },
      timePosted: "12h",
      content:
        "Givenchy : Front Row - Paris Fashion Week - Womenswear Spring/Summer 2023",
      media: {
        type: "video",
        url: [
          "https://media.gettyimages.com/id/1429694626/video/front-row-paris-fashion-week-womenswear-spring-summer-2023.mp4?s=mp4-640x640-gi&k=20&c=sxzWNI4OE5hB54L8nF4hEH_vb5fVY0AcsuzSmfZ9w98=",
        ],
      },
      engagement: {
        likes: "5.2k",
        comments: "1.1k",
      },
      actions: {
        like: false,
        comment: true,
        share: true,
      },
      comments: [
        {
          id: "4-1",
          user: {
            name: "Rema",
            verified: true,
            avatar: require("../assets/images/remaAvatar.png"),
            username: "Afroravers official",
            role: "moderator",
          },
          timePosted: "10h",
          content: "Front row seats! 🔥",
        },
      ],
    },
    {
      id: "5",
      user: {
        name: "BNXN",
        verified: true,
        avatar: require("../assets/images/buju.jpg"),
        username: "$BNXN",
        role: "owner",
      },
      timePosted: "12h",
      content: "09/11 🦅",
      media: {
        type: "image",
        url: [
          "https://w0.peakpx.com/wallpaper/789/907/HD-wallpaper-wizkid-mil-soco.jpg",
          "https://www.okayafrica.com/media-library/less-than-p-greater-than-bnxn-less-than-p-greater-than.jpg?id=31216164",
          "https://cdn.vanguardngr.com/wp-content/uploads/2021/12/SED.jpg",
          "https://static.wixstatic.com/media/f4e782_002bc4e3d01447b39bb0826428fee7fc~mv2.jpeg/v1/fill/w_640,h_800,al_c,q_85,enc_auto/f4e782_002bc4e3d01447b39bb0826428fee7fc~mv2.jpeg",
        ],
      },
      engagement: {
        likes: "5.2k",
        comments: "1.1k",
      },
      actions: {
        like: false,
        comment: true,
        share: true,
      },
      comments: [
        {
          id: "5-1",
          user: {
            name: "Wizkid",
            verified: true,
            avatar: require("../assets/images/remaAvatar.png"),
            username: "Wiz FC",
            role: "moderator",
          },
          timePosted: "11h",
          content: "Counting down with you, bro!",
        },
      ],
    },
];

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export function createUniqueUsername(email: string | undefined) {
  // Extract and process the local part of the email
  let localPart = email?.split("@")[0];
  // Remove dots and anything after '+', convert to lowercase
  localPart = localPart?.replace(/\./g, "").split("+")[0].toLowerCase();

  // Take the first 6 characters of the processed local part
  const baseUsername = localPart?.substring(0, 6);

  // Generate a hash code from the email
  const hash = hashCode(email);

  // Convert the hash to base36 (0-9, a-z) and take first 4 characters
  const hashStr = Math.abs(hash).toString(36).substring(0, 1);

  // Combine to form the unique, short username
  const uniqueUsername = `${baseUsername}${hashStr}`;

  return uniqueUsername;
}

// Simple hash function (djb2 algorithm)
function hashCode(str: string | undefined) {
  let hash = 5381;
  for (let i = 0; i < str?.length; i++) {
    hash = (hash << 5) + hash + str?.charCodeAt(i); // hash * 33 + c
  }
  return hash;
}

// // Example usage:
// const email = 'looopmobiledapp@gmail.com';
// const uniqueUsername = createUniqueUsername(email);
// console.log(uniqueUsername);  // Output: e.g., 'looopm1a2b'
