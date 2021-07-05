import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bank-tranfer-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Helper, NCBService]
})
export class CreateComponent implements OnInit {
  bankForm: FormGroup;
  submitted = false;
  private modalOp: NgbModalRef;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  temp: any = {
    loading: false
  };
  objUpload: any = {};
  selectedFiles: FileList;
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  tempUrl: any = '';
  tempNameImg: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router

  ) { }

  ngOnInit() {
    this.bankForm = this.formBuilder.group({
      bankCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      bankName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      shtname: [''],
      bin: [''],
      citad_gt: [''],
      citad_tt: [''],
      url_img: ['']
    });
  }
  get Form() { return this.bankForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.bankForm.invalid) {
      return;
    }
    // const formData = this.helper.urlEncodeParams(this.provinceForm.value);
    this.ncbService.createBankTranfer(this.bankForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '00') {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/bank-tranfer');
          }, 500);
        } else if (result.json().code === '904') {
          this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.error('Thêm mới thất bại', 'Thất bại!');
        }
      } else {
        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
      }
    }).catch((err) => {

      this.toastr.error(err.json().description, 'Thất bại!');

    });
  }
  resetForm() {
    this.router.navigateByUrl('/bank-tranfer');
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
    // console.log('up to server');
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

  async handleFileInput(files: FileList, eventTemp): Promise<any> {
    const check = await this.helper.validateFileImage(
      files[0], AppSettings.UPLOAD_IMAGE.file_size, AppSettings.UPLOAD_IMAGE.file_ext
    );
    if (eventTemp.target.files && eventTemp.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // read file as data url
      this.tempNameImg = files[0].name;
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.tempUrl = (<FileReader>event.target).result;
      };
    }

    if (check === true) {
        this.uploadFile(files.item(0));
    }
  }
  uploadFile(value) {
    this.objUpload = {};
    this.ncbService.uploadFileLogoBank(value).then((result) => {
      if (result.status === 200) {
        if (result.json().code === '902') {
          this.isLockSave = true;
          this.toastr.error(result.json().description, 'Thất bại!');
        } else {
          this.objFile = result.json().body;
          this.bankForm.patchValue({
            url_img: this.objFile.linkUrl,
          });
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
}


