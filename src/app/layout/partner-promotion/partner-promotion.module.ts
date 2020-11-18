import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PartnerPromotionRoutingModule } from "./partner-promotion-routing.module";
import { CreateComponent } from "./create/create.component";
import { ListComponent } from "./list/list.component";
import { EditComponent } from "./edit/edit.component";
import { EditPromoComponent } from "./edit_promo/edit.component";
import { CreatePromoComponent } from "./create_promo/create.component";
import { PageHeaderModule } from "../../shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        CreateComponent,
        ListComponent,
        EditComponent,
        EditPromoComponent,
        CreatePromoComponent,
    ],
    imports: [
        PageHeaderModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PartnerPromotionRoutingModule,
        NgbModule,
    ],
})
export class PartnerPromotionModule {}
