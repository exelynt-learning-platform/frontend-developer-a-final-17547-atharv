import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader {
  /**
   * Controls whether the loader is displayed.
   */
  loader = input<boolean>(false);
}
