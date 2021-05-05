import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';

import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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
    objUpload: any = {};
    isLockSave = false;
    objFile: any = {};
    ckConfig: any = {};
    public Editor = DecoupledEditor;
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

    listDay = [
        { code: 2, value: ' Thứ 2' },
        { code: 3, value: ' Thứ 3' },
        { code: 4, value: ' Thứ 4' },
        { code: 5, value: ' Thứ 5' },
        { code: 6, value: ' Thứ 6' },
        { code: 7, value: ' Thứ 7' },
        { code: 8, value: ' Chủ nhật' },
    ];

    listDates = [
        { code: '01', value: ' 01' },
        { code: '02', value: ' 02' },
        { code: '03', value: ' 03' },
        { code: '04', value: '  04' },
        { code: '05', value: '  05' },
        { code: '06', value: '  06' },
        { code: '07', value: ' 07' },
        { code: '08', value: ' 08' },
        { code: '09', value: ' 09' },
        { code: 10, value: ' 10' },
        { code: 11, value: ' 11' },
        { code: 12, value: ' 12' },
        { code: 13, value: ' 13' },
        { code: 14, value: ' 14' },
        { code: 15, value: ' 15' },
        { code: 16, value: ' 16' },
        { code: 17, value: ' 17' },
        { code: 18, value: ' 18' },
        { code: 19, value: ' 19' },
        { code: 20, value: ' 20' },
        { code: 21, value: ' 21' },
        { code: 22, value: ' 22' },
        { code: 23, value: ' 23' },
        { code: 24, value: ' 24' },
        { code: 25, value: ' 25' },
        { code: 26, value: ' 26' },
        { code: 27, value: ' 27' },
        { code: 28, value: ' 28' },
        { code: 29, value: ' 29' },
        { code: 30, value: ' 30' },
        { code: 31, value: ' 31' },
    ];
    listDates_30 = [
        { code: '01', value: ' 01' },
        { code: '02', value: ' 02' },
        { code: '03', value: ' 03' },
        { code: '04', value: '  04' },
        { code: '05', value: '  05' },
        { code: '06', value: '  06' },
        { code: '07', value: ' 07' },
        { code: '08', value: ' 08' },
        { code: '09', value: ' 09' },
        { code: 10, value: ' 10' },
        { code: 11, value: ' 11' },
        { code: 12, value: ' 12' },
        { code: 13, value: ' 13' },
        { code: 14, value: ' 14' },
        { code: 15, value: ' 15' },
        { code: 16, value: ' 16' },
        { code: 17, value: ' 17' },
        { code: 18, value: ' 18' },
        { code: 19, value: ' 19' },
        { code: 20, value: ' 20' },
        { code: 21, value: ' 21' },
        { code: 22, value: ' 22' },
        { code: 23, value: ' 23' },
        { code: 24, value: ' 24' },
        { code: 25, value: ' 25' },
        { code: 26, value: ' 26' },
        { code: 27, value: ' 27' },
        { code: 28, value: ' 28' },
        { code: 29, value: ' 29' },
        { code: 30, value: ' 30' },
    ];
    listDates_28 = [
        { code: '01', value: ' 01' },
        { code: '02', value: ' 02' },
        { code: '03', value: ' 03' },
        { code: '04', value: '  04' },
        { code: '05', value: '  05' },
        { code: '06', value: '  06' },
        { code: '07', value: ' 07' },
        { code: '08', value: ' 08' },
        { code: '09', value: ' 09' },
        { code: 10, value: ' 10' },
        { code: 11, value: ' 11' },
        { code: 12, value: ' 12' },
        { code: 13, value: ' 13' },
        { code: 14, value: ' 14' },
        { code: 15, value: ' 15' },
        { code: 16, value: ' 16' },
        { code: 17, value: ' 17' },
        { code: 18, value: ' 18' },
        { code: 19, value: ' 19' },
        { code: 20, value: ' 20' },
        { code: 21, value: ' 21' },
        { code: 22, value: ' 22' },
        { code: 23, value: ' 23' },
        { code: 24, value: ' 24' },
        { code: 25, value: ' 25' },
        { code: 26, value: ' 26' },
        { code: 27, value: ' 27' },
        { code: 28, value: ' 28' },
    ];
    listMonth = [
        { code: '01', value: ' 01' },
        { code: '02', value: ' 02' },
        { code: '03', value: ' 03' },
        { code: '04', value: ' 04' },
        { code: '05', value: ' 05' },
        { code: '06', value: ' 06' },
        { code: '07', value: ' 07' },
        { code: '08', value: ' 08' },
        { code: '09', value: ' 09' },
        { code: 10, value: ' 10' },
        { code: 11, value: ' 11' },
        { code: 12, value: ' 12' },
    ];
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
            code: '1',
            name: 'Kích hoạt',
        },
        {
            name: 'Chưa kích hoạt',
            code: '0',
        },
    ];

    listNotifications: any = [...listNotify];

    isLoading: Boolean = false;

    _day: any = '';
    _time: any = '';
    _month: any = '';
    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            title: [
                '',
                Validators.compose([
                    Validators.required,
                    // this.helper.noWhitespaceValidator,
                ]),
            ],
            content: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            contentWOApp: [
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
            repeatDay: [''],
            repeatTime: [''],
            repeatMonth: [''],
            repeatDate: [''],
            repeatValue: ['', Validators.required],
            // repeatValue: [this.mRatesDateS_7],

            objectUserType: ['', Validators.compose([Validators.required])],
            status: ['', Validators.required],
            type: '1',

            createdAt: [this.mRatesDateS_7],
            endDate: [this.mRatesDateS],
            user_notifications: [],
        });
        this.ckConfig = { extraPlugins: 'easyimage, emojione' };
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
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
    }

    getWeekDay(date) {
        // Create an array containing each day, starting with Sunday.
        const weekdays = new Array(
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        );
        // Use the getDay() method to get the day.
        const day = new Date(date).getDay();
        // Return the element that corresponds to that index.
        return weekdays[day];
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            this.isLoading = false;
            return;
        } else {
            this.isLoading = true;
        }

        let sources = this.dataForm.value.content.match(
            /<img [^>]*src="[^"]*"[^>]*>/gm
        );
        if (sources) {
            sources = sources.map((x) => x.replace(/.*src="([^"]*)".*/, '$1'));
        } else {
            sources = [];
        }
        const promise = [];
        for (let i = 0; i < sources.length; i++) {
            promise.push(
                new Promise<void>((resolve, reject) => {
                    const src = sources[i];
                    this.ncbService
                        .uploadFileImgEditor(src)
                        .then((result) => {
                            if (result.status === 200) {
                                if (result.json().code !== '00') {
                                    reject(result.json().message);
                                } else {
                                    const rs = JSON.parse(result._body);
                                    this.dataForm.value.content = this.dataForm.value.content.replace(src, `${rs.body.linkUrl}" style='width:100%; border-radius:15px; -moz-border-radius: 15px; -webkit-border-radius: 15px'`);
                                    resolve();
                                }
                            } else {
                                reject(result.message);
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
            );
        }
        Promise.all(promise)
            .then((success) => {
                const payload = {
                    title: this.dataForm.value.title,
                    content: this.dataForm.value.content,
                    contentWOApp: this.dataForm.value.contentWOApp,
                    repeatType: this.dataForm.value.repeatType,
                    repeatDay: this.dataForm.value.repeatDay,
                    repeatTime: this.dataForm.value.repeatTime,
                    repeatMonth: this.dataForm.value.repeatMonth,
                    repeatDate: this.dataForm.value.repeatDate,
                    repeatValue: this.dataForm.value.repeatValue,
                    objectUserType: this.dataForm.value.objectUserType,
                    status: this.dataForm.value.status,
                    userNotifications: this.dataForm.value.user_notifications
                        ? this.dataForm.value.user_notifications
                        : this.filelist,
                    type: '1',
                };
                console.log('payload', payload);

                // định dạng theo tuần
                if (payload.repeatType === '2') {
                    payload.repeatValue = `${payload.repeatDay}T${payload.repeatTime}`;
                }
                // Định dạng theo tháng
                if (payload.repeatType === '3') {
                    payload.repeatValue = `${payload.repeatDate}T${payload.repeatTime}`;
                }

                // Định dạng theo Năm
                if (payload.repeatType === '4') {
                    payload.repeatValue = `${payload.repeatMonth}-${payload.repeatDate}T${payload.repeatTime}`;
                }

                // trả về link uploadimg ckeditor

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
                                this.toastr.error(
                                    'Dữ liệu đã tồn tại',
                                    'Thất bại!'
                                );
                            } else if (result.json().code === '1001') {
                                this.toastr.error(
                                    `Người dùng ${
                                        result.json().description
                                    } không tồn tại trong hệ thống`,
                                    'Thất bại!'
                                );
                            } else {
                                this.toastr.error(
                                    'Thêm mới thất bại',
                                    'Thất bại!'
                                );
                            }
                        }
                        this.isLoading = false;
                    })
                    .catch((err) => {
                        this.isLoading = false;
                        this.toastr.error(err.json().content, 'Thất bại!');
                    });
            })
            .catch((err) => console.log(err));
    }

    // upload image ckeditor
    toDataURL(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    // end

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
