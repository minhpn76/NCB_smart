import { from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule} from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { ItrimDirective } from './shared/directive/itrim.directive';
import { InunberDirective } from './shared/directive/inumber.directive';
import { IemailDirective } from './shared/directive/iemail.directive';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';

import { SecureTrustService } from './secure-trust.service';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CKEditorModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        ItrimDirective,
        InunberDirective,
        IemailDirective,
        SecureTrustService
    ],
    providers: [
        AuthGuard, AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
