import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'qr-coupons-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [Helper, NCBService]
})
export class CreateComponent implements OnInit {
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

    objectUserTypes = [
      {
        name: 'Tất cả',
        code: '1'
      },
      {
        name: 'Giới hạn',
        code: '0'
      }
    ];

    discountTypes = [
      {
        name: 'Phần trăm',
        code: '1'
      },
      {
        name: 'Giá tiền',
        code: '0'
      }
    ];


    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            desciption: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            code: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            objectUserType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            discountType: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            serviceId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            startDate: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            endDate: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            amount: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            paymentMin: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            paymentMax: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            amountMax: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            amountPercentage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            amountPercustomer: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            totalNumberCoupon: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            status: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            approveStatus: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
        });
    }
    get Form() { return this.dataForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        this.ncbService.createQRCoupon(this.dataForm.value).then((result) => {
            if (result.status === 200) {
                if (result.json().code === '00') {
                    this.toastr.success('Thêm mới thành công', 'Thành công!');
                    setTimeout(() => {
                        this.router.navigateByUrl('/qr-coupons');
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
        this.router.navigateByUrl('/qr-coupons');
    }
}



