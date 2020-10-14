import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from '../version-app-lzi/create/create.component';
import { ListComponent } from '../version-app-lzi/list/list.component';
import { EditComponent } from '../version-app-lzi/edit/edit.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ListComponent },
            { path: 'create', component: CreateComponent },
            { path: 'edit/:itemCode', component: EditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VersionAppLziRoutingModule {}
