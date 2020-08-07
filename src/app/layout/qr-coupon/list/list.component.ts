import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    constructor() {}
    order = 'name';
    reverse = false;

    listStatus = [
        {
            name: 'disable',
            code: '0',
        },
        {
            name: 'enable',
            code: '1',
        },
    ];

    listData = [
      {
        name: 'ưu đãi xem phim',
        desciption: 'Vip',
        code: 'UUDAICGV',
        object_user_type: '1',
        discount_type: '0',
        status: 'A',
        approve_status: '1'
      },
      {
        name: 'ưu đãi ăn uống',
        desciption: 'Thường',
        code: 'UUDAIKFC',
        object_user_type: '0',
        discount_type: '1',
        status: 'D',
        approve_status: '0'
      },
      {
        name: 'ưu đãi xem phim',
        desciption: 'Vip',
        code: 'UUDAICGV',
        object_user_type: '1',
        discount_type: '0',
        status: 'A',
        approve_status: '1'
      },      {
        name: 'ưu đãi xem phim',
        desciption: 'Vip',
        code: 'MAGIAMGIA',
        object_user_type: '0',
        discount_type: '1',
        status: 'A',
        approve_status: '1'
      }
    ];
    ngOnInit() {}
    onSearch() {
        alert('Success');
    }
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }

    deleteItem() {
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
