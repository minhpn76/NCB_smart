import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQrComponent } from './list-qr/list-qr.component';
import { EditQrComponent } from './edit-qr/edit-qr.component';
import { CreateQrComponent } from './create-qr/create-qr.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ListQrComponent },
            {
                path: 'edit',
                component: EditQrComponent,
            },
            {
                path: 'create',
                component: CreateQrComponent,
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QrServiceRoutingModule {}
