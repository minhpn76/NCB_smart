import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'branch-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
    dataForm: FormGroup;
    private modalOp: NgbModalRef;
    fileExcel: any = {
        file: File,
        path: null,
        name: ''
    };
    temp: any = {
        loading: false
    };
    submitted = false;
    listProvice: any = [
        {
            name: 'Tất cả',
            code: 0
        },
        {
            name: 'Hà Nội',
            code: 1
        }
    ];
    listDistrict: any = [
        {
            name: 'Vui lòng chọn quận huyện',
            code: ''
        },
        {
            name: 'Quan TEst',
            code: 'TESTTTT'
        }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router
    ) {}

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            compCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            compName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            address: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            dao: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            mcn: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            mp: ['', Validators.compose([Validators.maxLength(13), Validators.pattern(/^((?!\s{2,}).)*$/)])]
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
        this.ncbService
            .createCompany(this.dataForm.value)
            .then(result => {
                if (result.json().code === '00') {
                    this.toastr.success('Thêm mới chi nhánh', 'Thành công!');
                    setTimeout(() => {
                        this.router.navigateByUrl('/branch');
                    }, 500);
                } else if (result.json().code === '907') {
                    this.toastr.error('Dự liệu đã tồn tại', 'Thất bại!');
                } else {
                    this.toastr.error('Thêm mới chi nhánh thất bại', 'Thất bại!');
                }
            })
            .catch(err => {});
    }
    resetForm() {
        this.router.navigateByUrl('/branch');
    }
}
