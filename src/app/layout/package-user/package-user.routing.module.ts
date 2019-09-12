import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

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
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageUserRoutingModule {}

