import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cauhinhsodu-edit',
  templateUrl: './cauhinhsodu-edit.component.html',
  styleUrls: ['./cauhinhsodu-edit.component.scss'],
  providers: [NCBService, Helper]
})
export class CauhinhsoduEditComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }
  serviceCode: any = '';
  dataForm: any = [];
  get Form() { return this.dataForm.controls; }
  submitted = false;
  listStatus: any = [
    {
      name: 'Có hiệu lực',
      code: 1,
    },
    {
      name: 'Không hiệu lực',
      code: 0,
    }
  ];
  ngOnInit() {
    this.route.params.subscribe(params => {
    this.serviceCode = params.itemId;
    });

    this.dataForm = this.formBuilder.group({
      serviceCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      serviceName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      content: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      description: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      title: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      status: '1',
    });

    this.getItem(this.serviceCode);
  }
  getItem(params) {
    this.ncbService.getdetailPushContent(params).then((result) => {
      const body = result.json().body;

      this.dataForm.patchValue({
        serviceCode: body.serviceCode,
        serviceName: body.serviceName,
        content: body.content,
        description: body.description,
        title: body.title,
        status: body.status
      });
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dataForm.invalid) {
     console.log('bung');
      return;
    }
    const payload = {
      serviceCode: this.serviceCode,
      serviceName: this.dataForm.value.serviceName,
      content: this.dataForm.value.content,
      status: this.dataForm.value.status,
      description: this.dataForm.value.description,
      title: this.dataForm.value.title,
    };
    Swal.fire({
      title: 'Bạn có chắc chắn cập nhật?',
      text: 'Dữ liệu thông báo khách hàng sẽ bị chỉnh sửa!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại',
  }).then((result) => {
      // nếu truyền  vào value thì sẽ call api và thông báo đã xóa
      if (result.value) {
        this.ncbService.updatePushContent(payload).then(result => {
          if (result.json().code === '00') {
            this.toastr.success('Sửa thành công', 'Thành công!');
            setTimeout(() => {
              this.router.navigateByUrl('/notifications/listsodu');
            }, 500);
          } else {
            this.toastr.error('Sửa thất bại', 'Thất bại!');
          }
        }).catch(err => {
          this.toastr.error(err.json().desciption, 'Thất bại!');
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
  });
  }
  resetForm() {
    this.router.navigateByUrl('/notifications/listsodu');
  }
}
