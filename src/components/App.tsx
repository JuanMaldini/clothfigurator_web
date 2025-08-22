import { PixelStreamingWrapper } from './PixelStreamingWrapper';
import Sidepanel from './panel/Sidepanel';

export const App = () => {
    return (
        <div
            style={{
                height: '100%',
                width: '100%'
            }}
        >
            <Sidepanel />
            <PixelStreamingWrapper
                initialSettings={{
                    AutoPlayVideo: true,
                    AutoConnect: true,
                    ss: 'ws://localhost:80',
                    StartVideoMuted: true,
                    HoveringMouse: true,
                    WaitForStreamer: true
                }}
            />
        </div>
    );
};
