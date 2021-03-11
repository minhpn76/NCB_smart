import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'provision-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
    providers: [NCBService, Helper],
})
export class EditComponent implements OnInit {
    public Editor = ClassicEditor;
    dataForm: FormGroup;
    submitted = false;
    itemId: any;
    obj: any = {
        status: '',
        provisionName: '',
        provisionLink: '',
    };
    listStatus: any = [
        {
            name: 'Active',
            code: 'A',
        },
        {
            name: 'Deactive',
            code: 'D',
        },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        public router: Router,
        private route: ActivatedRoute,
        private ncbService: NCBService,
        private helper: Helper
    ) {
        this.route.params.subscribe((params) => {
            this.itemId = parseInt(params.itemId);
        });
        this.dataForm = this.formBuilder.group({
            provisionName: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            provisionLink: [
                '',
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            status: [''],
        });
    }
    get Form() {
        return this.dataForm.controls;
    }

    ngOnInit() {
        this.getItem({ id: this.itemId });
    }
    onSubmit() {
        this.submitted = true;
        if (this.dataForm.invalid) {
            return;
        }
        const id = {
            id: this.itemId,
        };
        const data = {
            ...this.dataForm.value,
            ...id,
        };
        this.ncbService
            .updateMBProvision(data)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code !== '00') {
                        this.toastr.error(result.json().message, 'Thất bại!');
                    } else {
                        this.toastr.success('Sửa thành công', 'Thành công!');
                        setTimeout(() => {
                            this.router.navigateByUrl('/provision');
                        }, 500);
                    }
                } else {
                    this.toastr.error(result.message, 'Thất bại!');
                }
            })
            .catch((err) => {
                this.toastr.error(err.json().message, 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/provision');
    }
    getItem(params) {
        this.ncbService
            .detailMBProvision(params)
            .then((result) => {
                const body = result.json().body;
                this.dataForm.patchValue({
                    status: body.status,
                    provisionLink: body.provisionLink,
                    provisionName: body.provisionName,
                });
            })
            .catch((err) => {
                this.toastr.error(err.json().decription, 'Thất bại!');
            });
    }

    onReady(eventData) {
        eventData.plugins.get('FileRepository').createUploadAdapter = function (
            loader
        ) {
            console.log('loader : ', loader);
            console.log(btoa(loader.file));
            return new UploadAdapter(loader);
        };
    }
}
export class UploadAdapter {
    private loader;
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const myReader = new FileReader();
                    myReader.onloadend = (e) => {
                        resolve({ default: myReader.result });
                    };

                    myReader.readAsDataURL(file);
                })
        );
    }
}
