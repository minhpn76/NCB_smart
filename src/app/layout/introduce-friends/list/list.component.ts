import { Component, OnInit } from '@angular/core';
import { NCBService } from '../../../services/ncb.service';
import { OrderPipe } from 'ngx-order-pipe';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Helper } from '../../../helper';
import { ExcelService } from '../../../services/excel.service';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [NCBService, ExcelService, Helper],
})
export class ListComponent implements OnInit {
    constructor(private ncbService: NCBService, private excelService: ExcelService, public toastr: ToastrService, public helper: Helper) {
        this.loadDate();
    }
    // note: đảo ngược root(Người giời thiệu) với taget(Người được giới thiệu), vì app đang bị sai. yêu cầu của BA 28/04/2021
    isProcessLoad: any = 0;
    totalSearch: any = 0;
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
    isProcessLoadNCC: any = 0;
    totalSearchNCC: any = 0;
    listPageSizeNCC: any = [10, 20, 30, 40, 50];
    // search của của danh sách giới thiệu
    search: any = {
        rootUserCif: '',
        targetUserCif: '',
        start:  '',
        end: '',
        status: '',
        page: 0,
        size: 10
    };
    isProcessLoadExcel: any = 0;
    arrExport: any = [];
    infoUser: any = {};
    ngOnInit() {
        this.getListData(this.search_config);
        const tempPayloadNCC: any = {...this.search};
        if (!tempPayloadNCC.status) {
            delete tempPayloadNCC['status'];
        }
        this.getListNCC(tempPayloadNCC);
    }
    setOrder(value: string) {
        if (this.order === value) {
          this.reverse = !this.reverse;
        }

        this.order = value;
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
            params.page = this.search.page;
            params.size = Number(this.search.size);
        }
        this.listDataNCC = [];
        this.isProcessLoadNCC = 1;

        console.log(params);
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
          this.getListNCC(this.onfilterVer2(this.search));
          this.search.page = page;
        }
      }

    keyDownFunction(event) {
        return;
    }
    onSearch(payload) {
        this.search.rootUserCif = payload.rootUserCif;
        this.search.targetUserCif = payload.targetUserCif;
        this.search.status = payload.status;
        this.search.page = 0;
        this.search.size = payload.size;

        this.getListNCC(this.onfilterVer2(payload));

    }
    onfilterVer2(payload) {
        const temp: any = {
            targetUserCif: '',
            status: '',
            rootUserCif: '',
            start: payload.start,
            end: payload.end,
            page: payload.page,
            size: payload.size
        };
        if (payload.rootUserCif !== '') {
            temp.rootUserCif = payload.rootUserCif;
        }
        if (payload.targetUserCif !== '') {
            temp.targetUserCif = payload.targetUserCif;
        }
        if (payload.status !== '') {
            temp.status = payload.status;
        }
        return temp;
    }
    changePageSize() {
        this.search.page = 0;
        this.getListNCC(this.onfilterVer2(this.search));

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
    async getDataExcel(search): Promise<any> {
        const promise = await new Promise((resolve, reject) =>  {
              this.ncbService.getExportFriends(this.onfilterVer2(search))
              .then((result) => {
                  console.log(result);
                  const body = result.json().body;
                  this.arrExport = this.arrExport.concat(body.content);
                  resolve();
              })
              .catch((err) => {
                  resolve();
              });
        });
        return promise;
      }
    async exportExcel() {
        this.arrExport = [];
        this.isProcessLoadExcel = 1;
        const search = Object.assign({start: null, end: null}, this.search);

        if (this.mRatesDateS_7 !== undefined && this.mRatesDateS !== undefined) {
          search.end = this.tranferDate(this.mRatesDateS_7);
          search.start = this.tranferDate(this.mRatesDateS);
          console.log('###', search.end);
        }
        search.end = this.tranferDate(this.mRatesDateS_7);
        search.start = this.tranferDate(this.mRatesDateS);
        search.page = 0;
        console.log('So trang =>' + search.page );
        search.size = this.totalSearchNCC;
        await this.getDataExcel(search);
        console.log(this.arrExport);
        const data = [];
        console.log('DataCT=>' + this.listData);
         let istt = 0;
        this.arrExport.forEach((element) => {
            istt = istt + 1;
          data.push({
            'STT':  istt,
            'Ngày': this.helper.formatFullDateTime(element.createdAt , 1 ),
            'Company': element.brnHold,
            'CIF Người được giới thiệu': element.rootUserCif,
            'Tên người được giới thiệu': element.rootUserName,
            'CIF người giới thiệu': element.targetUserCif,
            'Tên người giới thiệu': element.targetUserName,
            'Mã đối tác': element.partnerCode,
            'Mã khuyến mại': element.promotionCode,
            'Trạng Thái': (element.status === 0 ? 'Thất bại' : 'Thành công'),
            'ID chương trình': element.referFriendConfigId,
            // tslint:disable-next-line:max-line-length
            'Tên chương trình': this.findNameConfig(element.referFriendConfigId) == null ? '' : this.findNameConfig(element.referFriendConfigId).title,
          });
        });
        this.excelService.exportAsExcelFile(data, 'list_registered_service');
        this.isProcessLoadExcel = 0;
        return;
    }

}
