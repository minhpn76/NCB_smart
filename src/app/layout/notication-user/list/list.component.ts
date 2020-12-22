import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../helper';
import { DebugHelper } from 'protractor/built/debugger';
import {
    NgbModal,
    NgbModalRef,
    NgbDateStruct,
    NgbDatepickerConfig,
    NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { listNotify } from '../code';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, Helper],
})
export class ListComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private modalNotitfications: NgbModal,
        private ncbService: NCBService,
        public toastr: ToastrService,
        public helper: Helper,
        private router: Router
    ) {
        this.loadDate();
    }

    userNotifications: [];
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();
    my_14: any = new Date();
    dataForm: FormGroup;
    private modalOp: NgbModalRef;
    search: any = {
        // search: '',
        status: '',
        repeatType: '',
        objectUserType: '',
        fromDate: '',
        toDate: '',
        size: 10,
        page: 0,
        previous_page: 0,
    };

    isProcessLoad: any = 0;
    totalSearch: any = 0;
    order = 'name';
    listRole: any = [];
    arrExport: any = [];
    listQrService: any = [];
    reverse = false;
    isProcessLoadExcel: any = 0;
    listUserForNotify: any = [];
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
    listRepeatValue: any = [...listNotify];

    ObjectUserTypes: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Tất cả người dùng',
            code: '0',
        },
        {
            name: 'Giới hạn',
            code: '1',
        },
    ];

    listData = [];
    // chuyển dữ liệu profile trong localStorage sang dạng json
    profile: any = JSON.parse(localStorage.getItem('profile'))
        ? JSON.parse(localStorage.getItem('profile'))
        : null;

    ngOnInit() {
        this.getListData(this.search);
        this.dataForm = this.formBuilder.group({
            user_notifications: [],
        });
    }
    public loadDate(): void {
        this.my_7.setDate(this.my_7.getDate() - 7);
        this.my_14.setDate(this.my.getDate() + 7);
        this.mRatesDateS = {
            year: this.my_7.getFullYear(),
            month: this.my_7.getMonth() + 1,
            day: this.my_7.getDate(),
        };
        this.mRatesDateS_7 = {
            year: this.my_14.getFullYear(),
            month: this.my_14.getMonth() + 1,
            day: this.my_14.getDate(),
        };
        this.search.fromDate = this.helper.tranferDate(this.mRatesDateS);
        this.search.toDate = this.helper.tranferDate(this.mRatesDateS_7);
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
            // payload.search !== '' ||
            payload.status !== '' ||
            payload.repeatType !== '' ||
            payload.objectUserType !== '' ||
            payload.formDate !== '' ||
            payload.startDate !== ''
        ) {
            payload.page = 0;
        }
        payload.formDate = this.helper.tranferDate(this.mRatesDateS);
        payload.startDate = this.helper.tranferDate(this.mRatesDateS_7);
        this.getListData(payload);
        console.log('test', payload);
    }

    getListData(params: any) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListNoticationUser(params)
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    if (body) {
                        this.listData = body.content;
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
                // this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }
    get Form() {
        return this.dataForm.controls;
    }

    // Xu ly ViewList
    getItem(params) {
        this.isProcessLoad = 1;
        this.ncbService
            .detailNoticationUser(params)
            .then((result) => {
                const body = result.json().body.userNotifications;
                console.log('1212', body);
                this.listUserForNotify = body;
                // this.dataForm.patchValue({
                //     user_notifications: body,
                // });
                this.isProcessLoad = 0;
            })
            .catch((err) => {
                this.toastr.error('Không lấy được dữ liệu', 'Thất bại');
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
                    .deleteNoticationUser(itemId)
                    .then((res) => {
                        console.log('test', res);
                        if (res.json().code === '00') {
                            Swal.fire(
                                'Đã xoá!',
                                'Dữ liệu đã xoá hoàn toàn.',
                                'success'
                            );
                            setTimeout(() => {
                                this.getListData(this.search);
                            }, 300);

                            // const {
                            //     page,
                            //     size,
                            //     search,
                            //     previous_page,
                            // } = this.search;
                            // let tempage = 0;
                            // if (page > 0) {
                            //     tempage = page - 1;
                            // }
                            // this.getListData({
                            //     page: tempage,
                            //     size: size,
                            //     search: search,
                            //     previous_page: previous_page,
                            // });
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

    openModal(user_notifications) {
        this.modalOp = this.modalNotitfications.open(user_notifications);
        console.log('test', this.modalOp);
    }
}
