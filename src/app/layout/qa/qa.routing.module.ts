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
      data: {
        icon: 'icon-tag',
        title: 'SideBar.ProductInventory',
        // urls: [{title: 'SideBar.ProductInventory', url: '/province'}, {title: 'SideBar.ProductInventory'}]
      }
    },
    {
      path: 'create',
      component: CreateComponent,
      data: {
        icon: 'icon-plus',
        title: 'PROV2_btt_add',
        // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
      }
    },
    {
      path: 'edit/:itemId',
      component: EditComponent,
      data: {
        icon: 'icon-plus',
        title: 'PROV2_btt_add',
        // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
      }
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QaRoutingModule {}

