import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
@Component({
  selector: 'bank-tranfer-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  code: any;
  listStatus: any = [
    {
      name: 'Tất cả',
      code: '',
    },
    {
      name: 'Chờ duyệt',
      code: 'W',
    },
    {
      name: 'Hoạt động, đã duyệt',
      code: 'A',
    },
    {
      name: 'Xóa, hủy duyệt',
      code: 'D',
    }
  ];
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
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      bankCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      bankName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      shtname: [''],
      bin: [''],
      citad_gt: [''],
      citad_tt: [''],
      status: [''],
      url_img: ''
    });
    this.getItem(this.code);
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.updateBankTranfer(this.dataForm.value).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
          this.router.navigateByUrl('/bank-tranfer');
        }, 500);
      } else {
        this.toastr.error('Sửa thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailBankTranfer({ bankCode: params }).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        bankCode: body.bankCode,
        bankName: body.bankName,
        shtname: body.shtname,
        bin: body.bin,
        citad_gt: body.citad_gt,
        citad_tt: body.citad_tt,
        status: body.status,
        url_img: body.url_img
      });
      this.tempUrl = body.url_img;
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
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
          console.log('==this.objFile', this.objFile);
          this.dataForm.patchValue({
            url_img: this.objFile.linkUrl,
          });
          this.isLockSave = false;
          this.toastr.success('Upload ảnh thành công', 'Thành công!');
        }
      } else {
        this.isLockSave = true;
        this.toastr.error(result.description, 'Thất bại!');
      }

    }).catch((err) => {
      this.isLockSave = true;
      this.toastr.error(err.json().message, 'Thất bại!');

    });
  }


  resetForm() {
    this.router.navigateByUrl('/bank-tranfer');
  }
}



