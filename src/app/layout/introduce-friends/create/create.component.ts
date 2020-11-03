import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NCBService } from "../../../services/ncb.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Helper } from "../../../helper";

@Component({
    selector: "app-create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    constructor(
        private formBuilder: FormBuilder,
        private ncbService: NCBService,
        private toastr: ToastrService,
        private router: Router,
        private helper: Helper
    ) {}

    listType = [
        {
            code: "",
            name: "---Chọn giá trị---",
        },
        {
            code: "1",
            name: "ANDROID",
        },
        {
            code: "0",
            name: "IOS",
        },
    ];

    ngOnInit() {
        this.dataForm = this.formBuilder.group({
            title: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            instruction: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            urlPromotion: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            urlBanner: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            objectUserType: [
                ""
            ],
            provider: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ]
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
            .createConfigFriend(this.dataForm.value)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Thêm mới thành công',
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
        this.router.navigateByUrl("/invite-friends");
    }
}
