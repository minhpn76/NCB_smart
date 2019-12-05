import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import {EditComponent} from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { DecenRoutingModule } from './decen.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';



@NgModule({
    imports: [
        CommonModule, DecenRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(), FormsModule, ReactiveFormsModule,
        OrderModule
    ],
    declarations: [
        CreateComponent, ListComponent, EditComponent
    ]
})
export class DecenModule {}
