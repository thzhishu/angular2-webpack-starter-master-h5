import {Directive, ElementRef, Output,EventEmitter} from '@angular/core';

@Directive({
  selector: '[scrollable]',
  host: {
    '(scroll)': 'onScroll()'
  }
})

export class ScrollableDirective{
  // @Output('scrollEnd') _scrollEnd: boolean;
  @Output('scrollEnd') _scrollEnd: EventEmitter<any> = new EventEmitter();
  _el: HTMLElement;

  constructor(el:ElementRef){
      this._el = el.nativeElement;
  }

  onScroll(){
    if (this._el.scrollHeight == this._el.scrollTop + this._el.clientHeight) {
       this._scrollEnd.next(true);
   }else{
       this._scrollEnd.next(false);
   }
  }

}
