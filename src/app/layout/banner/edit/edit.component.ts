import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { AppSettings } from '../../../app.settings';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'banner-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  mRatesDateS: NgbDateStruct;
  mRatesDateS_7: NgbDateStruct;
  my: any = new Date();
  my_7: any = new Date();
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
  listShow: any = [
    {
      code: 'Y',
      name: 'Khách hàng bật app lên là thấy POPUP'
    },
    {
      code: 'N',
      name: 'Khách hàng nhìn thấy POPUP sẽ không hiển thị lại nữa'
    }
  ];
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
      bannerCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      bannerName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      linkImg: [''],
      // linkUrlVn: [''],
      linkUrlEn: [''],
      scheduleStart: [this.mRatesDateS],
      scheduleEnd: [this.mRatesDateS_7],
      oneTimeShow: ['Y'],
      actionScreen: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
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
      // linkUrlVn: this.dataForm.value.linkUrlVn,
      scheduleStart: this.helper.tranferDate(this.dataForm.value.scheduleStart),
      scheduleEnd: this.helper.tranferDate(this.dataForm.value.scheduleEnd),
      linkUrlEn: this.dataForm.value.linkUrlEn,
      oneTimeShow: this.dataForm.value.oneTimeShow,
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
        // linkUrlVn: body.linkUrlVn,
        linkUrlEn: body.linkUrlEn
      };
      const stringSplit = body.linkImg.split('/');
      const temp_fromDate_slipt = body.scheduleStart.split('/');
      const temp_fromDate = {
        year: parseInt(temp_fromDate_slipt[0]),
        month: parseInt(temp_fromDate_slipt[1]),
        day: parseInt(temp_fromDate_slipt[2])
      };

      const temp_toDate_slipt = body.scheduleEnd.split('/');
      const temp_toDate = {
        year: parseInt(temp_toDate_slipt[0]),
        month: parseInt(temp_toDate_slipt[1]),
        day: parseInt(temp_toDate_slipt[2])
      };

      this.dataForm.patchValue({
        bannerCode: body.bannerCode,
        actionScreen: body.actionScreen,
        bannerName: body.bannerName,
        status: body.status,
        linkImg: body.linkImg,
        scheduleStart: temp_fromDate !== null ? temp_fromDate : '',
        scheduleEnd: temp_toDate !== null ? temp_fromDate : '',
        oneTimeShow: body.oneTimeShow,

        // linkUrlVn: body.linkUrlVn,
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



