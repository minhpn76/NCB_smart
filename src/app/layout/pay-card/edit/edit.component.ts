import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NCBService } from '../../../services/ncb.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pay-card-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  itemId: any;
  obj: any = {
    status: '',
    prdcode: '',
    product: '',
    activeFee: '',
    cardtype: '',
    changesttFee: '',
    class_: '',
    directddFee: '',
    f01: '',
    f02: '',
    f03: '',
    f04: '',
    f05: '',
    fileName: '',
    issueFee: '',
    linkUlr: '',
    reissueFee: '',
    repinFee: ''
  };
  listStatus: any = [
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Inactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private ncbService: NCBService
  ) {
      this.route.params.subscribe(params => {
        this.itemId = params.itemId;
    });
   }

  ngOnInit() {
    this.getItem({prdcode: this.itemId});
  }
  onSubmit() {
    this.submitted = true;
    if (this.obj.prdcode === ''
      || this.obj.product === ''
      || this.obj.activeFee === ''
      || this.obj.cardtype === ''
      || this.obj.changesttFee === ''
      || this.obj.class_ === ''
      || this.obj.directddFee === ''
      || this.obj.f01 === ''
      || this.obj.f02 === ''
      || this.obj.f03 === ''
      || this.obj.f04 === ''
      || this.obj.f05 === ''
      || this.obj.fileName === ''
      || this.obj.issueFee === ''
      || this.obj.linkUlr === ''
      || this.obj.reissueFee === ''
      || this.obj.repinFee === ''
      || this.obj.status === ''
    ) {
      this.toastr.error('Không được để trống các trường', 'Lỗi!');
      return;
    }
    const id = {
      id: this.itemId
    };
    const data = {
      ...this.obj,
      ...id
    };
    this.ncbService.updateNcbBranch(data).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Sửa thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/pay-card');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.message, 'Thất bại!');

    });
  }
  resetForm() {
    this.router.navigateByUrl('/transaction-room');
  }
  getItem(params) {
    this.ncbService.detailNcbBranch(params).then((result) => {
      const body = result.json().body;
      this.obj.prdcode = body.prdcode;
      this.obj.product = body.product;
      this.obj.activeFee = body.activeFee;
      this.obj.cardtype = body.cardtype;
      this.obj.changesttFee = body.changesttFee;
      this.obj.class_ = body.class_;
      this.obj.directddFee = body.directddFee;
      this.obj.f01 = body.f01;
      this.obj.f02 = body.f02;
      this.obj.f03 = body.f03;
      this.obj.f04 = body.f04;
      this.obj.f05 = body.f05;
      this.obj.fileName = body.fileName;
      this.obj.issueFee = body.issueFee;
      this.obj.linkUlr = body.linkUlr;
      this.obj.reissueFee = body.reissueFee;
      this.obj.repinFee = body.repinFee;
      this.obj.status = body.status;
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
}



