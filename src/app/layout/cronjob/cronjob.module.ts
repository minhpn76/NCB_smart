import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { TranslateModule } from '@ngx-translate/core';
import { CronjobModuleRoutingModule } from './cronjob.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CronEditorModule } from 'cron-editor';
import { ClipboardModule } from 'ngx-clipboard';



@NgModule({
    imports: [
        CommonModule, CronjobModuleRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(), FormsModule, ReactiveFormsModule,
        CronEditorModule, ClipboardModule
    ],
    declarations: [
        CreateComponent
    ]
})
export class CronjobModule {}
