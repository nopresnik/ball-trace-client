import { BallPosition } from './Canvas.types';

export class CanvasUtilities {
    // Static constants related to ALL bowling lanes.
    private readonly LANE_LENGTH_MM = 19250;
    private readonly LANE_WIDTH_MM = 1054;
    private readonly BOARD_COUNT = 39;

    private readonly context: CanvasRenderingContext2D;

    private readonly laneLength: number;
    private readonly laneWidth: number;
    private readonly boardWidth: number;

    constructor(ref: HTMLCanvasElement, private readonly lengthScale: number, private readonly widthScale: number) {
        this.context = ref.getContext('2d')!;
        this.laneLength = this.LANE_LENGTH_MM * lengthScale;
        this.laneWidth = this.LANE_WIDTH_MM * widthScale;
        this.boardWidth = this.laneWidth / this.BOARD_COUNT;

        this.context.canvas.width = this.laneLength;
        this.context.canvas.height = this.laneWidth;
    }

    /**
     * Converts a length in millimetres to a scaled length in pixels.
     */
    private lengthToScaledLength(length: number) {
        return length * this.lengthScale;
    }

    /**
     * Converts a width in millimetres to a scaled width in pixels.
     */
    private widthToScaledWidth(width: number) {
        return width * this.widthScale;
    }

    private getBoardPositionY(board: number) {
        const left = this.laneWidth - board * this.boardWidth;
        const center = left + this.boardWidth / 2;
        const right = left + this.boardWidth;

        return { left, center, right };
    }

    /**
     * Fills in the context with the base lane colour.
     */
    private drawBaseLane() {
        this.context.fillStyle = '#f2ceb4';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    /**
     * Draws the foul line.
     */
    private drawFoulLine() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.lengthToScaledLength(20), this.laneLength);
    }

    /**
     * Draws the lengthwise boards.
     */
    private drawBoards() {
        for (let i = 0; i < this.BOARD_COUNT; i++) {
            this.context.strokeStyle = '#000000';
            this.context.lineWidth = i % 5 === 0 || (i + 1) % 5 === 0 ? 0.25 : 0.1;
            this.context.beginPath();
            this.context.moveTo(0, this.boardWidth * i);
            this.context.lineTo(this.laneLength, this.boardWidth * i);
            this.context.stroke();
        }
    }

    /**
     * Draws the base lane surface.
     */
    public drawLaneSurface(draw: boolean = true) {
        if (!draw) return this;

        this.drawBaseLane();
        this.drawFoulLine();
        this.drawBoards();

        return this;
    }

    /**
     * Draws the dots between the foul line and the arrows.
     */
    public drawDots(draw: boolean = true) {
        if (!draw) return this;

        const DOT_DISTANCE_FROM_FOUL_LINE = this.lengthToScaledLength(1829);
        const BOARDS_WITH_DOTS = [3, 5, 8, 11, 14, 26, 29, 32, 35, 37];

        BOARDS_WITH_DOTS.forEach((board) => {
            this.context.fillStyle = '#000000';
            this.context.beginPath();
            this.context.arc(
                DOT_DISTANCE_FROM_FOUL_LINE,
                this.getBoardPositionY(board).center,
                this.boardWidth * 0.3,
                0,
                2 * Math.PI
            );
            this.context.fill();
        });

        return this;
    }

    /**
     * Draws the arrows.
     */
    public drawArrows(draw: boolean = true) {
        if (!draw) return this;

        const ARROW_LENGTH = this.lengthToScaledLength(250);
        const drawArrow = (x: number, board: number) => {
            const y = this.getBoardPositionY(board);

            this.context.fillStyle = '#000000';
            this.context.beginPath();
            this.context.moveTo(x, y.left);
            this.context.lineTo(x, y.right);
            this.context.lineTo(x + ARROW_LENGTH, y.center);
            this.context.fill();
        };

        let currentArrow = 0;
        let currentX = this.lengthToScaledLength(3658);
        while (currentArrow < 7) {
            drawArrow(currentX, currentArrow * 5 + 5);

            if (currentArrow < 3) {
                currentX = currentX + ARROW_LENGTH;
            } else {
                currentX = currentX - ARROW_LENGTH;
            }

            currentArrow++;
        }

        return this;
    }

    /**
     * Draws the range finders.
     */
    public drawRangeFinders(draw: boolean = true) {
        if (!draw) return this;

        const FRONT_RANGE_FINDER_DISTANCE = this.lengthToScaledLength(10363);
        const REAR_RANGE_FINDER_DISTANCE = this.lengthToScaledLength(12191);
        const RANGE_FINDER_LENGTH = this.lengthToScaledLength(914);

        const drawRangeFinder = (x: number, board: number) => {
            const boardPos = this.getBoardPositionY(board);
            this.context.fillStyle = '#f2a269';
            this.context.fillRect(x, boardPos.left, RANGE_FINDER_LENGTH, this.boardWidth);
        };

        [15, 25].forEach((board) => drawRangeFinder(FRONT_RANGE_FINDER_DISTANCE, board));
        [10, 30].forEach((board) => drawRangeFinder(REAR_RANGE_FINDER_DISTANCE, board));

        return this;
    }

    /**
     * Draws the pins.
     */
    public drawPins(draw: boolean = true) {
        if (!draw) return this;

        const FIRST_PIN_DISTANCE = this.lengthToScaledLength(18288);
        const NEXT_ROW_SPACING = this.lengthToScaledLength(263.96442);
        const SIDE_SPACING = this.widthToScaledWidth(304.8);

        const drawPin = (x: number, y: number) => {
            this.context.fillStyle = '#000000';
            this.context.beginPath();
            this.context.arc(x, y, this.widthToScaledWidth(86.3 / 2), 0, 360);
            this.context.fill();
        };

        drawPin(FIRST_PIN_DISTANCE, this.laneWidth / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING, this.laneWidth / 2 + SIDE_SPACING / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING, this.laneWidth / 2 - SIDE_SPACING / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 2, this.laneWidth / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 2, this.laneWidth / 2 + SIDE_SPACING);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 2, this.laneWidth / 2 - SIDE_SPACING);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 3, this.laneWidth / 2 + SIDE_SPACING / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 3, this.laneWidth / 2 + SIDE_SPACING / 2 + SIDE_SPACING);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 3, this.laneWidth / 2 - SIDE_SPACING / 2);
        drawPin(FIRST_PIN_DISTANCE + NEXT_ROW_SPACING * 3, this.laneWidth / 2 - (SIDE_SPACING / 2 + SIDE_SPACING));

        return this;
    }

    public drawLinearTrace(ballPosition: BallPosition[]) {
        if (ballPosition.length !== 2) {
            return console.warn('Error plotting linear ball trace: Ball position must have 2 elements.');
        }

        const x1 = this.lengthToScaledLength(ballPosition[0].distance);
        const x2 = this.lengthToScaledLength(ballPosition[1].distance);
        const y1 = this.getBoardPositionY(ballPosition[0].board).center;
        const y2 = this.getBoardPositionY(ballPosition[1].board).center;

        const slope = (y2 - y1) / (x2 - x1);
        const intercept = y1 - slope * x1;
        // const getY = (x: number) => slope * x + intercept;
        const getX = (y: number) => (y - intercept) / slope;

        this.context.strokeStyle = 'blue';
        this.context.lineWidth = this.boardWidth * 0.66;
        this.context.beginPath();

        if (slope === 0) {
            this.context.moveTo(0, y1);
            this.context.lineTo(this.laneLength, y2);
        } else {
            this.context.moveTo(getX(0), 0);
            this.context.lineTo(getX(this.laneWidth), this.laneWidth);
        }
        this.context.stroke();
    }
}
