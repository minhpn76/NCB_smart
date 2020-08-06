import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-qr',
  templateUrl: './edit-qr.component.html',
  styleUrls: ['./edit-qr.component.scss']
})
export class EditQrComponent implements OnInit {

  constructor(private router: Router) { }

  listData = [
    {
        id: '12',
        title: 'Food',
        status: '1',
        createdAt: '20/2/2020',
        DeleteAt: '20/2/2020',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    // {
    //     id: '11',
    //     title: 'Gaming',
    //     status: '1',
    //     createdAt: '20/2/2020',
    //     DeleteAt: '20/2/2020',
    //     createdBy: 'admin',
    //     updatedBy: 'admin',
    // },
    // {
    //     id: '10',
    //     title: 'Gaming',
    //     status: '0',
    //     createdAt: '20/2/2020',
    //     DeleteAt: '20/2/2020',
    //     createdBy: 'admin',
    //     updatedBy: 'admin',
    // },
];
  ngOnInit() {
  }
  resetForm() {
    alert('Đã thoát');
    this.router.navigateByUrl('/qr-server');
  }
  changed() {
    alert('Thành công');
    this.router.navigateByUrl('/qr-server');
  }
}
