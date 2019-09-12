import { Directive,HostListener,Input,ElementRef } from '@angular/core';
import { NgModel,NgControl } from '@angular/forms';

@Directive({
  selector: '[inumber]'
})
export class InunberDirective {
    
    constructor(private el: ElementRef, private control : NgControl) { 
    }

    @HostListener('window:focusout', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if(event.target == this.el.nativeElement){
            let temp = parseInt(this.el.nativeElement.value)
            this.el.nativeElement.value = ''
            this.el.nativeElement.value = temp
        }
    }

    @HostListener('window:keypress', ['$event'])
    keyPressEvent(event: KeyboardEvent) {
        let arrCode = [45,43] // +,-
        if (event.target == this.el.nativeElement && arrCode.includes(event.keyCode)) { 
            return false; 
        }
        if (event.target == this.el.nativeElement && event.keyCode == 48 && this.el.nativeElement.value.length == 0) { 
            return false; 
        }
    }
    
}