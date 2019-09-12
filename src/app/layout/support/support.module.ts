import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportSaleComponent } from './sales/sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {SupportRoutingModule} from './support.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupportTransactionComponent } from './transaction/transaction.component';
import {SupportOttBankComponent} from './ott-bank/ott-bank.component';
import { SupportOttSmsComponent } from './ott-sms/ott-sms.component';

@NgModule({
    imports: [
        CommonModule, SupportRoutingModule, PageHeaderModule, NgbModule,
        FormsModule,
        ReactiveFormsModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        })
    ],
    declarations: [
        SupportSaleComponent, SupportTransactionComponent, SupportOttBankComponent,
        SupportOttSmsComponent
    ]
})
export class SupportModule { }
