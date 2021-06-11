
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationUserRoutingModule } from './notication-user-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderModule } from '../../shared';
import { CauhinhsoduEditComponent } from './cauhinhsodu-edit/cauhinhsodu-edit.component';
import { CauhinhsoduComponent } from './cauhinhsodu/cauhinhsodu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderModule } from 'ngx-order-pipe';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CKEditorModule } from 'ckeditor4-angular';
import { EmojiFrequentlyService, EmojiSearch, PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [ListComponent, CreateComponent, EditComponent, CauhinhsoduEditComponent, CauhinhsoduComponent],
  imports: [
    CommonModule, NotificationUserRoutingModule, PageHeaderModule, NgbModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CurrencyMaskModule,
    CKEditorModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    FileUploadModule,
    PickerModule,
    OverlayPanelModule,
    OrderModule
  ],
  providers: [EmojiSearch, EmojiService, EmojiFrequentlyService]
})
export class NotificationUserModule { }
