declare module 'bootstrap/js/dist/modal' {
  export default class Modal {
    constructor(
      element: Element,
      options?: { backdrop?: 'static' | boolean; keyboard?: boolean; focus?: boolean },
    );
    show(): void;
    hide(): void;
  }
}
