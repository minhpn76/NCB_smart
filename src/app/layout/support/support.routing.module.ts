import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportSaleComponent } from './sales/sales.component';
import { SupportTransactionComponent } from './transaction/transaction.component';
import { SupportOttBankComponent } from './ott-bank/ott-bank.component';
import { SupportOttSmsComponent } from './ott-sms/ott-sms.component';

const routes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'history-sales',
      component: SupportSaleComponent
    },
    {
      path: 'history-transaction',
      component: SupportTransactionComponent
    },
    {
      path: 'ott-bank',
      component: SupportOttBankComponent
    },
    {
      path: 'ott-sms',
      component: SupportOttSmsComponent
    }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupportRoutingModule {}

