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
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'qr-merchants-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [Helper, NCBService, ExcelService],
})
export class EditComponent implements OnInit {
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
    name: ''
  };
  arrayBuffer: any = [];
  filelist: any = [];

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
      code: 'D',
    }
  ];
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
    private route: ActivatedRoute,
    private excelService: ExcelService,
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
  }



  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],
      address: [
        '',
        Validators.compose([
          Validators.required,
          this.helper.noWhitespaceValidator,
        ]),
      ],

    });
  }
  get Form() {
    return this.dataForm.controls;
  }
  openModal(content) {
    this.modalOp = this.modalService.open(content);
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      name: this.dataForm.value.name,
      address: this.dataForm.value.address,
    };
    this.ncbService
      .updateQRMerchant(this.itemId, payload)
      .then((result) => {
        if (result.status === 200) {
          if (result.json().code === '00') {
            this.toastr.success(
              'Sửa thành công',
              'Thành công!'
            );
            setTimeout(() => {
              this.router.navigateByUrl('/qr-merchants');
            }, 500);
          } else if (result.json().code === '909') {
            this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
          } else {
            this.toastr.error('Sửa thất bại', 'Thất bại!');
          }
        }
      })
      .catch((err) => {
        this.toastr.error(err.json().description, 'Thất bại!');
      });
  }
  resetForm() {
    this.router.navigateByUrl('/qr-merchants');
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
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        const arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.filelist = arraylist;
        this.dataForm.value.user_coupon = arraylist;
      };
      this.temp.loading = false;
      this.closeModal();
    }
  }
  getItem(params) {
    this.ncbService.detailQRMerchant(params).then((result) => {
      const body = result.json().body;

      this.dataForm.patchValue({
        name: body.name,
        address: body.address,
      });
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
    });
  }
}
