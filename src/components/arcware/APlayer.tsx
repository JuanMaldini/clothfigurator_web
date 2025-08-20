import React, { useEffect, useRef } from 'react';
import { ArcwareInit } from '@arcware-cloud/pixelstreaming-websdk';
import { ARCWARE_SHARE_ID, ARCWARE_OPTIONS, setArcwareApplication } from './arcwareConfig';
import Sidepanel from '../panel/Sidepanel';

// Versión mínima basada en el sample oficial.
const APlayer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    const { Application } = ArcwareInit(
            { shareId: ARCWARE_SHARE_ID },
            ARCWARE_OPTIONS
        );
    // Registrar instancia global para futuras interacciones
    setArcwareApplication(Application);
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(Application.rootElement);
        }
    }, []);

    return (
        <div className="aPlayerRoot">
            <Sidepanel />
            <div ref={containerRef} className="aPlayerVideoContainer">
                <span className="aPlayerLoading">Inicializando stream...</span>
            </div>
        </div>
    );
};

export default APlayer;
