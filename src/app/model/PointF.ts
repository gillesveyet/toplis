export class PointF {
    constructor(public x: number, public y: number) { };

    static Origin = new PointF(0, 0);

    rotate(angle: number): PointF {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new PointF(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    // static makePoint(radius: number, angle: number): PointF {
    //     return (new PointF(radius, 0)).rotate(angle);
    // }

    toString() {
        return `{${this.x.toFixed(1)}, ${this.y.toFixed(1)}}`;
    }
}