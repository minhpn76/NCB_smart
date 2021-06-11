
import { CauhinhsoduComponent } from '../notication-user/cauhinhsodu/cauhinhsodu.component';
import { CauhinhsoduEditComponent } from '../notication-user/cauhinhsodu-edit/cauhinhsodu-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from '../notication-user/create/create.component';
import { EditComponent } from '../notication-user/edit/edit.component';
import { ListComponent } from '../notication-user/list/list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ListComponent },
            { path: 'listsodu', component: CauhinhsoduComponent},
            { path: 'create', component: CreateComponent },
            { path: 'edit/:itemId', component: EditComponent },
            { path: 'EditSoDu/:itemId', component:  CauhinhsoduEditComponent}
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NotificationUserRoutingModule {}
