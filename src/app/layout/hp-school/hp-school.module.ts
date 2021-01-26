import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { HpSchoolRoutingModule } from './hp-school.routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [ListComponent, CreateComponent, EditComponent],
  imports: [
    CommonModule,
    HpSchoolRoutingModule,
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
export class HpSchoolModule { }
