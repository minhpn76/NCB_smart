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
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';
import { async } from '@angular/core/testing';

@Component({
    selector: 'notifications-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
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

    objectUserTypes = [
        {
            code: '',
            name: '---Vui lòng chọn đối tượng áp dụng---',
        },
        {
            name: 'Tất cả',
            code: '1',
        },
        {
            name: 'Giới hạn',
            code: '0',
        },
    ];

    listStatus = [
        {
            code: 'A',
            name: 'active',
        },
        {
            name: 'Deactive',
            code: 'D',
        },
    ];

    listNotifications: any = [
        {
            code: '',
            name: '---Vui lòng chọn cách thức lặp---',
        },
        {
            code: '0',
            name: 'Chỉ gửi 1 lần',
        },
        {
            code: '1',
            name: 'Lặp lại hằng ngày',
        },
        {
            code: '2',
            name: 'Lặp lại hàng tuần',
        },
        {
            code: '3',
            name: ' Lặp lại hàng tháng',
        },
        {
            code: '4',
            name: 'Lặp lại hàng năm',
        },
    ];

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            name: [
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
            repeatValue: [this.mRatesDateS_7],

            objectUserType: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            status: [
                'A',
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],

            // createdAt: [this.mRatesDateS_7],
            // endDate: [this.mRatesDateS],
            user_notifications: [],
        });
    }
    get Form() {
        return this.dataForm.controls;
    }
    openModal(content) {
        this.modalOp = this.modalService.open(content);
    }

    public loadDate(): void {
        this.my_7.setDate(this.my_7.getDate() + 7);
        this.mRatesDateS = {
            year: this.my_7.getFullYear(),
            month: this.my_7.getMonth() + 1,
            day: this.my_7.getDate(),
        };
        this.mRatesDateS_7 = {
            year: this.my.getFullYear(),
            month: this.my.getMonth() + 1,
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
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            console.log('demo', this.dataForm);
            return;
        }
        const payload = {
            name: this.dataForm.value.name,
            content: this.dataForm.value.content,
            repeatType: this.dataForm.value.repeatType,
            repeatValue: this.dataForm.value.repeatValue,
            objectUserType: this.dataForm.value.objectUserType,
            status: this.dataForm.value.status,
            userNotifications: this.dataForm.value.user_notifications
                ? this.dataForm.value.user_notifications
                : this.filelist,
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
