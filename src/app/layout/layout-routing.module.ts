import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { EnsureAuthenticated } from '../services/ensure-authenticated.service';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'province', loadChildren: './province/province.module#ProvinceModule', canActivate: [EnsureAuthenticated]},
            { path: 'district', loadChildren: './district/district.module#DistrictModule' },
            { path: 'bill-service', loadChildren: './bill-service/bill-service.module#BillServiceModule' },
            { path: 'provision', loadChildren: './provision/provision.module#ProvisionModule' },
            { path: 'branch', loadChildren: './branch/branch.module#BranchModule' },
            { path: 'user', loadChildren: './user/user.module#UserManagerModule' },
            { path: 'decen', loadChildren: './decen/decen.module#DecenModule' },
            { path: 'history', loadChildren: './history/history.module#HistoryModule' },
            { path: 'transaction-room', loadChildren: './pos/pos.module#PosModule' },
            { path: 'registered-service', loadChildren: './registered-service/registered-service.module#RegisterServiceModule' },
            { path: 'telecom', loadChildren: './telecom/telecom.module#TelecomModule' },
            { path: 'qas-info', loadChildren: './qa/qa.module#QaModule' },
            { path: 'banner', loadChildren: './banner/banner.module#BannerModule' },
            { path: 'product', loadChildren: './product/product.module#ProductModule' },
            { path: 'feature-app', loadChildren: './feature/feature.module#FeatureAppModule' },
            { path: 'bank-tranfer', loadChildren: './bank-tranfer/bank-tranfer.module#BankTranferModule' },
            { path: 'suggesstions-error', loadChildren: './suggess-error/suggess-error.module#SuggessErrorModule' },
            { path: 'pay-card', loadChildren: './pay-card/pay-card.module#PayCardModule' },
            { path: 'package-user', loadChildren: './package-user/package-user.module#PackageUserModule' },
            { path: 'guide', loadChildren: './guide/guide.module#GuideModule' },
            { path: 'notify', loadChildren: './notify/notify.module#NotifyModule' },
            { path: 'package', loadChildren: './package/package.module#PackageModule' },
            { path: 'promotion', loadChildren: './promotion/promotion.module#PromotionModule' },
            { path: 'role-decen', loadChildren: './role-decen/role-decen.module#RoleDecenModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
