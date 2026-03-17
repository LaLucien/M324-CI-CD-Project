import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('M324 CI/CD Project');
  protected readonly description = signal(
    'A minimal Angular SSR application used to build and validate a CI/CD pipeline foundation.',
  );
  protected readonly deploymentStatus = signal('Public Render deployment URL will be added here.');
}
