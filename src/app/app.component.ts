import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PointF } from './model/PointF';
import { Canvas2D } from './services/Canvas2D';
import { Util } from './services/Util';


class Result {
    constructor(public a: PointF, public b: PointF, public c: PointF) {
    }
}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    ctx: CanvasRenderingContext2D;

    dOA = 1200;
    dAB = 290;
    dBC = this.dAB * Math.sin(Util.rad(45)) | 0;      // For initial value, assume that angle BAC = 45°

    nbRopes = 3;

    rMin = 20;
    rMax = 70;
    r: number = this.rMin;

    pD = new PointF(-12.7, 500);

    @ViewChild('canCrane') canvasRef: ElementRef;

    ngOnInit() {
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.drawCrane();
    }

    onSettingsChange() {
        this.drawCrane();
    }

    onAngleChange() {
        this.drawCrane();
    }


    compute(angle: number): Result {
        let dAC = Math.sqrt(this.dAB * this.dAB - this.dBC * this.dBC);
        let dOC = this.dOA - dAC;

        let pA = new PointF(this.dOA, 0).rotate(angle);
        let pC = new PointF(dOC, 0).rotate(angle);
        let pB = new PointF(dOC, this.dBC).rotate(angle);

        return new Result(pA, pB, pC);
    }


    computeHeight(rc0: Result, rc: Result) {
        let d0 = Util.calcDistance(rc0.b, this.pD);
        let d = Util.calcDistance(rc.b, this.pD);
        return (d - d0) * this.nbRopes / 2 + rc.a.y - rc0.a.y;
    }

    drawCrane() {
        let angle = Util.rad(this.r);
        let can = new Canvas2D(this.ctx, Math.min(this.pD.x, 0) - 20, this.dOA, -100);

        let rc0: Result = this.compute(Util.rad(this.rMin));
        let rc: Result = this.compute(angle);

        let h = this.computeHeight(rc0, rc);

        let pM = new PointF(rc.a.x, h);

        let pE = new PointF(this.pD.x, 0);

        can.clear();
        can.drawLine(new PointF(can.xmin, 0), new PointF(can.xmax, 0), 'black', 1, [3, 2]);

        const colorBoom = 'red';
        can.drawLine(PointF.Origin, rc.a, colorBoom, 5);
        can.drawLine(rc.b, rc.c, colorBoom, 3);

        const colorDrum = 'orange';
        can.drawLine(pE, this.pD, colorDrum, 3);

        const colorRope = 'blue';
        can.drawLine(this.pD, rc.b, colorRope, 1);
        can.drawLine(rc.b, rc.a, colorRope, 1);
        can.drawLine(rc.a, pM, colorRope, 1);

        const colorGraph = 'green';
        let prev: PointF;

        for (let i = this.rMin; i <= this.rMax; i += 5) {
            let ri: Result = this.compute(Util.rad(i));
            let hi = this.computeHeight(rc0, ri);
            let p = new PointF(ri.a.x, hi);

            if (prev)
                can.drawLine(prev, p, colorGraph, 1);

            prev = p;
        }

    }

    // deferredInstallPrompt: any;
    // showInstallButton = false;
    // @HostListener('window:beforeinstallprompt', ['$event'])
    // onbeforeinstallprompt(e) {
    //     console.log(e);
    //     // Prevent Chrome 67 and earlier from automatically showing the prompt
    //     e.preventDefault();
    //     // Stash the event so it can be triggered later.
    //     this.deferredInstallPrompt = e;
    //     this.showInstallButton = true;
    // }
    // addToHomeScreen() {
    //     // hide our user interface that shows our A2HS button
    //     this.showInstallButton = false;
    //     // Show the prompt
    //     this.deferredInstallPrompt.prompt();
    //     // Wait for the user to respond to the prompt
    //     this.deferredInstallPrompt.userChoice
    //         .then((choiceResult) => {
    //             if (choiceResult.outcome === 'accepted') {
    //                 console.log('User accepted the A2HS prompt');
    //             } else {
    //                 console.log('User dismissed the A2HS prompt');
    //             }
    //             this.deferredInstallPrompt = null;
    //         });
    // }

}
