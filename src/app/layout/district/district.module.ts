import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { DistrictRoutingModule } from './district.routing.module';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
    imports: [
        CommonModule, DistrictRoutingModule, PageHeaderModule, NgbModule,
        FormsModule, ReactiveFormsModule,
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
        ListComponent, CreateComponent, EditComponent
    ]
})
export class DistrictModule {}
