import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VersionAppLziRoutingModule } from './version-app-lzi-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateComponent, ListComponent, EditComponent],
  imports: [
    PageHeaderModule,
    CommonModule,
    VersionAppLziRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VersionAppLziModule { }
