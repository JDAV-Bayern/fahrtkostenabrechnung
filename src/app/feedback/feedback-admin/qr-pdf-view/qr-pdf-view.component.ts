import {
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-pdf-view',
  templateUrl: './qr-pdf-view.component.html',
  styleUrls: ['./qr-pdf-view.component.css'],
})
export class QrPdfViewComponent implements OnInit {
  readonly link = input.required<string>();
  readonly courseName = input.required<string | undefined>();
  readonly courseId = input.required<string | undefined>();
  readonly qrCodeType = input.required<string>();
  readonly teamerName = input<string | undefined>();
  readonly fullyRendered = output<void>();

  @ViewChild('qrCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  logoLoaded = false;
  qrCodeLoaded = false;

  async ngOnInit() {
    while (!this.canvasRef) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    const canvas = this.canvasRef.nativeElement;
    await QRCode.toCanvas(canvas, this.link(), { scale: 10 });
    await this.onQrCodeLoaded();
  }

  async onQrCodeLoaded() {
    this.qrCodeLoaded = true;
    if (this.logoLoaded) {
      await this.emitFullyRendered();
    }
  }
  async onLogoLoaded() {
    this.logoLoaded = true;
    if (this.qrCodeLoaded) {
      await this.emitFullyRendered();
    }
  }

  async emitFullyRendered() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.fullyRendered.emit();
  }
}
