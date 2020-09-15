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
            { path: 'create', component: CreateComponent },
            { path: 'edit/:itemId', component: EditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NotificationUserRoutingModule {}
