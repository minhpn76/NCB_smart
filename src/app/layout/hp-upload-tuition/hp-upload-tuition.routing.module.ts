import { UploadtuitionComponent } from './uploadtuition/uploadtuition.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporttuitionComponent } from './reporttuition/reporttuition.component';


/*dia chi cua cac thanh phan, path la ten action.*/
const routes: Routes = [{
    path: '',
    children: [{
        path: '', /*null: default*/
        component: ReporttuitionComponent
    },
    {
        path: 'upload', /*null: default*/
        component: UploadtuitionComponent
    }
]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HpUploadTuitionRoutingModule {}
