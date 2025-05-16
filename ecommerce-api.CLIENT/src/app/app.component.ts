import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http'; // ✅ FIX: Change HttpClientModule to provideHttpClient
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, FormsModule], // ✅ REMOVE HttpClientModule here (not needed)
})
export class AppComponent {
  title = 'BigBrew';
}
export class SearchComponent {
  searchQuery = ''; // ✅ Siguraduhin na may variable
}
// ✅ Move providers to `bootstrapApplication` in main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // ✅ Use provideHttpClient instead of HttpClientModule
  ]
});
