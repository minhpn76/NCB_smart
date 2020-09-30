import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VersionAppLziRoutingModule } from './version-app-lzi-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [CreateComponent, ListComponent, EditComponent],
  imports: [
    PageHeaderModule,
    CommonModule,
    VersionAppLziRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class VersionAppLziModule { }
