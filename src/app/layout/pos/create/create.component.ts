import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pos-create',
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
    listTempComp: any = [];
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
    ) {
        this.getListCompName();
    }

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            brnCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            branchName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            departCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            departName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            address: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
            phone: ['', Validators.compose([Validators.maxLength(13), this.helper.noWhitespaceValidator])],
            fax: ['', Validators.compose([this.helper.noWhitespaceValidator])],
            latitude: ['', Validators.compose([this.helper.noWhitespaceValidator])],
            longitude: ['', Validators.compose([this.helper.noWhitespaceValidator])],
            urlImg: ['', Validators.compose([this.helper.noWhitespaceValidator])],
            dao: ['', Validators.compose([this.helper.noWhitespaceValidator])],
            status: 'A'
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
            .createBranch(this.dataForm.value)
            .then(result => {
                if (result.json().code === '00') {
                    this.toastr.success('Thêm mới chi nhánh', 'Thành công!');
                    setTimeout(() => {
                        this.router.navigateByUrl('/transaction-room');
                    }, 500);
                } else if (result.json().code === '905') {
                    this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                } else {
                    this.toastr.error('Thêm mới chi nhánh thất bại', 'Thất bại!');
                }
            })
            .catch(err => { });
    }
    resetForm() {
        this.router.navigateByUrl('/transaction-room');
    }

    openModal(content) {
        this.modalOp = this.modalService.open(content);
    }
    getListCompName() {
        this.ncbService.getListCompName().then(res => {
            if (res.json().code === '00') {
                const body = res.json().body;
                body.forEach(element => {
                    this.listTempComp.push({
                        name: element.compName,
                        code: element.compCode,
                    });
                });
            } else {
                this.toastr.error('Không lấy được dự liệu', 'Thất bại');
            }

        }).catch(e => {

        });
    }
    onChangeComp(event) {
        const newArr = this.listTempComp.find(e => e.code === this.dataForm.value.brnCode);
        this.dataForm.patchValue({
           branchName : newArr.name
       });
    }
    onChangeCompC(event) {
        const newArr = this.listTempComp.find(e => e.name === this.dataForm.value.branchName);
        this.dataForm.patchValue({
            brnCode : newArr.code
       });
    }


    onUploadFile(event) {
        const fileList: FileList = event.files;
        if (fileList.length > 0) {
            this.fileExcel.file = fileList[0];
            this.fileExcel.name = fileList[0].name;
            this.fileExcel.size = fileList[0].size;
        }
    }
}
