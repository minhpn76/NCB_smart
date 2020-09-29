import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    constructor(
        privateformBuilder: FormBuilder,
        // private ncbService: NCBService,
        private toastr: ToastrService,
        private router: Router
    ) {}

    listType = [
        {
            code: '',
            name: '---Chọn giá trị---',
        },
        {
            code: '1',
            name: 'ANDROID',
        },
        {
            code: '0',
            name: 'IOS',
        },
    ];

    ngOnInit() {
        this.dataForm = new FormGroup({
            name: new FormControl(),
            value: new FormControl(),
            type: new FormControl(),
            description: new FormControl(),
            code: new FormControl(),
        });
    }
    get Form() {
        return this.dataForm.controls;
    }
    onSubmit() {
        alert('thành công');
        this.router.navigateByUrl('/version-app-lzi');
        // this.submitted = true;

        // // stop here if form is invalid
        // if (this.dataForm.invalid) {
        //     console.log('demo', this.dataForm);
        //     return;
        // }
        // this.ncbService
        //     .createQRServer(this.dataForm.value)
        //     .then((result) => {
        //         if (result.status === 200) {
        //             if (result.json().code === '00') {
        //                 this.toastr.success(
        //                     'Thêm mới thành công',
        //                     'Thành công!'
        //                 );
        //                 setTimeout(() => {
        //                     this.router.navigateByUrl('/qr-services');
        //                 }, 500);
        //             } else if (result.json().code === '909') {
        //                 this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
        //             } else {
        //                 this.toastr.error('Thêm mới thất bại', 'Thất bại!');
        //             }
        //         }
        //     })
        //     .catch((err) => {
        //         this.toastr.error(err.json().description, 'Thất bại!');
        //     });
    }
    resetForm() {
        this.router.navigateByUrl('/version-app-lzi');
    }
}
