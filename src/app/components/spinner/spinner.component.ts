import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  imports: [NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  constructor(private spinner: NgxSpinnerService) {}

  show() {
    this.spinner.show();
  }

  hide() {
    this.spinner.hide();
  }
}
