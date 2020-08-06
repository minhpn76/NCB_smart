import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrServiceRoutingModule } from './qr-service-routing.module';
import { CreateQrComponent } from './create-qr/create-qr.component';
import { EditQrComponent } from './edit-qr/edit-qr.component';
import { ListQrComponent } from './list-qr/list-qr.component';
import { PageHeaderComponent } from '../../shared/modules/page-header/page-header.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CreateQrComponent, EditQrComponent, ListQrComponent, PageHeaderComponent],
  imports: [
    CommonModule,
    QrServiceRoutingModule,
    ReactiveFormsModule
  ]
})
export class QrServiceModule { }
