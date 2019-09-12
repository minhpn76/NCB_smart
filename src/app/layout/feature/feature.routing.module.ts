import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent} from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    children: [
    {
      path: '',
      component: ListComponent,

    },
    {
      path: 'create',
      component: CreateComponent,

    },
    {
      path: 'edit/:Id',
      component: EditComponent
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureAppRoutingModule {}

