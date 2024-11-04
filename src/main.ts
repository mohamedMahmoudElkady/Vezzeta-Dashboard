import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread operator ensures appConfig is used correctly as part of the configuration object
  providers: [
    ...appConfig.providers, // Spread existing providers from appConfig
    provideCharts(withDefaultRegisterables()), // Add the new provider for charts
  ],
}).catch((err) => console.error(err));
