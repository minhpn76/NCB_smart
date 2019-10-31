import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    children: [
    {
      path: '',
      component: CreateComponent,
      data: {
        icon: 'icon-tag',
        title: 'SideBar.ProductInventory',
        // urls: [{title: 'SideBar.ProductInventory', url: '/province'}, {title: 'SideBar.ProductInventory'}]
      }
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CronjobModuleRoutingModule {}

