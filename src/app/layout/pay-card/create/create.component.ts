import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pay-card-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Helper, NCBService]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  objUpload: any = {};
  private modalOp: NgbModalRef;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  selectedFiles: FileList;
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  temp: any = {
    loading: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      prdcode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      product: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: 'A',
      activeFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      cardtype: ['', Validators.compose([Validators.required, Validators.maxLength(2), Validators.pattern(/^((?!\s{2,}).)*$/)])],
      changesttFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      class_: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      directddFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      f01: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      f02: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      f03: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      f04: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      f05: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      issueFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      reissueFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      repinFee: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])]
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }

    const payload = {
      ...this.dataForm.value,
      ...this.objFile
    };

    this.ncbService.createPayCard(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else if (result.json().code === '901') {
          this.toastr.error('Hình ảnh phôi thẻ đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/pay-card');
          }, 500);
        }
      } else {
        this.toastr.error(result.json().description, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().description, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/pay-card');
  }
  openModal(content, classLayout = '', type = '') {
    if (type === 'static') {
      this.modalOp = this.modalService.open(content, { keyboard: false, backdrop: 'static', windowClass: classLayout, size: 'lg' });
    } else {
        this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'lg' });
    }
    this.modalOp.result.then((result) => {
    }, (reason) => {
    });
  }

  async handleFileInput(files: FileList): Promise<any> {
    const check = await this.helper.validateFileImage(
      files[0], AppSettings.UPLOAD_IMAGE.file_size, AppSettings.UPLOAD_IMAGE.file_ext
    );
    if (check === true) {
        this.uploadFile(files.item(0));
    }
  }
  uploadFile(value) {
    this.objUpload = {};
    this.ncbService.uploadFilePayCard(value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.isLockSave = true;
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.objFile = result.json().body;
          this.isLockSave = false;
          this.toastr.success('Upload ảnh thành công', 'Thành công!');
        }
      } else {
        this.isLockSave = true;
        this.toastr.error(result.message, 'Thất bại!');
      }

    }).catch((err) => {
      this.isLockSave = true;
      this.toastr.error(err.json().message, 'Thất bại!');

    });
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


