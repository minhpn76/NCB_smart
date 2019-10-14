import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pay-card-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [Helper, NCBService]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  objUpload: any = {};
  private modalOp: NgbModalRef;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  optionCurrency: any = { prefix: '', thousands: '.', decimal: ',', align: 'left' };
  selectedFiles: FileList;
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  itemId: any = '';
  temp: any = {
    loading: false
  };
  isEdit = true;
  editData: any = {};
  objItemFile: any = {};
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ncbService: NCBService,
    private helper: Helper,
    public router: Router,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.itemId = params.itemId;
    });
   }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      prdcode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      product: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: '',
      activeFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      cardtype: ['', Validators.compose([Validators.required, Validators.maxLength(2), this.helper.noWhitespaceValidator])],
      changesttFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      class_: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      directddFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      f01: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      f02: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      f03: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      f04: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      f05: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      issueFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      reissueFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      repinFee: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      fileName: [''],
      linkUrl: ['']
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
      prdcode: this.dataForm.value.prdcode,
      product: this.dataForm.value.product,
      status: this.dataForm.value.status,
      activeFee: this.dataForm.value.activeFee,
      cardtype: this.dataForm.value.cardtype,
      changesttFee: this.dataForm.value.changesttFee,
      class_: this.dataForm.value.class_,
      directddFee: this.dataForm.value.directddFee,
      f01: this.dataForm.value.f01,
      f02: this.dataForm.value.f02,
      f03: this.dataForm.value.f03,
      f04: this.dataForm.value.f04,
      f05: this.dataForm.value.f05,
      issueFee: this.dataForm.value.issueFee,
      reissueFee: this.dataForm.value.reissueFee,
      repinFee: this.dataForm.value.repinFee,
      fileName: this.dataForm.value.fileName,
      linkUrl: this.dataForm.value.linkUrl
    };
    // if (this.isEdit === true) {
    //   this.editData = {
    //     ...this.dataForm.value,
    //     ...this.objItemFile
    //   };
    // } else {
    //   this.editData = {
    //     ...this.dataForm.value,
    //     ...this.objFile
    //   };
    // }
    this.ncbService.editPayCard(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error('Lỗi hệ thống', 'Thất bại!');
        } else if (result.json().code === '901') {
          this.toastr.error('Hình ảnh phôi thẻ đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
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
    this.isEdit = false;
    const check = await this.helper.validateFileImage(
      files[0], AppSettings.UPLOAD_IMAGE.file_size, AppSettings.UPLOAD_IMAGE.file_ext
    );
    if (check === true) {
      this.deleteFile(this.dataForm.value.fileName, files.item(0));
    }
  }
  getItem(params) {
    this.ncbService.detailPayCard({ prdcode: params }).then((result) => {
      const body = result.json().body;
      // this.objItemFile = {
      //   fileName: body.fileName,
      //   linkUrl: body.linkUrl
      // };
      this.dataForm.patchValue({
        prdcode: body.prdcode !== null ? body.prdcode : '',
        product: body.product !== null ? body.product : '',
        activeFee: body.activeFee !== null ? body.activeFee : '',
        cardtype: body.cardtype !== null ? body.cardtype : '',
        changesttFee: body.changesttFee !== null ? body.changesttFee : '',
        class_: body.class_ !== null ? body.class_ : '',
        directddFee: body.directddFee !== null ? body.directddFee : '',
        f01: body.f01 !== null ? body.f01 : '',
        f02: body.f02 !== null ? body.f02 : '',
        f03: body.f03 !== null ? body.f03 : '',
        f04: body.f04 !== null ? body.f04 : '',
        f05: body.f05 !== null ? body.f05 : '',
        issueFee: body.issueFee !== null ? body.issueFee : '',
        reissueFee: body.reissueFee !== null ? body.reissueFee : '',
        repinFee: body.repinFee !== null ? body.repinFee : '',
        status: body.status !== null ? body.status : '',
        fileName: body.fileName !== null ? body.fileName : '',
        linkUrl: body.linkUrl !== null ? body.linkUrl : ''
      });
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu item', 'Thất bại!');
    });
  }
  deleteFile(value, file) {
    this.ncbService.deleteFilePayCard({
      fileName: value
    }).then(result => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.isLockSave = true;
          this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
        } else {
          this.uploadFile(file);
          this.isLockSave = false;
        }
      } else {
        this.isLockSave = true;
        this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.isLockSave = true;
      this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
    });
  }
  uploadFile(value) {
    this.objUpload = {};
    this.ncbService.uploadFilePayCard(value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.isLockSave = true;
          this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
        } else {
          const body = result.json().body;
          this.dataForm.patchValue({
            fileName: body.fileName,
            linkUrl: body.linkUrl,
          });
          this.isLockSave = false;
          this.toastr.success('Upload ảnh thành công', 'Thành công!');
        }
      } else {
        this.isLockSave = true;
        this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
      }

    }).catch((err) => {
      this.isLockSave = true;
      this.toastr.error('Upload ảnh thất bại', 'Thất bại!');

    });
  }
}


