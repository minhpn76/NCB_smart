import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'role-decen',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  listPGD: any = [];
  listBranch: any = [];
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  re_search: any = {
    roleName: '',
    status: 'A',
    page: 1,
    size: 1000
  };
  roleName: any;
  status: any;
  briefDescription: any;
  isArrayRole = false;
  listRoles: any;
  tempRole: any;
  obj: any = {};
  role: any = {
    create: null,
    delete: null,
    read: null,
    update: null,
  };

  listStatus: any = [
    {
      name: 'Tất cả',
      code: '',
    },
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];
  itemId: any;
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
    this.getItemRole();
    if (localStorage.getItem('redirect') === 'true') {
      this.router.navigateByUrl('/decen');
    }
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      roleName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: [''],
      briefDescription: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: 'A'
    });
  }
  get Form() { return this.dataForm.controls; }
  pageRefresh() {
    location.reload();
    localStorage.setItem('redirect', 'true');
  }

  getItemRole() {
    this.totalSearch = 0;
    this.isProcessLoad = 1;
    this.ncbService.detailRoles(this.itemId).then((result) => {
      setTimeout(() => {
        this.isProcessLoad = 0;
        const body = result.json().body;
        if (body.length === 0) {
          this.isProcessLoad = 1;
          this.totalSearch = 0;
          setTimeout(() => {
            this.isProcessLoad = 0;
          }, 1000);
          return;
        }
        this.obj = body;
        this.roleName = this.obj.roleName;
        this.status = this.obj.status;
        this.briefDescription = this.obj.briefDescription;
        if (this.obj.description.indexOf('[') > -1) {
          if (this.obj.description.indexOf('CRONJOB') > -1) {
            this.listRoles = JSON.parse(this.obj.description) ? JSON.parse(this.obj.description) : '';
          } else {
            const array_temp = JSON.parse(this.obj.description);
            array_temp.push({
              code: 'CRONJOB',
              name: 'Cấu hình Schedule',
              isAll: false,
              isC: false,
              isR: false,
              isU: false,
              isD: false,
              menu: 'THAM_SO'
            });
            this.listRoles = array_temp ? array_temp : '';
          }
        } else {
          this.listRoles = AppSettings.listRoles;
        }
        this.totalSearch = Object.keys(result.json().body).length;
        }, 3000);
    }).catch((err) => {
      this.isProcessLoad = 1;
      this.totalSearch = 0;
      setTimeout(() => {
        this.isProcessLoad = 0;
        this.toastr.error(`Có lỗi xảy ra`, 'Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ!');
      }, 500);
    });
  }
  updateRole(obj): Promise < any > {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.updateRoles(obj).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error(result.json().message, 'Thất bại!');
            resolve();
          } else {
            this.obj.description = JSON.stringify(this.listRoles);
            this.toastr.success('Cập nhật thành công', 'Thành công!');
            this.pageRefresh();
            resolve();
          }
        } else {
          this.toastr.error(result.message, 'Thất bại!');
          resolve();
        }
      }).catch((err) => {
        this.toastr.error(err.message, 'Thất bại!');
        resolve();
      });
    });
    return promise;
  }
  clickFullRoles(event) {
    this.listRoles.forEach(role => {
      if (role.code === event.target.id) {
        if (event.currentTarget.checked === true) {
          role.isC = true;
          role.isU = true;
          role.isD = true;
          role.isR = true;
          role.isAll = true;
        } else {
          role.isC = false;
          role.isU = false;
          role.isD = false;
          role.isR = false;
          role.isAll = false;
        }
      }
    });
  }
  clickSetRole(event, value) {
    const passCode = event.target.id;
    this.tempRole = {};
    switch (value) {
      case 1:
          const splited_add = passCode.split('add_')[1];
          this.listRoles.forEach(role => {
            if (role.code === splited_add) {
              if (event.currentTarget.checked === true) {
                role.isC = true;
              } else {
                role.isC = false;
              }
            }
          });
        break;
      case 2:
        const splited_read = passCode.split('read_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_read) {
            if (event.currentTarget.checked === true) {
              role.isR = true;
            } else {
              role.isR = false;
            }
          }
        });
        break;
      case 3:
        const splited_update = passCode.split('update_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_update) {
            if (event.currentTarget.checked === true) {
              role.isU = true;
            } else {
              role.isU = false;
            }
          }
        });
        break;
      case 4:
        const splited_delete = passCode.split('delete_')[1];
        this.listRoles.forEach(role => {
          if (role.code === splited_delete) {
            if (event.currentTarget.checked === true) {
              role.isD = true;
            } else {
              role.isD = false;
            }
          }
        });
        break;
    }


  }
  resetForm() {
    this.router.navigateByUrl('/decen');
  }
  async onSubmitRole() {
    if (this.roleName !== '') {
      this.toastr.error('Tên phân quyền là bắt buộc', 'Có lỗi xảy ra');
      return;
    }
    if (this.briefDescription !== '') {
      this.toastr.error('Mô tả phân quyền là bắt buộc', 'Có lỗi xảy ra');
      return;
    }
    if (this.status !== '') {
      this.toastr.error('Trạng thái phân quyền là bắt buộc', 'Có lỗi xảy ra');
      return;
    }
    const payload = {
      roleName: this.roleName,
      description: JSON.stringify(this.listRoles),
      briefDescription: this.briefDescription,
      status: this.status
    };
    await this.updateRole(payload);
  }
}
