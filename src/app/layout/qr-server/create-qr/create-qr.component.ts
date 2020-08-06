import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-qr',
    templateUrl: './create-qr.component.html',
    styleUrls: ['./create-qr.component.scss'],
})
export class CreateQrComponent implements OnInit {
    constructor(private router: Router) {}
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
        },
    ];
    resetForm() {
        alert('Đã thoát');
        this.router.navigateByUrl('/qr-server');
    }
    addForm() {
        alert('Đã lưu');
        this.router.navigateByUrl('/qr-server');
    }
    ngOnInit() {}
}
