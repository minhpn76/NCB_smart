
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadtuitionComponent } from './uploadtuition/uploadtuition.component';
import { HpUploadTuitionRoutingModule } from './hp-upload-tuition.routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OrderModule } from 'ngx-order-pipe';
import { ReporttuitionComponent } from './reporttuition/reporttuition.component';

@NgModule({
  declarations: [UploadtuitionComponent, ReporttuitionComponent],
  imports: [
    CommonModule,
    HpUploadTuitionRoutingModule,
    PageHeaderModule, NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CKEditorModule,
    SweetAlert2Module.forRoot({
        buttonsStyling: false,
        customClass: 'modal-content',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
    }),
    OrderModule
  ]
})
export class HpUploadTuitionModule { }
