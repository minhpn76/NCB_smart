import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'qr-services-create',
    templateUrl: './create-qr.component.html',
    styleUrls: ['./create-qr.component.scss'],
    providers: [Helper, NCBService]
})
export class CreateQrComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    private modalOp: NgbModalRef;

    temp: any = {
        loading: false
    };

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router

    ) { }

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            title: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            serviceType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            status: ['A']
        });
    }
    get Form() { return this.dataForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        this.ncbService.createQRServer(this.dataForm.value).then((result) => {
            if (result.status === 200) {
                if (result.json().code === '00') {
                    this.toastr.success('Thêm mới thành công', 'Thành công!');
                    setTimeout(() => {
                        this.router.navigateByUrl('/qr-services');
                    }, 500);
                } else if (result.json().code === '909') {
                    this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                } else {
                    this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                }
            }
        }).catch((err) => {
            this.toastr.error(err.json().description, 'Thất bại!');
        });
    }
    resetForm() {
        this.router.navigateByUrl('/qr-services');
    }
}



