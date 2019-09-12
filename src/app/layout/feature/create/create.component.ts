import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'feature-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  branchForm: FormGroup;
  private modalOp: NgbModalRef;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  temp: any = {
    loading: false
  };
  submitted = false;
  listProvice: any = [
    {
      name: 'Tất cả',
      code: 0,
    },
    {
      name: 'Hà Nội',
      code: 1,
    }
  ];
  listDistrict: any = [
    {
      name: 'Vui lòng chọn quận huyện',
      code: 0,
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.branchForm = this.formBuilder.group({
      branchCode: ['', Validators.required],
      branchName: ['', Validators.required],
      optionProvince: ['', Validators.required],
      optionDistrict: ['', Validators.required],
      addressName: ['', Validators.required],

    });
  }
  get Form() { return this.branchForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.branchForm.invalid) {
        return;
    }
    this.toastr.success('Thêm mới thành công', 'Thành công!');
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.branchForm.value));
  }
  resetForm() {
    this.branchForm.reset();
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


