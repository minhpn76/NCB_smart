import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Theem cac thanh phan lien quan vao day*/
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';

/*dia chi cua cac thanh phan, path la ten action.*/
const routes: Routes = [{
    path: '',
    children: [{
        path: '', /*null: default*/
        component: ListComponent
    },
    {
        path: 'create', /*redection to create*/
        component: CreateComponent
    },
    {
        path: 'edit/:itemId', /*redection to edit kem theo data*/
        component: EditComponent
    }
]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HpSchoolRoutingModule {}
