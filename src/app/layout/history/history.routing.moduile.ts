import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { AccesshistoryComponent } from './accesshistory/accesshistory.component';
import { ActivityhistoryComponent } from './activityhistory/activityhistory.component';



const routes: Routes = [
  {
    path: '',
    children: [
    {
      path: '',
      component: AccessComponent,
      data: {
        icon: 'icon-tag',
        title: 'SideBar.ProductInventory',
        // urls: [{title: 'SideBar.ProductInventory', url: '/province'}, {title: 'SideBar.ProductInventory'}]
      }
    },
    // {
    //   path: 'history',
    //   component: AccesshistoryComponent,
    //   data: {
    //     icon: 'icon-plus',
    //     title: 'PROV2_btt_add',
    //     // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
    //   }
    // },
    // {
    //   path: 'activity',
    //   component: ActivityhistoryComponent,
    //   data: {
    //     icon: 'icon-plus',
    //     title: 'PROV2_btt_add',
    //     // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
    //   }
    // },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HistoryRoutingModule {}

