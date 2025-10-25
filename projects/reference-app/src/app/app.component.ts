import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header>
        <div class="brand">Reactive Primitives • Reference App</div>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/details/42" routerLinkActive="active">Details</a>
          <a routerLink="/settings" routerLinkActive="active">Settings</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" class="badge">Docs</a>
        </nav>
      </header>

      <main>
        <router-outlet />
      </main>

      <div class="footer">Sample reference app for testing the library in a real Angular app (zoneless, routed, CSS).</div>
    </div>
  `,
})
export class AppComponent {}
