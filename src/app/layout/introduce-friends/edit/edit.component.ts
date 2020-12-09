import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    itemId: any;
    constructor(
        private formBuilder: FormBuilder,
        private ncbService: NCBService,
        private toastr: ToastrService,
        private router: Router,
        private helper: Helper,
        private route: ActivatedRoute,
    ) {
        this.route.params.subscribe(params => {
            this.itemId = parseInt(params.itemId);
        });
        this.dataForm = this.formBuilder.group({
            title: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            instruction: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            urlPromotion: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            urlBanner: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            objectUserType: [
                ''
            ],
            provider: '',
            status: ''
        });
    }

    listStatus = [
        {
            code: '1',
            name: 'Hiệu lực'
        },
        {
            code: '0',
            name: 'Hết hiệu lực'
        }
    ];
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
        this.getItem({id: this.itemId});

    }
    getItem(params) {
        this.ncbService.detailConfigFriend(params).then((result) => {
            const body = result.json().body;
            this.dataForm.patchValue({
                title: body.title,
                instruction: body.instruction,
                objectUserType: body.objectUserType,
                urlPromotion: body.urlPromotion,
                urlBanner: body.urlBanner,
                provider: body.provider,
                status: body.status,
            });
            }).catch(err => {

            });
    }
    get Form() {
        return this.dataForm.controls;
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        this.ncbService
            .updateConfigFriend(this.itemId, this.dataForm.value)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Cập nhật thành công',
                            'Thành công!'
                        );
                        setTimeout(() => {
                            this.router.navigateByUrl('/invite-friends');
                        }, 500);
                    } else if (result.json().code === '909') {
                        this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                    } else {
                        this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                    }
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().description, 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/invite-friends');
    }
}
