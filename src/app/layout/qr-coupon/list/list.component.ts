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
        public toastr: ToastrService,
        public helper: Helper,
        private router: Router
    ) {
        this.loadDate();
    }
    search: any = {
        name: '',
        status: '',
        approveStatus: '',
        discountType: '',
        description: '',
        startDate: '',
        endDate: '',
        size: 10,
        page: 0,
        previous_page: 0,
        search: '',
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
    ngOnInit() {
        this.getListData(this.search);
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
        this.search.startDate = this.helper.tranferDate(this.mRatesDateS);
        this.search.endDate = this.helper.tranferDate(this.mRatesDateS_7);
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
            payload.name !== '' ||
            payload.status !== '' ||
            payload.approveStatus !== '' ||
            payload.discountType !== '' ||
            payload.startDate !== '' ||
            payload.endDate !== ''
        ) {
            payload.page = 0;
        }
        payload.startDate = this.helper.tranferDate(this.mRatesDateS);
        payload.endDate = this.helper.tranferDate(this.mRatesDateS_7);
        this.getListData(payload);
    }
    // onApproved(payload) {
    //     if (
    //         payload.name !== '' ||
    //         payload.status !== 'Phê duyệt' ||
    //         payload.approveStatus !== '' ||
    //         payload.discountType !== '' ||
    //         payload.startDate !== '' ||
    //         payload.endDate !== ''
    //     ) {
    //         payload.page = 0;
    //     }
    //     payload.startDate = this.helper.tranferDate(this.mRatesDateS);
    //     payload.endDate = this.helper.tranferDate(this.mRatesDateS_7);
    //     this.getListData(payload);
    // }
    onQuickSearch(reponsive) {
        if (reponsive.name !== '' || reponsive.description !== '') {
            reponsive.page = 0;
        }
        this.getListData(reponsive);
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

    deleteItem(event, index, itemId) {
        Swal.fire({
          title: 'Bạn có chắc chắn xoá?',
          text: 'Dữ liệu đã xoá không thể khôi phục lại',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Không, trở lại'
        }).then((result) => {
          if (result.value) {
            this.ncbService.deleteQRServer(itemId).then(res => {
              if (res.json().code === '00') {
                Swal.fire(
                  'Đã xoá!',
                  'Dữ liệu đã xoá hoàn toàn.',
                  'success'
                );
                this.onSearch(this.search);
              } else {
                this.toastr.error('Xoá thất bại', 'Thất bại');
              }
            }).catch(err => {

            });

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Huỷ bỏ',
              'Dữ liệu được bảo toàn :)',
              'error'
            );
          }
        });
      }




    // this.ncbService.updateQRServer(this.qrService , payload).then(result => {
    //     if (result.json().code === '00') {
    //       this.toastr.success('Sửa thành công', 'Thành công!');
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/qr-services');
    //       }, 500);
    //     } else {
    //       this.toastr.error('Sửa thất bại', 'Thất bại!');
    //     }
    //   }).catch(err => {
    //     this.toastr.error(err.json().desciption, 'Thất bại!');
    //   });
    // }
    approved(event, index, status) {
        Swal.fire({
            title: 'Bạn có muốn phê duyệt?',
            type: 'info',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            if (result.value) {
                this.ncbService.updateQRCoupon(status, 1).then((res) => {
                    if (res.json().code === '00') {
                        Swal.fire(
                            'Đã phê duyệt!',
                            'success'
                        );
                        this.router.navigateByUrl('/qr-coupons');
                    } else {
                        this.toastr.error('Không phê duyệt', 'Thất bại');
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu chưa được phê duyệt.', 'error');
            }
        });
    }
}
