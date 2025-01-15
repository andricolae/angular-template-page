import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1 id="header1">Welcome to the Home Page</h1>
    <p>This is some content for the home page.</p>
    <h2 id="header2">Our Mission</h2>
    <p>We aim to provide the best services.</p>
    <h3 id="header3">Contact Us</h3>
    <p>Reach out for more information.</p>
  `,
  styles: ['h1, h2, h3 { margin: 1rem 0; }']
})
export class HomeComponent {

}
