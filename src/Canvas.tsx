import React from "react";

const LENGTH_SCALE = 0.09;
// const LENGTH_SCALE = 1;
const LANE_LENGTH_MM = 18288;
const WIDTH_SCALE = 0.25;
// const WIDTH_SCALE = 1;
const LANE_WIDTH_MM = 1066.8;

const LANE_LENGTH = LANE_LENGTH_MM * LENGTH_SCALE;
const LANE_WIDTH = LANE_WIDTH_MM * WIDTH_SCALE;

const BOARD_COUNT = 39;
const BOARD_WIDTH = LANE_WIDTH / BOARD_COUNT;

const scaledLengthInMM = (length: number) => length * LENGTH_SCALE;

export const Canvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const drawLane = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#f2ceb4";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const drawBoards = (context: CanvasRenderingContext2D) => {
    for (let i = 0; i < BOARD_COUNT; i++) {
      context.lineWidth = i % 5 === 0 || (i + 1) % 5 === 0 ? 0.25 : 0.1;
      context.beginPath();
      context.moveTo(0, BOARD_WIDTH * i);
      context.lineTo(LANE_LENGTH, BOARD_WIDTH * i);
      context.stroke();
    }
  };

  const drawFoulLine = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, scaledLengthInMM(10), LANE_WIDTH);
  };

  const drawDots = (
    context: CanvasRenderingContext2D,
    startX: number = scaledLengthInMM(1829)
  ) => {
    const DOT_RADIUS = BOARD_WIDTH * 0.3;
    const drawDot = (x: number, board: number) => {
      const y = board * BOARD_WIDTH;

      context.fillStyle = "#000000";
      context.beginPath();
      context.arc(x, y + BOARD_WIDTH / 2, DOT_RADIUS, 0, 2 * Math.PI);
      context.fill();
    };

    const boardDots = [3, 5, 8, 11, 14, 26, 29, 32, 35, 37];
    boardDots.forEach((board) => drawDot(startX, board - 1));
  };

  const drawArrows = (
    context: CanvasRenderingContext2D,
    startX: number = scaledLengthInMM(3658)
  ) => {
    const ARROW_LENGTH = scaledLengthInMM(250);
    const drawArrow = (x: number, board: number) => {
      const y = board * BOARD_WIDTH;

      context.fillStyle = "#000000";
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + BOARD_WIDTH);
      context.lineTo(x + ARROW_LENGTH, y + BOARD_WIDTH / 2);
      context.fill();
    };

    let currentArrow = 0;
    let currentX = startX;
    while (currentArrow < 7) {
      const board = currentArrow * 5 + 4;
      drawArrow(currentX, board);

      currentArrow < 3
        ? (currentX = currentX + ARROW_LENGTH)
        : (currentX = currentX - ARROW_LENGTH);

      currentArrow++;
    }
  };

  const drawRangeFinders = (
    context: CanvasRenderingContext2D,
    startX: number = scaledLengthInMM(10363)
  ) => {
    const rangeFinderLength = scaledLengthInMM(914);
    const frontRangeFinderBoards = [15, 25];
    const rearRangeFinderBoards = [10, 30];

    const drawRangeFinder = (x: number, board: number) => {
      context.fillStyle = "#f2a269";
      context.fillRect(x, board * BOARD_WIDTH, rangeFinderLength, BOARD_WIDTH);
    };

    frontRangeFinderBoards.forEach((board) =>
      drawRangeFinder(startX, board - 1)
    );
    rearRangeFinderBoards.forEach((board) =>
      drawRangeFinder(startX + rangeFinderLength * 2, board - 1)
    );
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;

    drawLane(context);
    drawBoards(context);
    drawFoulLine(context);
    drawDots(context);
    drawArrows(context);
    drawRangeFinders(context);
  }, []);

  return <canvas ref={canvasRef} width={LANE_LENGTH} height={LANE_WIDTH} />;
};
