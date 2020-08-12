import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { DebugHelper } from 'protractor/built/debugger';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, Helper],
})
export class ListComponent implements OnInit {
    constructor(
        private ncbService: NCBService,
        public toastr: ToastrService,
        public helper: Helper
    ) {}
    search: any = {
        name: '',
        status: '',
        approveStatus: '',
        discountType: '',
        description: '',
        startDate: '5/8/2020',
        endDate: '19/8/2020',
        size: 10,
        page: 0,
        previous_page: 0,
    };
    quicksearch: any = {
        name: '',
        description: '',
        size: 10,
        page: 0,
        previous_page: 0,
    };
    isProcessLoad: any = 0;
    totalSearch: any = 0;
    order = 'name';
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
            name: 'Kích hoạt',
            code: 'A',
        },
        {
            name: 'Chưa kích hoạt',
            code: 'D',
        },
    ];

    listStatusApproved: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Chưa phê duyệt',
            code: '1',
        },
        {
            name: 'Phê duyệt',
            code: '0',
        },
    ];

    listDiscounts: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Phần trăm',
            code: '1',
        },
        {
            name: 'Giá tiền',
            code: '0',
        },
    ];

    listData = [];

    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.getListData(this.search);
        }
    }
    onSearch(payload) {
        // payload.page = 0;
        if (
            payload.name !== '' ||
            payload.status !== '' ||
            payload.approveStatus !== '' ||
            payload.discountType !== '' ||
            payload.startDate !== '' ||
            payload.endDate !== ''
        ) {
            payload.page = 0;
        }
        this.getListData(payload);
    }
    onQuickSearch(reponsive) {
        if (reponsive.name !== '' || reponsive.description !== '') {
            reponsive.page = 0;
        }
        this.getListData(reponsive);
    }

    ngOnInit() {
        this.getListData(this.search);
    }

    getListData(params: any) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListQRCoupon(params)
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
                this.ncbService.deleteQRCoupon(id).then((res) => {
                    if (res.json().code === '00') {
                        Swal.fire(
                            'Đã xoá!',
                            'Dữ liệu đã xoá hoàn toàn.',
                            'success'
                        );
                        this.onSearch(this.search);
                    } else {
                        this.toastr.error('Xoá dữ liệu thất bại', 'Thất bại');
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
}
