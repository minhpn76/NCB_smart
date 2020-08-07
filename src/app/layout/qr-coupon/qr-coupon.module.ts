import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrCouponRoutingModule } from './qr-coupon-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderComponent } from '../../shared/modules/page-header/page-header.component';


@NgModule({
  declarations: [ListComponent, CreateComponent, EditComponent,PageHeaderComponent],
  imports: [
    CommonModule,
    QrCouponRoutingModule
  ]
})
export class QrCouponModule { }
