import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessComponent } from './access/access.component';
import { TranslateModule } from '@ngx-translate/core';
import {HistoryRoutingModule} from './history.routing.moduile';
import { FormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AccesshistoryComponent } from './accesshistory/accesshistory.component';
import { ActivityhistoryComponent } from './activityhistory/activityhistory.component';




@NgModule({
    imports: [
        CommonModule, HistoryRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        }),
        FormsModule      
    ],
    declarations: [
        AccessComponent,
        AccesshistoryComponent,
        ActivityhistoryComponent
    ]
})
export class HistoryModule {}
