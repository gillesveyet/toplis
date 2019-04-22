import { PointF } from '../model/PointF';

export class Util {
    /**
     * Convert degree ro radian.
     * @param r 
     */
    static rad(r: number): number {
        return r * Math.PI / 180;
    }
}
