import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrCouponRoutingModule } from './qr-coupon-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [ListComponent, CreateComponent, EditComponent],
  imports: [
    CommonModule, QrCouponRoutingModule, PageHeaderModule, NgbModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        }),
        FileUploadModule,
        OrderModule
  ]
})
export class QrCouponModule { }
