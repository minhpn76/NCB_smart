import { Component, OnInit, ViewChild } from '@angular/core';
import { NCBService } from '../../../services/ncb.service';
import { OrderPipe } from 'ngx-order-pipe';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Helper } from '../../../helper';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, Helper],
})
export class ListComponent implements OnInit {
    constructor(
        private ncbService: NCBService, public toastr: ToastrService,
        public helper: Helper,  private router: Router,
        private route: ActivatedRoute,
    ) {
        this.loadDate();
        this.route.queryParams.subscribe(params => {
            if (params && 'tab' in params) {
                this.tabId = params['tab'];
            }
        });
    }
    @ViewChild('ctdTabset', { static: true }) ctdTabset: any;
    tabId = 'partner-promotion';
    isProcessLoad: any = 0;
    isProcessLoadNCC: any = 0;
    totalSearch: any = 0;
    totalSearchNCC: any = 0;
    order = 'title';
    reverse = false;
    isShowCreate = false;

    mRatesDateS_1: NgbDateStruct;
    mRatesDateS_7_1: NgbDateStruct;
    my_1: any = new Date();
    my_7_1: any = new Date();

    mRatesDateS: NgbDateStruct;
    mRatesDateS_7: NgbDateStruct;
    my: any = new Date();
    my_7: any = new Date();

    listData: any = [];
    listPartnerAll: any = [];
    listDataNCC: any = [];
    listStatus: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Đang chờ phê duyệt',
            code: '0',
        },
        {
            name: 'Phê duyệt & Có hiệu lực',
            code: '1',
        },
        {
            name: 'Phê duyệt & Admin vô hiệu hoá',
            code: '2',
        },
    ];

    search_config: any = {
        size: 10,
        page: 0,
        fromDate: '',
        toDate: '',
    };


    search: any = {
        referPartnerCode: '',
        status: '',
        fromDate: '',
        toDate: '',
        page: 0,
        size: 10
    };
    ngAfterViewInit() {
        this.switchNgBTab(this.tabId);
    }
    switchNgBTab(id: string) {
        this.ctdTabset.select(id);
    }

    ngOnInit() {
        this.getListData(this.search_config);

        const tempPayloadNCC: any = {...this.search};
        if (!tempPayloadNCC.status) {
            delete tempPayloadNCC['status'];
        }
        this.getListNCC(tempPayloadNCC);
        this.getAllPartnerPromotion();
    }
    public loadDate(): void {
        this.my_7_1.setDate(this.my_7_1.getDate() - 7);
        this.my_1.setDate(this.my_1.getDate() + 2);
        this.mRatesDateS_1 = { year: this.my_7_1.getFullYear(), month: this.my_7_1.getMonth() + 1, day: this.my_7_1.getDate() };
        this.mRatesDateS_7_1 = { year: this.my_1.getFullYear(), month: this.my_1.getMonth() + 1, day: this.my_1.getDate() };

        //
        this.my_7.setDate(this.my_7.getDate() - 7);
        this.my.setDate(this.my.getDate() + 2);
        this.mRatesDateS = { year: this.my_7.getFullYear(), month: this.my_7.getMonth() + 1, day: this.my_7.getDate() };
        this.mRatesDateS_7 = { year: this.my.getFullYear(), month: this.my.getMonth() + 1, day: this.my.getDate() };
    }
    findNameConfig (input: string) {
        const obj: any =  this.listPartnerAll.find(i => i.value === input);
        if (!obj) {
            return '';
        }
        return 'name' in obj ? obj.name : '';
    }
    getListData(params) {
        if (this.mRatesDateS_7_1 !== undefined && this.mRatesDateS_1 !== undefined) {
            params.toDate = this.tranferDate(this.mRatesDateS_7_1);
            params.fromDate = this.tranferDate(this.mRatesDateS_1);
        }
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListReferalCodePartner(params)
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

    getAllPartnerPromotion() {
        this.ncbService
            .getListReferalCodePartner({
                page: 0,
                size: 1000
            })
            .then((result) => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listPartnerAll.push({'code': '', 'name': 'Tất cả', 'value': ''});
                    body.content.forEach(content => {
                        this.listPartnerAll.push({
                            code: content.id,
                            name: content.partnerName,
                            value: content.partnerCode
                        });
                    });
                }, 300);
            })
            .catch((err) => {
                this.listPartnerAll = [];
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
            params.toDate = this.tranferDate(this.mRatesDateS_7);
            params.fromDate = this.tranferDate(this.mRatesDateS);
        }
        this.listDataNCC = [];
        this.isProcessLoadNCC = 1;
        // xu ly
        this.ncbService
            .getListPromotionDetail(params)
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

    onSearch_1(payload) {
        this.getListData(payload);
    }

    onSearch(payload) {
        if ( payload.referPartnerCode !== '' || payload.status !== '') {
            payload.page = 0;
        }
        // if (!payload.status) {
        //     delete payload['status']
        // }
        const temp: any = {
            referPartnerCode: payload.referPartnerCode,
            fromDate: payload.fromDate,
            toDate: payload.referParttoDatenerCode,
            page: payload.page,
            size: payload.size
        };
        this.getListNCC(temp);
        console.log(temp);

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
                this.ncbService.deleteReferalCodePartner({ id: id }).then(() => {
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
    deleteItemPromo(event, index, id) {
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            if (result.value) {
                this.ncbService.deletePromotionDetail({ id: id }).then(() => {
                    this.listDataNCC.splice(index, 1);
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
    beforeChange(event: any) {
        if (!event) {
            return;
        }
        const idTab: string = event.nextId;
        this.router.navigate(['/partner-promotion'], { queryParams: { tab: idTab } });
    }

}
