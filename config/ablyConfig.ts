import * as Ably from 'ably';

export const ablyClient = new Ably.Realtime(`${process.env.ABLY_API_KEY}`);

// Helper function to get channel instance
export const getAblyChannel = (channelName: string) => {
  return ablyClient.channels.get(channelName);
};
