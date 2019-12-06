import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PackageUserRoutingModule } from './package-user.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    imports: [
        CommonModule, PackageUserRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(),
        FormsModule, ReactiveFormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        OrderModule
    ],
    declarations: [
        ListComponent
    ]
})
export class PackageUserModule {}
