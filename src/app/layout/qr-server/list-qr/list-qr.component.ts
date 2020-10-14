import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';

@Component({
    selector: 'app-list-qr',
    templateUrl: './list-qr.component.html',
    styleUrls: ['./list-qr.component.scss'],
    providers: [NCBService, Helper],
})
export class ListQrComponent implements OnInit {
    constructor(
        private ncbService: NCBService,
        public helper: Helper,
        public toastr: ToastrService
    ) {}
    search: any = {
        title: '',
        status: '',
        size: 10,
        page: 0,
        previous_page: 0,
    };
    isProcessLoad: any = 0;
    totalSearch: any = 0;
    order = 'titile';
    listRole: any = [];
    arrExport: any = [];
    reverse = false;
    isProcessLoadExcel: any = 0;

    listStatus: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Hiệu lực',
            code: '1',
        },
        {
            name: 'Không hiệu lực',
            code: '0',
        },
    ];

    listData = [];

    ngOnInit() {
        this.getListData(this.search);
    }

    getListData(params: any) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListQRServer(params)
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listData = body.content;
                    this.totalSearch = body.totalElements;
                    this.isProcessLoad = 0;
                }, 300);
            })
            .catch((err) => {
                this.isProcessLoad = 0;
                this.listData = [];
                this.totalSearch = 0;
                // this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }
    loadPage(page: number) {
        const page_number = page - 1;
        if (page_number !== this.search.previous_page) {
            this.search.page = page_number;
            this.search.previous_page = page_number;
            this.getListData(this.search);
            this.search.page = page;
        }
    }
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }
    onChangeStatus(event) {
        this.onSearch(this.search);
    }
    onSearch(payload) {
        if (payload.title !== '' || payload.status !== '') {
            payload.page = 0;
        } else {
            payload.page = 0;
        }
        this.getListData(payload);
    }
    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.onSearch(this.search);
        }
    }
    changePageSize() {
        this.search.page = 0;
        this.getListData(this.search);
    }

    deleteItem(event, index, itemId) {
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            if (result.value) {
                this.ncbService
                    .deleteQRServer(itemId)
                    .then((res) => {
                        if (res.json().code === '00') {
                            // this.listData.splice(index, 1);
                            Swal.fire(
                                'Đã xoá!',
                                'Dữ liệu đã xoá hoàn toàn.',
                                'success'
                            );
                            this.onSearch(this.search);
                        } else {
                            this.toastr.error('Xoá thất bại', 'Thất bại');
                        }
                    })
                    .catch((err) => {});

                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
}
