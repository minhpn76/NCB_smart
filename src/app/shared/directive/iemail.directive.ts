import { Directive,HostListener,Input,ElementRef } from '@angular/core';
import { NgModel,NgControl } from '@angular/forms';
import { Helper } from "../../helper";

@Directive({
  selector: '[iemail]',
  providers: [ Helper ]
})
export class IemailDirective {
    
    constructor(
        public helper: Helper,
        private el: ElementRef, 
        private control : NgControl
    ) { 
    }

    @HostListener('window:focusout', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if(event.target == this.el.nativeElement){
            let temp = this.bodauTViet(this.el.nativeElement.value)
            this.el.nativeElement.value = ''
            this.el.nativeElement.value = temp
        }
    }

    @HostListener('window:keypress', ['$event'])
    keyPressEvent(event: KeyboardEvent) {
        if (event.target == this.el.nativeElement && event.keyCode == 32) { 
            return false; // return false to prevent space from being added
        }
    }

    bodauTViet(str) {
        if (!str) {
            return str;
        }
        str = this.helper.bodauTiengViet(str)
        str = str.replace(/ +/g, "");
        return str;
    }
}