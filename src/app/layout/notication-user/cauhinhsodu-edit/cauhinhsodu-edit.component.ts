import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  serviceCode: any = 0;
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
  onSubmit() {}
  resetForm() {
    this.router.navigateByUrl('/notifications');
  }
}
