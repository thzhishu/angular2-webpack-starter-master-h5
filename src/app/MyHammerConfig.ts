import { HammerGestureConfig } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
    overrides: {
        pan: { domEvents: true };
        swipe: { domEvents: true };
    };
  // buildHammer(element: HTMLElement): HammerInstance {
  //   var mc = new Hammer(element);
  //   // custom configuration
  //   mc.get('pan').set({ domEvents: true });
  //   mc.get('swipe').set({ domEvents: true });
  //   return mc;
  // }
}
