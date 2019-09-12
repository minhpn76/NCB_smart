import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change_password/change_pw.component';
import { ManageUserComponent } from './manageuser/manageuser.component';
import { ListComponent } from './list/list.component';
import { EditComponent} from './edit/edit.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

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
      component: ManageUserComponent,
      data: {
        icon: 'icon-tag',
        title: 'SideBar.ProductInventory',
        // urls: [{title: 'SideBar.ProductInventory', url: '/province'}, {title: 'SideBar.ProductInventory'}]
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
    },
    {
      path: 'profile',
      component: ProfileComponent,
      data: {
        icon: 'icon-plus',
        title: 'PROV2_btt_add',
        // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
      }
    },
    {
      path: 'user-profile',
      component: UserProfileComponent,
      data: {
        icon: 'icon-plus',
        title: 'PROV2_btt_add',
        // urls: [{title: 'SideBar.Product', url: '/province'}, {title: 'PROV2_btt_add'}]
      }
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent,
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagerRoutingModule {}

