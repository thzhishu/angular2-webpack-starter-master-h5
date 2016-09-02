import {Directive, ElementRef, Input, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[scrollable]',
  host: {
    '(scroll)': 'onScroll()'
  }
})

export class ScrollableDirective {
  // @Output('scrollEnd') _scrollEnd: boolean;
  @Output('scrollEnd') _scrollEnd: EventEmitter<any> = new EventEmitter();
  @Output('scrollTop') _scrollTop: EventEmitter<any> = new EventEmitter();
  // @Input('returnTop') returnTop;
  _el: HTMLElement;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }
  @Input() set returnTop(flag: boolean) {
    if (flag) {
      this._el.scrollTop = 0;
    }
  }

  onScroll() {
    if (this._el.scrollHeight == this._el.scrollTop + this._el.clientHeight) {
      this._scrollEnd.next(true);
    } else {
      this._scrollEnd.next(false);
    }
    if (this._el.scrollTop == 0) {
      this._scrollTop.next(true);
    } else {
      this._scrollTop.next(false);
    }
  }

}
