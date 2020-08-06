import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list-qr',
    templateUrl: './list-qr.component.html',
    styleUrls: ['./list-qr.component.scss'],
})
export class ListQrComponent implements OnInit {
    constructor() {}
    isProcessLoad: any = 0;
    totalSearch: any = 0;
    order = 'titile';
    listRole: any = [];
    arrExport: any = [];
    reverse = false;
    isProcessLoadExcel: any = 0;

    listStatus: any = [
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
        {
            id: '11',
            title: 'Gaming',
            status: '1',
            createdAt: '20/2/2020',
            DeleteAt: '20/2/2020',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: '10',
            title: 'Gaming',
            status: '0',
            createdAt: '20/2/2020',
            DeleteAt: '20/2/2020',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
    ];

    onSearch(re_search) {
        alert(re_search);
    }
    ngOnInit() {}
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    deleteItem(event, index, id) {
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            if (result.value) {
                // this.ncbService.deleteUser(id).then((res) => {
                //     if (res.json().code === "00") {
                //         Swal.fire(
                //             "Đã xoá!",
                //             "Dữ liệu đã xoá hoàn toàn.",
                //             "success"
                //         );
                //         this.onSearch(this.re_search);
                //     } else {
                //         this.toastr.error("Xoá dữ liệu thất bại", "Thất bại");
                //     }
                // });
                alert('Thành công');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
}
