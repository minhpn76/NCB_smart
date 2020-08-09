import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from '../qr-coupon/create/create.component';
import { EditComponent } from '../qr-coupon/edit/edit.component';
import { ListComponent } from '../qr-coupon/list/list.component';
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
export class QrCouponRoutingModule {}
