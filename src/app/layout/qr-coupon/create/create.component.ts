import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private router: Router) { }

  listStatus = [
    {
      name: 'Hiệu lực',
      code: '1',
    },
    {
      name: 'Không hiệu lực',
      code: '0',
    },
    {
      name: 'Tất cả',
      code: '',
    }
  ];
  listDesciption = [
    {
      name: 'Vip',
      code: '1',
    },
    {
      name: 'Thường',
      code: '0',
    },
    {
      name: 'Tất cả',
      code: '',
    }
  ];

  ngOnInit() {
  }
  addForm() {
    alert('thông báo');
    this.router.navigateByUrl('/qr-coupon');
  }
  resetForm() {
    this.router.navigateByUrl('/qr-coupon');
  }
}
