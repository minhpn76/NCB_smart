import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
    selector: 'branch-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [NCBService]
})
export class ListComponent implements OnInit {
    private modalOp: NgbModalRef;
    search_keyword: any = '';
    re_search: any = {
        compCode: '',
        compName: '',
        page: 0,
        size: 10
    };
    listData: any = [];
    isSearch: any = false;
    totalSearch: any = 0;
    isProcessLoad: any = 0;
    listPageSize: any = ['10', '20', '30', '40', '50'];
    listStatus: any = [
        {
            name: 'Tất cả',
            code: ''
        },
        {
            name: 'Active',
            code: 'A'
        },
        {
            name: 'Deactive',
            code: 'D'
        }
    ];
    order: string = 'compName';
    reverse: boolean = false;
  
    sortedCollection: any[];

    constructor(
        private ncbService: NCBService, private modalService: NgbModal, private toastr: ToastrService,
        private orderPipe: OrderPipe) {
            this.sortedCollection = orderPipe.transform(this.listData, 'compName');
    }
    

    ngOnInit() {
        this.getListData(this.re_search);
    }
    setOrder(value: string) {
        if (this.order === value) {
          this.reverse = !this.reverse;
        }
    
        this.order = value;
      }

    getListData(params) {
        this.isProcessLoad = 1;
        // xu ly
        this.listData = [];
        this.ncbService
            .searchCompany(params)
            .then(result => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listData = body.content;
                    this.totalSearch = body.totalElements;
                    this.isProcessLoad = 0;
                }, 300);
            })
            .catch(err => {
                this.isProcessLoad = 0;
                this.listData = [];
                this.totalSearch = 0;
                this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
            });
    }

    deleteItem(event, index, code) {
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại'
        }).then(result => {
            if (result.value) {
                this.ncbService.deleteCompany({ compCode: code }).then((res) => {
                    if (res.json().code === '00') {
                        this.listData.splice(index, 1);
                        Swal.fire(
                          'Đã xoá!',
                          'Dữ liệu đã xoá hoàn toàn.',
                          'success'
                        );
                    } else {
                        this.toastr.error('Xoá thất bại', 'Thất bại');
                    }
                  });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
    loadPage(page: number) {
        const page_number = page - 1;
        if (page_number !== this.re_search.previous_page) {
            this.re_search.page = page_number;
            this.re_search.previous_page = page_number;
            this.getListData(this.re_search);
            this.re_search.page = page;
        }
    }
    onSearch(payload) {
        if (payload.compCode !== '' || payload.compName !== '') {
            payload.page = 0;
        } else {
            payload.page = 0;
        }

        this.getListData(payload);
    }
    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.onSearch(this.re_search);
        }
    }
    changePageSize() {
        this.re_search.page = 0;
        this.getListData(this.re_search);
    }
    // upload
}
