import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from '../qr-merchant/create/create.component';
import { EditComponent } from '../qr-merchant/edit/edit.component';
import { ListComponent } from '../qr-merchant/list/list.component';
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
export class QrMerchantRoutingModule {}
