import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';

@Component({
  selector: 'banner-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
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
      name: 'Inactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService
  ) {
      this.route.params.subscribe(params => {
        this.itemId = parseInt(params.itemId);
    });
   }

  ngOnInit() {
    this.getItem({id: this.itemId});
  }
  onSubmit() {
    this.submitted = true;
    if (this.obj.bannerCode === ''
      || this.obj.bannerName === ''
      || this.obj.linkImg === ''
    ) {
      this.toastr.error('Không được để trống các trường', 'Lỗi!');
      return;
    }
    const id = {
      id: this.itemId
    };
    const data = {
      ...this.obj,
      ...id
    };
    this.ncbService.updateNcbBanner(data).then((result) => {
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
  resetForm() {
    this.router.navigateByUrl('/banner');
  }
  getItem(params) {
    this.ncbService.detailNcbBannner(params).then((result) => {
      const body = result.json().body;
      this.obj.status = body.status;
      this.obj.bannerCode = body.bannerCode;
      this.obj.bannerName = body.bannerName;
      this.obj.linkImg = body.linkImg;
      this.obj.linkUrlEn = body.linkUrlEn;
      this.obj.linkUrlVn = body.linkUrlVn;
    }).catch(err => {

    });
  }
}



