import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Helper } from '../../../helper';
import { NCBService } from '../../../services/ncb.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, Helper],
})
export class ListComponent implements OnInit {
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    my_14: any = new Date();
    constructor(
        private ncbService: NCBService,
        private toastr: ToastrService,
        public helper: Helper,
        private router: Router
    ) {
        // this.loadDate();
    }
    order = 'name';
    reverse = false;
    isProcessLoad: any = 0;
    totalSearch: any = 0;
    listRole: any = [];
    arrExport: any = [];
    isProcessLoadExcel: any = 0;
    search: any = {
        code: '',
        value: '',
        name: '',
        type: '',
        sort: '',
        description: '',
        size: 10,
        page: 0,
        previous_page: 0,
    };

    listStatus: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'active',
            code: 'A',
        },
        {
            name: 'Deactive',
            code: 'D',
        },
    ];

    listStatusApproved: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Đã phê duyệt',
            code: '1',
        },

        {
            name: 'Chưa phê duyệt',
            code: '0',
        },
    ];
    listType: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Android',
            code: '0',
        },
        {
            name: 'IOS',
            code: '1',
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
            .getListVersionApp(params)
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    if (body) {
                        console.log('body', body);
                        this.listData = body;
                        this.totalSearch = body.totalElements;
                        this.isProcessLoad = 0;
                    } else {
                        this.isProcessLoad = 0;
                        this.listData = [];
                        this.totalSearch = 0;
                    }
                }, 300);
            })
            .catch((err) => {
                this.isProcessLoad = 0;
                this.listData = [];
                this.totalSearch = 0;
            });
    }
    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.getListData(this.search);
        }
    }

    keyDownFunctionSearch(event) {
        if (event.keyCode === 13) {
            this.onSearch(this.search);
        }
    }

    onSearch(payload) {
        if (
            payload.search !== '' ||
            payload.code !== '' ||
            payload.value !== '' ||
            payload.name !== '' ||
            payload.type !== '' ||
            payload.sort !== '' ||
            payload.description !== ''
        ) {
            payload.page = 0;
        }
        // payload.formDate = this.helper.tranferDate(this.mRatesDateS);
        // payload.startDate = this.helper.tranferDate(this.mRatesDateS_7);
        this.getListData(payload);
    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }
    deleteItem(event, index, itemId) {
        console.log('del', index, itemId);
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            // nếu truyền  vào value thì sẽ call api và thông báo đã xóa
            if (result.value) {
                this.ncbService
                    .deleteVersionApp(itemId)
                    .then((res) => {
                        if (res.json().code === '00') {
                            Swal.fire(
                                'Đã xoá!',
                                'Dữ liệu đã xoá hoàn toàn.',
                                'success'
                            );
                            // this.onSearch = (this.search);
                            const {
                                page,
                                size,
                                search,
                                previous_page,
                            } = this.search;
                            let tempage = 0;
                            if (page > 0) {
                                tempage = page - 1;
                            }
                            this.onSearch({
                                page: tempage,
                                size: size,
                                search: search,
                                previous_page: previous_page,
                            });
                        } else {
                            this.toastr.error('Xoá thất bại', 'Thất bại');
                        }
                    })
                    .catch((err) => {});
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn', 'error');
            }
        });
    }
}
