import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'roles-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  // listRoles: any;
  @Input() listRoles: any = AppSettings.listRoles;
  tempRole: any;
  obj: any = {};
  role: any = {
    create: null,
    delete: null,
    read: null,
    update: null,
  };


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper,
    public location: Location
  ) {
    this.listRoles = AppSettings.listRoles;
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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    const payload = {
      roleName: this.dataForm.value.roleName,
      description: JSON.stringify(this.listRoles),
      briefDescription: this.dataForm.value.briefDescription,
      status: this.dataForm.value.status

    };
    // this.router.navigateByUrl('/decen');

    this.ncbService.createRoles(payload).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
          this.pageRefresh();
          setTimeout(() => {
            this.resetForm();
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
    this.router.navigateByUrl('/decen');
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
}


