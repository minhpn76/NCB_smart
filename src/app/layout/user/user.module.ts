import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manageuser/manageuser.component';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserManagerRoutingModule } from './user.routing.module';
import { ChangePasswordComponent } from './change_password/change_pw.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { ProfileComponent } from './profile/profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    imports: [
        CommonModule, UserManagerRoutingModule, PageHeaderModule, NgbModule,
        TranslateModule.forChild(),
        FormsModule, ReactiveFormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        OrderModule
    ],
    declarations: [
        ChangePasswordComponent, ManageUserComponent, ListComponent, EditComponent,
        ProfileComponent, UserProfileComponent
    ]
})
export class UserManagerModule {}
