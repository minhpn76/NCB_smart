import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pos-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [NCBService]
})
export class ListComponent implements OnInit {
    private modalOp: NgbModalRef;
    search_keyword: any = '';
    re_search: any = {
        brnCode: '',
        branchName: '',
        departCode: '',
        departName: '',
        status: '',
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

    constructor(private ncbService: NCBService, private modalService: NgbModal, private toastr: ToastrService) {}

    ngOnInit() {
        this.getListData(this.re_search);
    }

    getListData(params) {
        this.isProcessLoad = 1;
        // xu ly
        this.listData = [];
        this.ncbService
            .searchBranch(params)
            .then(result => {
                setTimeout(() => {
                    const body = result.json().body;
                    this.listData = body.content;
                    this.totalSearch = body.totalElements;
                    this.isProcessLoad = 0;
                }, 300);
            })
            .catch(err => {});
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
                this.ncbService.deleteBranch({departCode: code}).then(() => {
                    this.listData.splice(index, 1);
                    Swal.fire(
                      'Đã xoá!',
                      'Dữ liệu đã xoá hoàn toàn.',
                      'success'
                    );
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
        // payload.page = 0;
        if (payload.brnCode !== '' || payload.branchName !== '' || payload.departCode !== '' || payload.departName !== '' || payload.status !== '') {
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
