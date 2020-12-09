import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditDisComponent } from './edit-dis/edit-dis.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ListComponent},
      { path: 'create', component: CreateComponent},
      {path: 'edit/:itemId', component: EditComponent},
      {path: 'edit-dis/:itemId', component: EditDisComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntroduceFriendsRoutingModule { }
