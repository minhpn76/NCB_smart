import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';
import { async } from '@angular/core/testing';
import { listNotify } from '../code';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'notifications-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    providers: [Helper, NCBService, ExcelService],
})
export class EditComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalNotitfications: NgbModal,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router,
        private route: ActivatedRoute,
        private excelService: ExcelService
    ) {
        this.loadDate();
    }

    get Form() {
        return this.dataForm.controls;
    }
    // public Editor = ClassicEditor;
    // public Editor = DecoupledEditor;
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    dataForm: FormGroup;
    submitted = false;
    itemId: any;
    ckConfig: any = {};
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
    listStatus: any = [
        {
            name: 'Kích hoạt',
            code: '1',
        },
        {
            name: 'Chưa kích hoạt',
            code: '0',
        },
    ];
    listRepeatType: any = [...listNotify];

    objectUserTypes: any = [
        {
            name: '---Vui lòng chọn đối tượng---',
            code: '',
        },
        {
            name: 'Tất cả người dùng',
            code: '0',
        },
        {
            name: 'Giới hạn',
            code: '1',
        },
    ];
    listDay = [
        { code: 2, value: ' Thứ 2' },
        { code: 3, value: ' Thứ 3' },
        { code: 4, value: ' Thứ 4' },
        { code: 5, value: ' Thứ 5' },
        { code: 6, value: ' Thứ 6' },
        { code: 7, value: ' Thứ 7' },
        { code: 8, value: ' Chủ nhật' },
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

    _date: any = '';
    isLoading: Boolean = false;

    CanlendarDate = '04/08/2015';

    public onReady(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadAdapter(loader);
        };
        editor.ui.view.editable.element.parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.view.editable.element
        );
    }

    ngOnInit() {
        // Hiển thị
        this.route.params.subscribe((params) => {
            this.itemId = params.itemId;
        });
        this.dataForm = this.formBuilder.group({
            title: [
                '',
                // Validators.compose([
                //     Validators.required,
                //     this.helper.noWhitespaceValidator,
                // ]),
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
            // repeatValue: ['', Validators.compose([Validators.required])],
            repeatDay: [''],
            repeatTime: [''],
            repeatMonth: [''],
            repeatDate: [''],
            repeatValue: [''],
            objectUserType: ['', Validators.compose([Validators.required])],
            status: [''],

            // createdAt: [this.mRatesDateS_7],
            // endDate: [this.mRatesDateS],
            user_notifications: [],
        });

        this.getItem(this.itemId);
        this.ckConfig = { extraPlugins: 'easyimage, emojione' };
    }
    // modal Danh sách hiện có
    openModal(content) {
        this.modalOp = this.modalNotitfications.open(content);
    }

    // khai báo định dạng ngày tháng
    public loadDate(): void {
        this.mRatesDateS = {
            year: this.my.getFullYear(),
            month: this.my.getMonth(),
            day: this.my.getDate(),
        };
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
    // truyền đi các thông tin trong danh sách
    onSubmit() {
        if (this.isLoading) {
            return;
        }

        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            this.isLoading = false;
            return;
        }
        this.isLoading = true;

        // lay link blob
        let sources = this.dataForm.value.content.match(
            /<img [^>]*src="blob:[^"]*"[^>]*>/gm
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
                        console.log('sources', sources);

                })
            );
        }
        Promise.all(promise)
            .then((success) => {
                const payload = {
                    title: this.dataForm.value.title,
                    content: this.dataForm.value.content,
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
                };
                console.log('payload', payload.content);

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

                this.ncbService
                    .updateNoticationUser(this.itemId, payload)
                    .then((result) => {
                        if (result.status === 200) {
                            if (result.json().code === '00') {
                                this.toastr.success(
                                    'Cập nhật thành công',
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
                            } else {
                                this.toastr.error(
                                    'Thêm mới thất bại',
                                    'Thất bại!'
                                );
                            }
                        }
                    })
                    .catch((err) => {
                        this.toastr.error(err.json().body, 'Thất bại!');
                    });
            })
            .catch((err) => console.log(err));
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
                const arraylist = XLSX.utils.sheet_to_json(worksheet, {
                    raw: true,
                });
                this.filelist = arraylist;
                this.dataForm.value.user_coupon = arraylist;
            };
            this.temp.loading = false;
            this.closeModal();
        }
    }
    getItem(params) {
        this.ncbService
            .detailNoticationUser(params)
            .then((result) => {
                const body = result.json().body;
                this.dataForm.patchValue({
                    title: body.title,
                    content: body.content,
                    repeatType: body.repeatType,
                    repeatValue: Helper.formatDateTimeEdit(
                        body.repeatValue,
                        body.repeatType
                    ),
                    repeatTime: Helper.formatTimeEdit(
                        body.repeatValue,
                        body.repeatType
                    ),
                    repeatDay: Helper.formatDayEdit(
                        body.repeatValue,
                        body.repeatType
                    ),
                    repeatDate: Helper.formatDateEdit(
                        body.repeatValue,
                        body.repeatType
                    ),
                    repeatMonth: Helper.formatMonthEdit(
                        body.repeatValue,
                        body.repeatType
                    ),
                    objectUserType: body.objectUserType,
                    user_notifications: body.userNotifications,
                    status: body.status,
                });
                console.log('body', body.repeatValue);
            })
            .catch((err) => {
                this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
            });
    }
}

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
