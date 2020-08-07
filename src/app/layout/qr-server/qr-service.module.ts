
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CreateQrComponent } from './create-qr/create-qr.component';
import { EditQrComponent } from './edit-qr/edit-qr.component';
import { ListQrComponent } from './list-qr/list-qr.component';
import { QrServiceRoutingModule } from './qr-service-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
    imports: [
        CommonModule, QrServiceRoutingModule, PageHeaderModule, NgbModule,
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
    ],
    declarations: [
      CreateQrComponent, ListQrComponent, EditQrComponent
    ]
})
export class QrServiceModule {}

