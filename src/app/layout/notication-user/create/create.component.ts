import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';

import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';
import { async } from '@angular/core/testing';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import { listNotify } from '../code';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
    selector: 'notifications-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [Helper, NCBService, ExcelService],
})
export class CreateComponent implements OnInit {
    objUpload: any = {};
    isLockSave = false;
    objFile: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router,
        private excelService: ExcelService
    ) {
        // this.getNotifications();
        this.loadDate();
    }
    get Form() {
        return this.dataForm.controls;
    }
    // Editor = DecoupledEditor;
    // public Editor = ClassicEditor;
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    dataForm: FormGroup;
    submitted = false;
    private modalOp: NgbModalRef;
    fileExcel: any = {
        file: File,
        path: null,
        name: '',
    };
    arrayBuffer: any = [];
    filelist: any = [];

    temp: any = {
        loading: false,
    };
    optionCurrency: any = {
        prefix: '',
        thousands: '.',
        decimal: ',',
        align: 'left',
    };

    objectUserTypes = [
        {
            code: '',
            name: '---Vui lòng chọn đối tượng áp dụng---',
        },
        {
            name: 'Tất cả',
            code: '0',
        },
        {
            name: 'Giới hạn',
            code: '1',
        },
    ];

    listStatus = [
        {
            code: '',
            name: '---Vui lòng chọn trạng thái---',
        },
        {
            code: 'A',
            name: 'Kích hoạt',
        },
        {
            name: 'Chưa kích hoạt',
            code: 'D',
        },
    ];

    listNotifications: any = [...listNotify];

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            title: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            content: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            repeatType: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            repeatValue: ['', Validators.compose([Validators.required])],
            // repeatValue: [this.mRatesDateS_7],

            objectUserType: ['', Validators.compose([Validators.required])],
            status: [''],
            type: '2',

            createdAt: [this.mRatesDateS_7],
            endDate: [this.mRatesDateS],
            user_notifications: [],
        });
    }
    openModal(content) {
        this.modalOp = this.modalService.open(content);
    }

    public loadDate(): void {
        // this.my_7.setDate(this.my_7.getDate() + 7);
        this.mRatesDateS = {
            year: this.my.getFullYear(),
            month: this.my.getMonth(),
            day: this.my.getDate(),
        };
    }

    getNotifications() {
        this.listNotifications = [
            {
                code: '',
                name: '---Vui lòng chọn cách thức lặp---',
            },
        ];
        // xu ly
        this.ncbService
            .getListNoticationUser({
                size: 1000,
                page: 0,
            })
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    body.content.map((item) => {
                        this.listNotifications.push({
                            code: item.id,
                            name: item.repeatType,
                        });
                    });
                }, 300);
            })
            .catch((err) => {
                this.listNotifications = [
                    {
                        code: '',
                        name: '---Vui lòng chọn cách thức lặp---',
                    },
                ];
            });
    }

    public onReady(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            console.log('loader : ', loader);
            console.log(btoa(loader.file));
            return new UploadAdapter(loader);
        };
        editor.ui.view.editable.element.parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.view.editable.element
        );
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        const payload = {
            title: this.dataForm.value.title,
            content: this.dataForm.value.content,
            repeatType: this.dataForm.value.repeatType,
            repeatValue: this.dataForm.value.repeatValue,
            objectUserType: this.dataForm.value.objectUserType,
            status: this.dataForm.value.status,
            userNotifications: this.dataForm.value.user_notifications
                ? this.dataForm.value.user_notifications
                : this.filelist,
            type: '2',
        };

        this.ncbService
            .createNoticationUser(payload)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Thêm mới thành công',
                            'Thành công!'
                        );
                        setTimeout(() => {
                            this.router.navigateByUrl('/notifications');
                        }, 500);
                    } else if (result.json().code === '909') {
                        this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                    } else if (result.json().code === '1001') {
                        this.toastr.error(
                            `Người dùng ${
                                result.json().description
                            } không tồn tại trong hệ thống`,
                            'Thất bại!'
                        );
                    } else {
                        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                    }
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().content, 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/notifications');
    }
    closeModal() {
        this.modalOp.close();
    }
    onUploadFile(event) {
        const fileList: FileList = event.files;
        if (fileList.length > 0) {
            this.fileExcel.file = fileList[0];
            this.fileExcel.name = fileList[0].name;
            this.fileExcel.size = fileList[0].size;
        }
    }

    // upload image
    onUploadServer() {
        if (this.fileExcel.file) {
            this.temp.loading = true;
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.fileExcel.file);
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                const data = new Uint8Array(this.arrayBuffer);
                const arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[first_sheet_name];
                console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                const arraylist = XLSX.utils.sheet_to_json(worksheet, {
                    raw: true,
                });
                this.filelist = arraylist;
                this.dataForm.value.user_notifications = arraylist;
            };
            this.temp.loading = false;
            this.closeModal();
        }
    }
}

// upload image ckeditor5
export class UploadAdapter {
    private loader;
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const myReader = new FileReader();
                    myReader.onloadend = (e) => {
                        resolve({ default: myReader.result });
                    };

                    myReader.readAsDataURL(file);
                })
        );
    }
}
