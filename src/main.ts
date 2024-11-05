import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideCharts(withDefaultRegisterables()),

    // Import the necessary modules for Toastr
    importProvidersFrom(
      BrowserAnimationsModule, // Required for animations
      ToastrModule.forRoot()   // Configure Toastr globally with default settings
    ),
  ],
}).catch((err) => console.error(err));
