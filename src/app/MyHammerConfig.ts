import {Injectable} from '@angular/core';
import {HammerGestureConfig} from '@angular/platform-browser';

/* Adjusts configuration of our gesture library, Hammer. */
// @Injectable()
export class MyHammerConfig extends HammerGestureConfig {

  /* List of new event names to add to the gesture support list */
  events: string[] = [
    'drag',
    'dragstart',
    'dragend',
    'dragright',
    'dragleft',
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
  ];

  // overrides = {
  //   pan: { domEvents: true },
  //   swipe: { domEvents: true },
  // };


  /*
   * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
   *
   * Our gesture names come from the Material Design gestures spec:
   * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
   *
   * More information on default recognizers can be found in Hammer docs:
   * http://hammerjs.github.io/recognizer-pan/
   * http://hammerjs.github.io/recognizer-press/
   *
   * TODO: Confirm threshold numbers with Material Design UX Team
   * */
  buildHammer(element: HTMLElement) {
    const mc = new Hammer.Manager(element,{ domEvents: true });

    // Default Hammer Recognizers.
    let pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });
    let swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });
    let press = new Hammer.Press({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });

    // Notice that a HammerJS recognizer can only depend on one other recognizer once.
    // Otherwise the previous `recognizeWith` will be dropped.
    let slide = this._createRecognizer(pan, {direction: Hammer.DIRECTION_HORIZONTAL,event: 'slide', threshold: 0}, swipe);
    let drag = this._createRecognizer(slide, {direction: Hammer.DIRECTION_HORIZONTAL,event: 'drag', threshold: 6}, swipe);
    let longpress = this._createRecognizer(press, {direction: Hammer.DIRECTION_HORIZONTAL,event: 'longpress', time: 500});

    // Overwrite the default `pan` event to use the swipe event.
    pan.recognizeWith(swipe);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, drag, slide, longpress]);

    return mc;
  }

  /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
  private _createRecognizer(base: Recognizer, options: any, ...inheritances: Recognizer[]) {
    let recognizer = new (<RecognizerStatic> base.constructor)(options);

    inheritances.push(base);
    inheritances.forEach((item) => recognizer.recognizeWith(item));

    return recognizer;
  }

}
