import React from 'react';

import { BallPosition } from './Canvas.types';
import { CanvasUtilities } from './Canvas.utils';

const sampleShot: BallPosition[][] = [
    [
        { board: 24, distance: 1829 },
        { board: 20, distance: 4572 },
    ],
    [
        { board: 9, distance: 15716 },
        { board: 14, distance: 17288 },
    ],
];

export interface CanvasProps {
    arrows?: boolean;
    dots?: boolean;
    pins?: boolean;
    rangeFinders?: boolean;
}

const CanvasInternal: React.FC<CanvasProps> = ({ arrows = true, dots = true, pins = true, rangeFinders = true }) => {
    const LENGTH_SCALE = 0.089;
    const WIDTH_SCALE = 0.25;

    const canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        const util = new CanvasUtilities(canvas, LENGTH_SCALE, WIDTH_SCALE);

        util.drawLaneSurface().drawDots(dots).drawArrows(arrows).drawRangeFinders(rangeFinders).drawPins(pins);

        console.log(canvas.width);

        sampleShot.forEach((shot) => {
            util.drawLinearTrace(shot);
        });
    };

    return <canvas ref={canvasRef} />;
};

export const Canvas = React.memo(CanvasInternal);
