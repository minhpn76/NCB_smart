import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { CreatePromoComponent } from './create_promo/create.component';
import { EditPromoComponent } from './edit_promo/edit.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ListComponent},
      { path: 'create', component: CreateComponent},
      {path: 'edit/:itemId', component: EditComponent},
      { path: 'create-promo', component: CreatePromoComponent},
      {path: 'edit-promo/:itemId', component: EditPromoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerPromotionRoutingModule { }
