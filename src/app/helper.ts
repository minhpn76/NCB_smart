import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { isNumber, toInteger, padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import 'rxjs/add/operator/toPromise';
import { FormControl, FormGroup } from '@angular/forms';
import { element } from '@angular/core/src/render3';

@Injectable()
export class Helper {

    public patternEmail = '^(([^<>()\[\]\\._,;:\s@"]+([\._][^<>()\[\]\\._,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    public country = [];

    constructor(
        private appComponent: AppComponent,
        public toastr: ToastrService,
    ) { }

    getParameterByName(name, url = '') {
        if (url === '') { url = window.location.href; }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&]*)|&|$)'),
            results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ''; }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    urlEncodeParams(data) {
        return Object.entries(data).map(e => e.join('=')).join('&');
    }

    // Process String
    bodauTiengViet(str) {
        if (!str) {
            return str;
        }
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ò/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');

        str = str.replace(/ò|ó/g, 'o');
        str = str.replace(/à|ạ|á|ả|ã/g, 'a');
        str = str.replace(/ĩ|ị|ì/g, 'i');
        str = str.replace(/ũ/g, 'u');
        str = str.replace(/è|é/g, 'e');
        // str = str.replace(/-/g, "");

        return str;
    }
    toFormData<T>( formValue: T ) {
        const formData = new FormData();
        for ( const key of Object.keys(formValue) ) {
          const value = formValue[key];
          formData.append(key, value);
        }
        return formData;
    }
    requiredFileType( type: string ) {
        return function (control: FormControl) {
          const file = control.value;
          if ( file ) {
            const extension = file.name.split('.')[1].toLowerCase();
            if ( type.toLowerCase() !== extension.toLowerCase() ) {
              return {
                requiredFileType: true
              };
            }
            return null;
          }
          return null;
        };
    }

    // custom validator to check that two fields match
    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
    matchRoles(listRole) {
        const roles = {
            quanTri: [],
            offQuanTri: false,
            giaoDich: [],
            offGiaoDich: false,
            khachHang: [],
            offKhachHang: false,
            thamSo: [],
            offThamSo: false,
            traCuu: [],
            offTraCuu: false
        };
        roles.quanTri = listRole.filter(item => item.menu === 'QUAN_TRI');
        roles.giaoDich = listRole.filter(item => item.menu === 'GIAO_DICH');
        roles.khachHang = listRole.filter(item => item.menu === 'KHACH_HANG');
        roles.thamSo = listRole.filter(item => item.menu === 'THAM_SO');
        roles.traCuu = listRole.filter(item => item.menu === 'TRA_CUU');
        // set off
        roles.offQuanTri = roles.quanTri.find(item => item.isAll === true) === undefined ? true : false;
        roles.offGiaoDich = roles.giaoDich.find(item => item.isAll === true) === undefined ? true : false;
        roles.offKhachHang = roles.khachHang.find(item => item.isAll === true) === undefined ? true : false;
        roles.offThamSo = roles.thamSo.find(item => item.isAll === true) === undefined ? true : false;
        roles.offTraCuu = roles.traCuu.find(item => item.isAll === true) === undefined ? true : false;
        return roles;
    }
    validateFileImage(
        files: any, max_size: number, file_type: string,
        isWidth?: number, isHeight?: number
    ): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            const arr_type = file_type.split(',');
            if (!arr_type.includes(files.type)) {
                this.toastr.warning('File tải lên không đúng định dạng', 'Thất bại!');
                resolve(false);
            } else if (files.size > max_size) {
                this.toastr.warning('File tải lên có dung lượng quá lớn', 'Thất bại!');
                resolve(false);
            } else {
                if (isHeight != null && isWidth != null) {
                    const img = new Image();
                    img.src = window.URL.createObjectURL(files);
                    img.onload = () => {
                        const width = img.naturalWidth;
                        const height = img.naturalHeight;
                        window.URL.revokeObjectURL(img.src);
                        if (width === isWidth && height === isHeight) {
                            resolve(true);
                        } else {
                            this.toastr.warning('Không đúng định dạng', 'Thất bại!');
                            resolve(false);
                        }
                    };
                } else {
                    resolve(true);
                }
            }
        });
        return promise;
    }
}
