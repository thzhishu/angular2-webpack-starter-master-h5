import {Directive, ElementRef, Input, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[scrollable]',
  host: {
    '(scroll)': 'onScroll()'
  }
})

export class ScrollableDirective {
  @Output('scrollEnd') _scrollEnd: EventEmitter<any> = new EventEmitter();
  @Output('scrollTop') _scrollTop: EventEmitter<any> = new EventEmitter();
  // @Output('test') test: EventEmitter<any> = new EventEmitter();
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
    // this.test.next({h:this._el.scrollHeight,t:this._el.scrollTop,ch:this._el.clientHeight});
    if (this._el.scrollHeight-150 < this._el.scrollTop + this._el.clientHeight) {
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
