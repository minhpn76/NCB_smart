import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [NCBService, Helper]
})
export class ProfileComponent implements OnInit {
  profile: any;
  nameBranch: any;
  nameTransaction: any;
  constructor(
    private toastr: ToastrService,
    private ncbService: NCBService,
  ) { }

  ngOnInit() {
    this.profile = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
    this.getBranchs();

  }

  getBranchs() {
    this.ncbService.getBranchs().then((result) => {
      const nameBranch = result.json().body.filter(e => e.brnCode === this.profile.branchCode);
      this.nameBranch = nameBranch[0].branchName;

      this.ncbService.getPGD({ brnCode: nameBranch[0].brnCode }).then((resultS) => {
        const nameTransaction = resultS.json().body.content.filter(e => e.departCode === this.profile.transactionCode);
        if (nameTransaction.length === 0) {
          this.nameTransaction = '';
        } else {
          this.nameTransaction = nameTransaction[0].departName;
        }
      }).catch((err) => {
        this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
        this.nameTransaction = '';
      });
    }).catch((err) => {
      this.toastr.error('Không lấy được dự liệu chi nhánh!', 'Thất bại!');
      this.nameBranch = '';
    });
  }
}
