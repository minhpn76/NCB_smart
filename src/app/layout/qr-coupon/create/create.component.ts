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
    selector: 'qr-coupons-create',
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
        name: ''
    };
    arrayBuffer: any = [];
    filelist: any = [];

    temp: any = {
        loading: false,
    };
    listQrService: any = [];
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
        private excelService: ExcelService,
    ) {
        this.getQrService();
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

    discountTypes = [
        {
            code: '',
            name: '---Vui lòng chọn giảm giá theo---',
        },
        {
            name: 'Phần trăm',
            code: '1',
        },
        {
            name: 'Giá tiền',
            code: '0',
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
            description: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            code: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            objectUserType: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            discountType: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            serviceId: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            amount: [
                0,
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],
            paymentMin: [
                0,
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],
            amountMax: [
                0,
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],
            amountPercentage: [
                '',
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],
            totalNumberCoupon: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            numberPerCustomer: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            status: [
                '',
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],
            approveStatus: [
                '0',
                Validators.compose([this.helper.noWhitespaceValidator]),
            ],

            startDate: [this.mRatesDateS_7],
            endDate: [this.mRatesDateS],
            user_coupon: []
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
        this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
        this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
      }

    getQrService() {
        this.listQrService = [
            {
                code: '',
                name: '---Vui lòng chọn dịch vụ---',
            },
        ];
        // xu ly
        this.ncbService
            .getListQRServer({
                size: 1000,
                page: 0,
                status: '1',
            })
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    body.content.map((item) => {
                        this.listQrService.push({
                            code: item.id,
                            name: item.title,
                        });
                    });
                }, 300);
            })
            .catch((err) => {
                this.listQrService = [
                    {
                        code: '',
                        name: '---Vui lòng chọn dịch vụ---',
                    },
                ];
            });
    }
    tranferDateMinus(params) {
        return params.year + '-' + params.month + '-' + params.day;
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        if (new Date(this.tranferDateMinus(this.dataForm.value.startDate)) > new Date(this.tranferDateMinus(this.dataForm.value.endDate))) {
            this.toastr.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'Thất bại!');
            return;
        }
        const payload = {
            name: this.dataForm.value.name,
            description: this.dataForm.value.description,
            code: this.dataForm.value.code,
            objectUserType: this.dataForm.value.objectUserType,
            discountType: this.dataForm.value.discountType,
            serviceId: this.dataForm.value.serviceId,
            startDate: this.helper.tranferDate(this.dataForm.value.startDate),
            endDate: this.helper.tranferDate(this.dataForm.value.endDate),
            amount: +this.dataForm.value.amount,
            paymentMin: +this.dataForm.value.paymentMin,
            amountMax: +this.dataForm.value.amountMax,
            amountPercentage: +this.dataForm.value.amountPercentage,
            numberPerCustomer: +this.dataForm.value.numberPerCustomer,
            totalNumberCoupon: +this.dataForm.value.totalNumberCoupon,
            status: this.dataForm.value.status,
            approveStatus: this.dataForm.value.approveStatus,
            userCoupons: this.dataForm.value.user_coupon ? this.dataForm.value.user_coupon : this.filelist
        };
        this.ncbService
            .createQRCoupon(payload)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Thêm mới thành công',
                            'Thành công!'
                        );
                        setTimeout(() => {
                            this.router.navigateByUrl('/qr-coupons');
                        }, 500);
                    } else if (result.json().code === '909') {
                        this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                    } else {
                        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                    }
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().description, 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/qr-coupons');
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
                for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
                const bstr = arr.join('');
                const workbook = XLSX.read(bstr, {type: 'binary'});
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[first_sheet_name];
                console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
                const arraylist = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                this.filelist = arraylist;
                this.dataForm.value.user_coupon = arraylist;
            };
            this.temp.loading = false;
            this.closeModal();
        }
      }
}
