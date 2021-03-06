import { PointF } from '../model/PointF';

//From lib.dom.d.ts (https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)
//  type CanvasTextAlign = "start" | "end" | "left" | "right" | "center";
//  type CanvasTextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

class Point {
    constructor(public x: number, public y: number) { };

    toString() {
        return `{${this.x}, ${this.y}}`;
    }
}

export class Canvas2D {
    readonly width: number;
    readonly height: number;
    readonly scale: number;

    constructor(private ctx: CanvasRenderingContext2D, public xmin: number, public xmax: number, public ymin: number) {
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.scale = this.width / (xmax - xmin);
        // console.log(`Canvas width:${ctx.canvas.width} height:${ctx.canvas.height}`)
        // console.log(`xmin:${xmin} xmax:${xmax} scale:${this.scale}`)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawLine(a: PointF, b: PointF, color = 'black', width = 1, dash: number[] = []) {
        let ctx = this.ctx;

        let ca = this.convert(a);
        let cb = this.convert(b);

        ctx.beginPath();
        ctx.setLineDash(dash);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(ca.x, ca.y);
        ctx.lineTo(cb.x, cb.y);
        ctx.stroke();

        //console.log(`drawLine ${a} to ${b} => ${ca} to ${cb}`);
    }

    drawText(p: PointF, text: string, font: string = '10px sans-serif', textAlign: CanvasTextAlign = "start", textBaseline: CanvasTextBaseline = 'alphabetic') {
        let ctx = this.ctx;
        let cp = this.convert(p);

        ctx.font = font;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillText(text, cp.x, cp.y);
    }

    convert(p: PointF) {
        return new Point((p.x - this.xmin) * this.scale | 0, this.height - (p.y - this.ymin) * this.scale | 0);
    }

}