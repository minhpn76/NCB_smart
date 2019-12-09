import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bank-tranfer-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Helper, NCBService]
})
export class CreateComponent implements OnInit {
  provinceForm: FormGroup;
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router

  ) { }

  ngOnInit() {
    this.provinceForm = this.formBuilder.group({
      bankCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      bankName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      shtname: [''],
      bin: [''],
      citad_gt: [''],
      citad_tt: ['']
    });
  }
  get Form() { return this.provinceForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.provinceForm.invalid) {
      return;
    }
    // const formData = this.helper.urlEncodeParams(this.provinceForm.value);
    this.ncbService.createBankTranfer(this.provinceForm.value).then((result) => {
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
}


