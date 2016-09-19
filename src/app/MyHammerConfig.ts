import { HammerGestureConfig } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement): Object {
    var mc = new Hammer(element);

    // custom configuration
    mc.get('pan').set({ threshold: 5, domEvents: true });
    mc.get('swipe').set({ threshold: 5, domEvents: true });

    return mc;
  }
}
