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

    dOB = 1200;
    dAB = 160;
    dAC = 105;

    nbRopes = 5;
    nbRopesM = 2;

    rMin = 30;
    rMax = 75;
    r: number = this.rMin;

    pD = new PointF(-13, 395);

    rc0: Result;
    graph: PointF[];

    @ViewChild('canCrane') canvasRef: ElementRef;

    ngOnInit() {
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.onSettingsChange();
    }

    onSettingsChange() {
        this.updateGraph();
        this.drawCrane();
    }

    onAngleChange() {
        this.drawCrane();
    }

    computePoints(angle: number): Result {
        let dOA = this.dOB-this.dAB;
        let pA = new PointF(dOA, 0).rotate(angle);
        let pB = new PointF(this.dOB, 0).rotate(angle);
        let pC = new PointF(dOA, this.dAC).rotate(angle);

        return new Result(pA, pB, pC);
    }

    computeHeight(rc: Result) {
        let d0 = Util.calcDistance(this.rc0.c, this.pD);
        let d = Util.calcDistance(rc.c, this.pD);
        return (d - d0) * this.nbRopes / this.nbRopesM  + rc.b.y - this.rc0.b.y;
    }

    updateGraph() {
        this.rc0 = this.computePoints(Util.rad(this.rMin));
        this.graph = []

        for (let i = this.rMin; i <= this.rMax; i += 5) {
            let ri: Result = this.computePoints(Util.rad(i));
            let hi = this.computeHeight(ri);
            this.graph.push(new PointF(ri.b.x, hi));
        }
    }

    drawCrane() {
        let angle = Util.rad(this.r);
        let can = new Canvas2D(this.ctx, Math.min(this.pD.x, 0) - 50, this.dOB, -100);

        let rc: Result = this.computePoints(angle);

        let h = this.computeHeight(rc);
        let pM = new PointF(rc.b.x, h);
        let pE = new PointF(this.pD.x, 0);

        can.clear();
        can.drawLine(new PointF(can.xmin, 0), new PointF(can.xmax, 0), 'black', 1, [3, 2]);

        const colorBoom = 'red';
        can.drawLine(PointF.Origin, rc.b, colorBoom, 5);
        can.drawLine(rc.a, rc.c, colorBoom, 3);

        const colorDrum = 'orange';
        can.drawLine(pE, this.pD, colorDrum, 3);

        const colorRope = 'blue';
        can.drawLine(this.pD, rc.c, colorRope, 1);
        can.drawLine(rc.c, rc.b, colorRope, 1);
        can.drawLine(rc.b, pM, colorRope, 1);

        const colorGraph = 'green';
        let prev: PointF;

        for (let p of this.graph) {
            if (prev)
                can.drawLine(prev, p, colorGraph, 1);

            prev = p;
        }

        let font = '20px Arial';

        can.drawText(PointF.Origin, "O", font, 'left', 'top');
        can.drawText(rc.a, 'A', font, 'left', 'top');
        can.drawText(rc.b, 'B', font, 'left', 'bottom');;
        can.drawText(rc.c, 'C', font, 'left', 'bottom');
        can.drawText(this.pD, 'D', font, 'left', 'bottom');
        can.drawText(pE, 'E', font, 'right', 'bottom');
        can.drawText(pM, 'M', font, 'left', 'top');

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
