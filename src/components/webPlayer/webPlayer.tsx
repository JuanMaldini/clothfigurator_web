import { PixelStreamingProvider } from './PixelStreamingContext';
import PlayerSurface from './PlayerSurface';
function WebPlayer() {
  return (
    <PixelStreamingProvider config={{ SignallingServerUrl: 'ws://127.0.0.1:8888', AutoPlay: true }}>
      <PlayerSurface />
    </PixelStreamingProvider>
  );
}
export default WebPlayer;
