import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../qr-coupon/list/list.component';
import { CreateComponent } from '../qr-coupon/create/create.component';
import { EditComponent } from '../qr-coupon/edit/edit.component';
const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: ListComponent },
            { path: 'create', component: CreateComponent },
            { path: 'edit', component: EditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QrCouponRoutingModule {}
