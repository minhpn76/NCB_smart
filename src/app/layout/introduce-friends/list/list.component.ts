import { Component, OnInit } from '@angular/core';
import { NCBService } from '../../../services/ncb.service';
import { OrderPipe } from 'ngx-order-pipe';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Helper } from '../../../helper';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, Helper],
})
export class ListComponent implements OnInit {
    constructor(private ncbService: NCBService, public toastr: ToastrService, public helper: Helper) {
        this.loadDate();
    }
    isProcessLoad: any = 0;
    isProcessLoadNCC: any = 0;
    totalSearch: any = 0;
    totalSearchNCC: any = 0;
    order = 'title';
    reverse = false;
    isShowCreate = false;
    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();

    listData: any = [];
    listDataNCC: any = [];
    listStatus: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Thành công',
            code: '1',
        },
        {
            name: 'Thất bại',
            code: '0',
        },
    ];

    search_config: any = {
        size: 10,
        page: 0,
    };


    search: any = {
        rootUserCif: '',
        targetUserCif: '',
        start: '',
        end: '',
        status: '',
        page: 0,
        size: 10
    };

    ngOnInit() {
        this.getListData(this.search_config);
        const tempPayloadNCC: any = {...this.search};
        if (!tempPayloadNCC.status) {
            delete tempPayloadNCC['status'];
        }
        this.getListNCC(tempPayloadNCC);
    }
    public loadDate(): void {
        this.my_7.setDate(this.my_7.getDate() - 7);
        this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
        this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
    }
    findNameConfig (input: string) {
        return this.listData.find(i => i.id === input);
    }
    getListData(params) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListConfigFriend(params)
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listData = body.content;
                    this.totalSearch = body.totalElements;
                    this.isProcessLoad = 0;
                    this.isShowCreate = body.content.length < 0 ? true : false;
                }, 300);
            })
            .catch((err) => {
                this.isProcessLoad = 0;
                this.listData = [];
                this.totalSearch = 0;
                //   this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }
    loadPage(page: number) {
        const page_number = page - 1;

        if (page_number !== this.search_config.previous_page) {
          this.search_config.page = page_number;
          this.search_config.previous_page = page_number;
          this.getListData(this.search_config);
          this.search_config.page = page;
        }
      }
    tranferDate(params) {
        const tempMonth = (params.month < 10 ? '0' : '') + params.month;
        const tempDay = (params.day < 10 ? '0' : '') + params.day;
        return params.year + '/' + tempMonth + '/' + tempDay;
    }
    getListNCC(params) {
        if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
            params.end = this.tranferDate(this.mRatesDateS_7);
            params.start = this.tranferDate(this.mRatesDateS);
        }
        this.listDataNCC = [];
        this.isProcessLoadNCC = 1;
        // xu ly
        this.ncbService
            .getListFriends(params)
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listDataNCC = body.content;
                    this.totalSearchNCC = body.totalElements;
                    this.isProcessLoadNCC = 0;
                }, 300);
            })
            .catch((err) => {
                this.isProcessLoadNCC = 0;
                this.listData = [];
                this.totalSearch = 0;
                //   this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }
    loadPageNCC(page: number) {
        const page_number = page - 1;

        if (page_number !== this.search.previous_page) {
          this.search.page = page_number;
          this.search.previous_page = page_number;
          this.getListNCC(this.search);
          this.search.page = page;
        }
      }

    keyDownFunction(event) {
        if (event.keyCode === 13) {
          this.onSearch(this.search);
        }
    }
    onSearch(payload) {
        if (payload.rootUserCif !== '' && payload.targetUserCif !== '' && payload.status !== '') {
            payload.page = 0;
            this.getListNCC(payload);
        } else if (payload.rootUserCif !== '' && payload.targetUserCif === '' && payload.status === '') {
            payload.page = 0;
            const temp: any = {
                    rootUserCif: payload.rootUserCif,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(temp);
        } else if (payload.rootUserCif === '' && payload.targetUserCif !== '' && payload.status === '') {
            payload.page = 0;
            const temps: any = {
                    targetUserCif: payload.targetUserCif,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(temps);
        } else if (payload.rootUserCif === '' && payload.targetUserCif === '' && payload.status !== '') {
            payload.page = 0;
            const tempsr: any = {
                    status: payload.status,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(tempsr);
        } else if (payload.rootUserCif !== '' && payload.targetUserCif === '' && payload.status !== '') {
            payload.page = 0;
            const tempsr: any = {
                    rootCif: payload.rootUserCif,
                    status: payload.status,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(tempsr);
        } else if (payload.rootUserCif !== '' && payload.targetUserCif !== '' && payload.status === '') {
            payload.page = 0;
            const tempCT: any = {
                    targetUserCif: payload.targetUserCif,
                    rootUserCif: payload.rootUserCif,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(tempCT);
        } else if (payload.rootUserCif === '' && payload.targetUserCif !== '' && payload.status !== '') {
            payload.page = 0;
            const tempCT: any = {
                    targetUserCif: payload.targetUserCif,
                    status: payload.status,
                    fromDate: payload.fromDate,
                    toDate: payload.referParttoDatenerCode,
                    page: payload.page,
                    size: payload.size
                };
                this.getListNCC(tempCT);
        } else {
            this.getListNCC(this.listDataNCC);
        }
        // if (!payload.status) {
        //     delete payload['status']
        // }
        // const temp: any = {
        //     rootCif: payload.rootCif,
        //     targetCif: payload.targetCif,
        //     fromDate: payload.fromDate,
        //     toDate: payload.referParttoDatenerCode,
        //     status: payload.status,
        //     page: payload.page,
        //     size: payload.size
        // };
        // this.getListNCC(temp);
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
                this.ncbService.deleteConfigFriend({ id: id }).then(() => {
                    this.listData.splice(index, 1);
                    Swal.fire(
                        'Đã xoá!',
                        'Dữ liệu đã xoá hoàn toàn.',
                        'success'
                    );
                });
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
}
