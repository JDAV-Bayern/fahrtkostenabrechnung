import { Component, input, OnInit, output, signal } from '@angular/core';
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

  imageUrl = signal<string>('');

  logoLoaded = false;
  qrCodeLoaded = false;

  async ngOnInit() {
    this.imageUrl.set(await this.qrImage());
  }

  onQrCodeLoaded() {
    this.qrCodeLoaded = true;
    if (this.logoLoaded) {
      this.fullyRendered.emit();
    }
  }
  onLogoLoaded() {
    this.logoLoaded = true;
    if (this.qrCodeLoaded) {
      this.fullyRendered.emit();
    }
  }

  async qrImage(): Promise<string> {
    return QRCode.toDataURL(this.link(), {
      scale: 8,
    }).then((url) => {
      console.log('Generated QR code URL:', url);
      return url;
    });
  }
}
