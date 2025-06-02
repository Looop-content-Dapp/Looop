import TrackPlayer, {
    Event,
    Capability,
    AppKilledPlaybackBehavior,
  } from 'react-native-track-player';

  export async function setupPlayer() {
    let isSetup = false;
    try {
      // Check if the player is already initialized
      await TrackPlayer.getPlaybackState();
      isSetup = true;
    } catch {
      // Initialize the player with interruption handling
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });

      // Configure player options
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
      });

      isSetup = true;
    }
    return isSetup;
  }

  export async function playbackService() {
    // Register remote control event listeners
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () =>
      TrackPlayer.skipToPrevious()
    );
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  }
