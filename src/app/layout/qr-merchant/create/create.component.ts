import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Helper } from "../../../helper";
import { NCBService } from "../../../services/ncb.service";
import { Router } from "@angular/router";
import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';

@Component({
    selector: "qr-merchants-create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [Helper, NCBService, ExcelService],
})
export class CreateComponent implements OnInit {
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    dataForm: FormGroup;
    submitted = false;
    private modalOp: NgbModalRef;
    
    listQrService: any = [];
    optionCurrency: any = {
        prefix: "",
        thousands: ".",
        decimal: ",",
        align: "left",
    };

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router,
        private excelService: ExcelService,
    ) {
     
    }

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            name: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            address: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ]
        });
    }
    get Form() {
        return this.dataForm.controls;
    }
    
      
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        const payload = {
            name:this.dataForm.value.name,
            address:this.dataForm.value.address,
        }
        this.ncbService
            .createQRMerchant(payload)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === "00") {
                        this.toastr.success(
                            "Thêm mới thành công",
                            "Thành công!"
                        );
                        setTimeout(() => {
                            this.router.navigateByUrl("/qr-merchants");
                        }, 500);
                    } else if (result.json().code === "909") {
                        this.toastr.error("Dữ liệu đã tồn tại", "Thất bại!");
                    } else {
                        this.toastr.error("Thêm mới thất bại", "Thất bại!");
                    }
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().description, "Thất bại!");
            });
    }
    resetForm() {
        this.router.navigateByUrl("/qr-merchants");
    }
   
    
    
}
