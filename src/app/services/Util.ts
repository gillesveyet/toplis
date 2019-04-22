import { PointF } from '../model/PointF';

export class Util {
    /**
     * Convert degree ro radian.
     * @param r 
     */
    static rad(r: number): number {
        return r * Math.PI / 180;
    }

    static calcDistance(a: PointF, b: PointF): number {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy + dy);

    }
}
