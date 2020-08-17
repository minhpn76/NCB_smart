import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Helper } from "../../../helper";
import { NCBService } from "../../../services/ncb.service";
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbTabChangeEvent,
} from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';
import { async } from '@angular/core/testing';

@Component({
  selector: "qr-coupons-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
  providers: [Helper, NCBService, ExcelService],
})
export class EditComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
  dataForm: FormGroup;
  submitted = false;
<<<<<<< HEAD
  qrCoupons: any;
  listStatus: any = [
    {
      name: 'Kích hoạt',
      code: 'A',
    },
    {
      name: 'Chưa kích hoạt',
=======
  itemId: any;
  private modalOp: NgbModalRef;

  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  arrayBuffer: any = []
  filelist: any = []

  temp: any = {
    loading: false,
  };
  listStatus: any = [
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
>>>>>>> adcbd3be4e8d4d8dd5239f90808f3e98ed23b860
      code: 'D',
    }
  ];
  listQrService: any = [];
  optionCurrency: any = {
    prefix: "",
    thousands: ".",
    decimal: ",",
    align: "left",
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router,
    private route: ActivatedRoute,
    private excelService: ExcelService,
  ) {
    this.getQrService();
    this.loadDate();
    this.route.params.subscribe(params => {
<<<<<<< HEAD
      this.qrCoupons = params.itemId;
=======
      this.itemId = params.itemId;
>>>>>>> adcbd3be4e8d4d8dd5239f90808f3e98ed23b860
    });
  }

  objectUserTypes = [
    {
      code: "",
      name: "---Vui lòng chọn đối tượng áp dụng---",
    },
    {
      name: "Tất cả",
      code: "1",
    },
    {
      name: "Giới hạn",
      code: "0",
    },
  ];

  discountTypes = [
    {
      code: "",
      name: "---Vui lòng chọn giảm giá theo---",
    },
    {
      name: "Phần trăm",
      code: "1",
    },
    {
      name: "Giá tiền",
      code: "0",
    },
  ];

  ngOnInit() {
    this.getItem(this.itemId)
    this.dataForm = this.formBuilder.group({
<<<<<<< HEAD
      name: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: ['']
    });
    this.getItem(this.qrCoupons);
=======
      name: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      description: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      code: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      objectUserType: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      discountType: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      serviceId: [
        "",
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
        "",
        Validators.compose([this.helper.noWhitespaceValidator]),
      ],
      totalNumberCoupon: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      numberPerCustomer: [
        "",
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      status: [
        "A",
        Validators.compose([this.helper.noWhitespaceValidator]),
      ],
      approveStatus: [
        "0",
        Validators.compose([this.helper.noWhitespaceValidator]),
      ],

      startDate: [this.mRatesDateS_7],
      endDate: [this.mRatesDateS],
      user_coupon: []
    });
>>>>>>> adcbd3be4e8d4d8dd5239f90808f3e98ed23b860
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
        code: "",
        name: "---Vui lòng chọn dịch vụ---",
      },
    ];
    // xu ly
    this.ncbService
      .getListQRServer({
        size: 1000,
        page: 0,
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
            code: "",
            name: "---Vui lòng chọn dịch vụ---",
          },
        ];
      });
  }
  onSubmit() {
    this.submitted = true;
    console.log('=this.dataForm', this.dataForm);
    console.log('=this.filelist', this.filelist);
    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
<<<<<<< HEAD
      ...this.dataForm.value
    };
    this.ncbService.updateQRCoupon(this.qrCoupons , payload).then(result => {
      if (result.json().status === 'D') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/qr-coupons');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
=======
      name: this.dataForm.value.name,
      description: this.dataForm.value.description,
      code: this.dataForm.value.code,
      objectUserType: this.dataForm.value.objectUserType,
      discountType: this.dataForm.value.discountType,
      serviceId: this.dataForm.value.serviceId,
      startDate: this.helper.tranferDate(this.dataForm.value.startDate),
      endDate: this.helper.tranferDate(this.dataForm.value.endDate),
      amount: this.dataForm.value.amount,
      paymentMin: this.dataForm.value.paymentMin,
      amountMax: this.dataForm.value.amountMax,
      amountPercentage: this.dataForm.value.amountPercentage,
      numberPerCustomer: this.dataForm.value.numberPerCustomer,
      totalNumberCoupon: this.dataForm.value.totalNumberCoupon,
      status: this.dataForm.value.status,
      approveStatus: this.dataForm.value.approveStatus,
      userCoupons: this.dataForm.value.user_coupon ? this.dataForm.value.user_coupon : this.filelist
    }
    this.ncbService
      .updateQRCoupon(this.itemId, payload)
      .then((result) => {
        if (result.status === 200) {
          if (result.json().code === "00") {
            this.toastr.success(
              "Thêm mới thành công",
              "Thành công!"
            );
            setTimeout(() => {
              this.router.navigateByUrl("/qr-coupons");
            }, 500);
          } else if (result.json().code === "909") {
            this.toastr.error("Dữ liệu đã tồn tại", "Thất bại!");
          } else {
            this.toastr.error("Thêm mới thất bại", "Thất bại!");
          }
        }
      })
      .catch((err) => {
        this.toastr.error(err.json().description, "Thất bại!");
      });
  }
  resetForm() {
    this.router.navigateByUrl("/qr-coupons");
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
      this.temp.loading = true
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.fileExcel.file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.filelist = arraylist
        this.dataForm.value.user_coupon = arraylist
>>>>>>> adcbd3be4e8d4d8dd5239f90808f3e98ed23b860
      }
      this.temp.loading = false
      this.closeModal()
    }
  }
  getItem(params) {
    this.ncbService.detailQRCoupon(params).then((result) => {
      const body = result.json().body;
      const temp_startDate_slipt = body.startDate !== null ? body.startDate.split('-') : null;
      const temp_startDate = {
        year: temp_startDate_slipt !== null ? parseInt(temp_startDate_slipt[0]) : (new Date().getFullYear()),
        month: temp_startDate_slipt !== null ? parseInt(temp_startDate_slipt[1]) : (new Date().getMonth()),
        day: temp_startDate_slipt !== null ? parseInt(temp_startDate_slipt[2]) : (new Date().getDate())
      };
      const temp_endDate_slipt = body.endDate !== null ? body.endDate.split('-') : null;

      const temp_endDate = {
        year: temp_endDate_slipt !== null ? parseInt(temp_endDate_slipt[0]) : (new Date().getFullYear()),
        month: temp_endDate_slipt !== null ? parseInt(temp_endDate_slipt[1]) : (new Date().getMonth()),
        day: temp_endDate_slipt !== null ? parseInt(temp_endDate_slipt[2]) : (new Date().getDate())
      };
      this.dataForm.patchValue({
        name: body.name,
        description: body.description,
<<<<<<< HEAD
        status: body.status
=======
        code: body.code,
        objectUserType: body.objectUserType,
        discountType: body.discountType,
        serviceId: body.serviceId,
        startDate: temp_startDate ? temp_startDate : '',
        endDate: temp_endDate ? temp_endDate : '',
        amount: + body.amount,
        paymentMin: +body.paymentMin,
        amountMax: + body.amountMax,
        amountPercentage: + body.amountPercentage,
        numberPerCustomer: +body.numberPerCustomer,
        totalNumberCoupon: + body.totalNumberCoupon,
        status: body.status,
        approveStatus: body.approveStatus,
        user_coupon: body.userCoupons
>>>>>>> adcbd3be4e8d4d8dd5239f90808f3e98ed23b860
      });
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
    });
  }
}
