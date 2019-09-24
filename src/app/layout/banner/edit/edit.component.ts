import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { AppSettings } from '../../../app.settings';
import { Helper } from '../../../helper';

@Component({
  selector: 'banner-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
  objItemFile: any = {};
  objUpload: any = {};
  objFile: any = {};
  fileName: File;
  isLockSave = false;
  isEdit = true;
  editData: any = {};
  obj: any = {
    status: '',
    bannerCode: '',
    bannerName: '',
    linkImg: '',
    linkUrlVn: '',
    linkUrlEn: ''
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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService,
    private helper: Helper
  ) {
      this.route.params.subscribe(params => {
        this.itemId = params.itemId;
    });
  }

  ngOnInit() {
    this.getItem(this.itemId);
    this.dataForm = this.formBuilder.group({
      bannerCode: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      bannerName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
      linkImg: [''],
      linkUrlVn: [''],
      linkUrlEn: [''],
      fileName: [''],
      actionScreen: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern(/^((?!\s{1,}).)*$/)])],
      status: 'A'
    });
  }

  get Form() { return this.dataForm.controls; }

  async handleFileInput(files: FileList): Promise<any> {
    this.isEdit = false;
    const check = await this.helper.validateFileImage(
      files[0], AppSettings.UPLOAD_IMAGE.file_size, AppSettings.UPLOAD_IMAGE.file_ext
    );
    if (check === true) {
      this.deleteFile(this.dataForm.value.fileName, files.item(0));
    }
  }
  deleteFile(value, file) {
    this.ncbService.deleteFileBanner({
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
    this.ncbService.uploadFileBanner(value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.isLockSave = true;
          this.toastr.error('Upload ảnh thất bại', 'Thất bại!');
        } else {
          const body = result.json().body;
          this.dataForm.patchValue({
            linkImg: body.linkUrl,
            linkUrlVn: body.linkUrl,
            linkUrlEn: body.linkUrl,
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
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const id = {
      id: this.itemId
    };

    const payload = {
      bannerCode: this.dataForm.value.bannerCode,
      bannerName: this.dataForm.value.bannerName,
      linkImg: this.dataForm.value.linkImg,
      linkUrlVn: this.dataForm.value.linkUrlVn,
      linkUrlEn: this.dataForm.value.linkUrlEn,
      status: this.dataForm.value.status,
      actionScreen: this.dataForm.value.actionScreen
    };
    this.editData = {
      ...id,
      ...payload
    };
    this.ncbService.updateNcbBanner(this.editData).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/banner');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.message, 'Thất bại!');

    });
  }
  getItem(params) {
    this.ncbService.detailNcbBannner({ id: params }).then((result) => {
      const body = result.json().body;
      this.objItemFile = {
        linkImg: body.linkImg,
        linkUrlVn: body.linkUrlVn,
        linkUrlEn: body.linkUrlEn
      };
      const stringSplit = body.linkImg.split('/');

      this.dataForm.patchValue({
        bannerCode: body.bannerCode,
        actionScreen: body.actionScreen,
        bannerName: body.bannerName,
        status: body.status,
        linkImg: body.linkImg,
        linkUrlVn: body.linkUrlVn,
        linkUrlEn: body.linkUrlEn,
        fileName: stringSplit.slice(-1)[0]
      });
    }).catch(err => {
      this.toastr.error('Không lấy được dữ liệu item', 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/banner');
  }
}



