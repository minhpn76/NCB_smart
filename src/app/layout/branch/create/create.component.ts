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
            brnCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            branchName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            departCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            departName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            address: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
            phone: ['', Validators.compose([Validators.maxLength(13), Validators.pattern(/^((?!\s{2,}).)*$/)])],
            fax: [''],
            latitude: [''],
            longitude: [''],
            urlImg: [''],
            dao: [''],
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
                        this.router.navigateByUrl('/branch');
                    }, 500);
                } else {
                    this.toastr.error('Thêm mới chi nhánh thất bại', 'Thất bại!');
                }
            })
            .catch(err => {});
    }
    resetForm() {
        this.router.navigateByUrl('/branch');
    }

    openModal(content) {
        this.modalOp = this.modalService.open(content);
    }

    onUploadFile(event) {
        const fileList: FileList = event.files;
        if (fileList.length > 0) {
            this.fileExcel.file = fileList[0];
            this.fileExcel.name = fileList[0].name;
            this.fileExcel.size = fileList[0].size;
        }
    }
    onUploadServer() {
        console.log('up to server');
        // let data = this.list_couriers.filter(v => v['CourierId'] == this.courierId);
        // let courierName = data[0].Name

        // if (this.fileExcel.file) {
        //     this.temp.loading = true
        //     let file: File = this.fileExcel.file;
        //     this.journeyService.upFileExcel(file, {
        //         'courierId': this.courierId,
        //         'courierName': courierName,
        //         'email_upload': this.user_email
        //     }).then((result) => {
        //         let rep = result.json()
        //         if (rep.error == true) {
        //             this.appComponent.toasterTranslate('error', 'TICM_uploadfileloihaythulai');
        //         } else {
        //             let dataReponse = {
        //                 'FileUpload': result.json().data,
        //                 'CourierId': this.courierId,
        //                 'courierName': courierName,
        //                 'email_upload': this.user_email,
        //                 'Action': 'uploadFile'
        //             }
        //             this.change.emit(dataReponse);
        //             this.appComponent.toastr.success(result.json().messages, 'Oops!');
        //         }
        //         this.temp.loading = false
        //         this.emitCloseModal.emit(true);
        //     })
        //         .catch((err) => {
        //             this.temp.loading = false
        //             this.appComponent.toastr.warning(this.appComponent.instantTranslate('Toaster_PleaseTryAgain'), 'Oops!');
        //         });
        // }
    }
}
