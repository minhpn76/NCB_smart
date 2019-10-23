import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'image-paycard-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  objUpload: any = {};
  public Editor = ClassicEditor;
  selectedFiles: FileList;
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  tempUrl: any = '';
  tempNameImg: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper,
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      linkUrl: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      nameImage: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      linkUrlVn: [''],
      linkUrlEn: [''],
      status: 'A'
    });
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.createNcbBanner(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else if (result.json().code === '910') {
          this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/banner');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/banner');
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
    this.ncbService.uploadFileBanner(value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.isLockSave = true;
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.objFile = result.json().body;
          this.dataForm.patchValue({
            linkImg: this.objFile.linkUrl,
            linkUrlVn: this.objFile.linkUrl,
            linkUrlEn: this.objFile.linkUrl,
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


