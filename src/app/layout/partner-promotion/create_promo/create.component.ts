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
export class CreatePromoComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    constructor(
        private formBuilder: FormBuilder,
        private ncbService: NCBService,
        private toastr: ToastrService,
        private router: Router,
        private helper: Helper
    ) {}

    listPartnerAll: any = []
    listStatus: any = [
        {
            name: "Phê duyệt & Có hiệu lực",
            code: "0",
        },
        {
            name: "Đang chờ phê duyệt",
            code: "1",
        },
        {
            name: "Phê duyệt & Admin vô hiệu hoá",
            code: "2",
        },
    ];



    ngOnInit() {
        this.getAllPartnerPromotion()
        this.dataForm = this.formBuilder.group({
            promotionName: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            promotionCode: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(5),
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            referPartnerCode: [
                "",
                Validators.compose([
                    Validators.required,
                    this.helper.noWhitespaceValidator,
                ]),
            ],
            // status: ['1']
        });
    }
    get Form() {
        return this.dataForm.controls;
    }
    getAllPartnerPromotion() {
        this.ncbService
            .getListReferalCodePartner({
                page: 0,
                size: 1000
            })
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listPartnerAll.push({'code': '', 'name': '--Vui lòng chọn đối tác--', 'value': ''})
                    body.content.forEach(content => {
                        this.listPartnerAll.push({
                            code: content.id,
                            name: content.partnerName,
                            value: content.partnerCode
                        });
                    });
                }, 300);
            })
            .catch((err) => {
                this.listPartnerAll = [];
                //   this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        this.ncbService
            .createPromotionDetail(this.dataForm.value)
            .then((result) => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success(
                            'Thêm mới thành công',
                            'Thành công!'
                        );
                        setTimeout(() => {
                            // this.router.navigateByUrl('/partner-promotion');
                            this.router.navigate(['/partner-promotion'], { queryParams: { tab: 'detail-promotion' } });
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
        this.router.navigate(['/partner-promotion'], { queryParams: { tab: 'detail-promotion' } });
        // this.router.navigateByUrl("/partner-promotion");
    }
}
