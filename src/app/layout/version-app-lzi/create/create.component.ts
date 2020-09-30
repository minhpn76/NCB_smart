import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [ NCBService, Helper]
})
export class CreateComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    itemCode: any;
    filelist: any = [];
    versionAppService: any;
    constructor(
        private formBuilder: FormBuilder,
        private ncbService: NCBService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private helper: Helper
    ) {}

    listType = [
        {
            code: '',
            name: '---Chọn giá trị---',
        },
        {
            code: '1',
            name: 'IOS',
        },
        {
            code: '0',
            name: 'ANDROID',
        },
    ];

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.versionAppService = params.itemCode;
        });
        this.dataForm = this.formBuilder.group({
            code: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            value: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            type: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            sort: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            description: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            version_app: [],
        });
    }
    get Form() {
        return this.dataForm.controls;
    }

    getItem(params) {
        this.ncbService
            .getListVersionApp(params)
            .then((result) => {
                const body = result.json().body;
                this.dataForm.patchValue({
                    code: body.code,
                    value: body.value,
                    name: body.name,
                    type: body.type,
                    sort: body.sort,
                    description: body.description,
                });
            })
            .catch((err) => {
                this.toastr.error(err.json().decription, 'Thất bại!');
            });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        const payload = {
            code: this.dataForm.value.code,
            value: this.dataForm.value.value,
            name: this.dataForm.value.name,
            type: this.dataForm.value.type,
            sort: this.dataForm.value.sort,
            description: this.dataForm.value.description,
            versionApp: this.dataForm.value.version_app
                ? this.dataForm.value.version_app
                : this.filelist,
        };
        this.ncbService
            .createVersionApp(payload)
            .then((result) => {
                if (result.status === 200) {

                    console.log('tét', result);
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Thêm mới thành công',
                            'Thành công!'
                        );
                        setTimeout(() => {
                            this.router.navigateByUrl('/version-app-lzi');
                        }, 500);
                    } else if (result.json().code === '909') {
                        this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                    } else {
                        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                    }
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().body, 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/version-app-lzi');
    }
}
