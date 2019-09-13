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
  selectedFiles: FileList;
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  itemId: any = '';
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
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemId = parseInt(params.itemId);
    });
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      prdcode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      product: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])],
      status: '',
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
    console.log('-asdas', this.dataForm.value);
    const id = {
      id: this.itemId
    };
    const payload = {
      ...this.dataForm.value,
      ...this.objFile,
      ...id
    };
    console.log('payload===', payload);

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
    const check = await this.helper.validateFileImage(
      files[0], AppSettings.UPLOAD_IMAGE.file_size, AppSettings.UPLOAD_IMAGE.file_ext
    );
    if (check === true) {
        this.uploadFile(files.item(0));
    }
  }
  getItem(params) {
    this.ncbService.detailPayCard({prdcode: params}).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        prdcode : body.prdcode,
        product : body.product,
        activeFee : body.activeFee,
        cardtype : body.cardtype,
        changesttFee : body.changesttFee,
        class_ : body.class_,
        directddFee : body.directddFee,
        f01 : body.f01,
        f02 : body.f02,
        f03 : body.f03,
        f04 : body.f04,
        f05 : body.f05,
        fileName : body.fileName,
        issueFee : body.issueFee,
        linkUlr : body.linkUlr,
        reissueFee : body.reissueFee,
        repinFee : body.repinFee,
        status : body.status
      })
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
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
}


