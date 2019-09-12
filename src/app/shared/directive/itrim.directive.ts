import { Directive,HostListener,Input,ElementRef } from '@angular/core';
import { NgModel,NgControl } from '@angular/forms';
import { Helper } from "../../helper";

@Directive({
  selector: '[itrim]',
  providers: [ Helper ]
})
export class ItrimDirective {
    
    constructor(
        public helper: Helper,
        private el: ElementRef, 
        private control : NgControl) { 
    }

    @HostListener('window:focusout', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if(event.target == this.el.nativeElement){
            let temp = this.el.nativeElement.value.split(" ")
            temp = temp.filter(Boolean)
            temp = temp.join(' ')
            this.el.nativeElement.value = ''
            this.el.nativeElement.value = temp.trim()
            this.control.control.setValue(this.el.nativeElement.value);
        }
    }

    // @HostListener('ngModelChange', ['$event'])
    // onModelChange(event) {
    //     console.log(event);
    // }

    @HostListener('window:keypress', ['$event'])
    keyPressEvent(event: KeyboardEvent) {
        if (event.target == this.el.nativeElement && event.keyCode == 32 && this.el.nativeElement.value.length == 0) { 
            return false; // return false to prevent space from being added
        }
    }

    @HostListener('window:input',['$event']) onEvent($event){
        //let valueToTransform = this.el.nativeElement.value;
        // do something with the valueToTransform
        //this.control.control.setValue(valueToTransform);
    }

    bodauTViet(str) {
        if (!str) {
            return str;
        }
        str = this.helper.bodauTiengViet(str)
        return str;
    }
}