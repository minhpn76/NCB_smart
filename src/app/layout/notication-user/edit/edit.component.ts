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
    // public Editor = ClassicEditor;
    public Editor = DecoupledEditor;
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    dataForm: FormGroup;
    submitted = false;
    itemId: any;
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
            code: 'A',
        },
        {
            name: 'Chưa kích hoạt',
            code: 'D',
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

    ngOnInit() {
        // Hiển thị
        this.route.params.subscribe((params) => {
            this.itemId = params.itemId;
        });
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

            objectUserType: ['', Validators.compose([Validators.required])],
            status: [''],

            // createdAt: [this.mRatesDateS_7],
            // endDate: [this.mRatesDateS],
            user_notifications: [],
        });

        this.getItem(this.itemId);
    }

    get Form() {
        return this.dataForm.controls;
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

    // truyền đi các thông tin trong danh sách
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
        };
        this.ncbService
            .updateNoticationUser(this.itemId, payload)
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
                this.toastr.error(err.json().body, 'Thất bại!');
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
                    repeatValue: Helper.formatDateTimeEdit(body.repeatValue, body.repeatType),
                    objectUserType: body.objectUserType,
                    user_notifications: body.userNotifications,
                    status: body.status,
                });
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
