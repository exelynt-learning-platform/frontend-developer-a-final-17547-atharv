import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/** Starts Angular with the application configuration. */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
