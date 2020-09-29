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
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'province', loadChildren: () => import('./province/province.module').then(m => m.ProvinceModule), canActivate: [EnsureAuthenticated]},
            { path: 'district', loadChildren: () => import('./district/district.module').then(m => m.DistrictModule) },
            { path: 'bill-service', loadChildren: () => import('./bill-service/bill-service.module').then(m => m.BillServiceModule) },
            { path: 'provision', loadChildren: () => import('./provision/provision.module').then(m => m.ProvisionModule) },
            { path: 'branch', loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule) },
            { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserManagerModule) },
            { path: 'decen', loadChildren: () => import('./decen/decen.module').then(m => m.DecenModule) },
            { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
            { path: 'transaction-room', loadChildren: () => import('./pos/pos.module').then(m => m.PosModule) },
            { path: 'registered-service', loadChildren: () => import('./registered-service/registered-service.module').then(m => m.RegisterServiceModule) },
            { path: 'telecom', loadChildren: () => import('./telecom/telecom.module').then(m => m.TelecomModule) },
            { path: 'qas-info', loadChildren: () => import('./qa/qa.module').then(m => m.QaModule) },
            { path: 'banner', loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule) },
            { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
            { path: 'feature-app', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureAppModule) },
            { path: 'bank-tranfer', loadChildren: () => import('./bank-tranfer/bank-tranfer.module').then(m => m.BankTranferModule) },
            { path: 'suggesstions-error', loadChildren: () => import('./suggess-error/suggess-error.module').then(m => m.SuggessErrorModule) },
            { path: 'pay-card', loadChildren: () => import('./pay-card/pay-card.module').then(m => m.PayCardModule) },
            { path: 'package-user', loadChildren: () => import('./package-user/package-user.module').then(m => m.PackageUserModule) },
            { path: 'package-fee', loadChildren: () => import('./package-fee/package-fee.module').then(m => m.PackageFeeModule) },
            { path: 'guide', loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule) },
            { path: 'notify', loadChildren: () => import('./notify/notify.module').then(m => m.NotifyModule) },
            { path: 'package', loadChildren: () => import('./package/package.module').then(m => m.PackageModule) },
            { path: 'promotion', loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule) },
            { path: 'config-cronjob', loadChildren: () => import('./cronjob/cronjob.module').then(m => m.CronjobModule) },
            { path: 'image-paycard', loadChildren: () => import('./image-paycard/image-paycard.module').then(m => m.ImgPayCardModule) },
            { path: 'promotion-package', loadChildren: () => import('./promotion-package/link.module').then(m => m.PromotionPGModule) },

            // create by tiennx
            {path: 'qr-services', loadChildren: () => import('./qr-server/qr-service.module').then(m => m.QrServiceModule)},

            {path: 'qr-coupons', loadChildren: () => import('./qr-coupon/qr-coupon.module').then(m => m.QrCouponModule)},
            {path: 'qr-merchants', loadChildren: () => import('./qr-merchant/qr-merchant.module').then(m => m.QrMerchantModule)},
            {path: 'notifications', loadChildren: () => import('./notication-user/notication-user.module').then(m => m.NotificationUserModule)},
            {path: 'version-app-lzi', loadChildren: () => import('./version-app-lzi/version-app-lzi.module').then(m => m.VersionAppLziModule)},
            {path: 'introduce-friends', loadChildren: () => import('./introduce-friends/introduce-friends.module').then(m => m.IntroduceFriendsModule)}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
