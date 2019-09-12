import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDecenModuleRoutingModule } from './role-decen.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule, RoleDecenModuleRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(), FormsModule, ReactiveFormsModule
    ],
    declarations: [
        ListComponent
    ]
})
export class RoleDecenModule {}
