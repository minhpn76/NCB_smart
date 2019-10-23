import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'banner-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [NCBService]
})
export class ListComponent implements OnInit {
    search_keyword: any = '';
    isSearch: any = false;
    isProcessLoad: any = 0;
    totalSearch: any = 0;
    re_search = {
        fileName: '',
        status: '',
        size: 10,
        page: 0,
        previous_page: 0
    };

    selectProvine: any;
    listData: any = [];
    listProvinceName: any = [];
    listPageSize: any = [10, 20, 30, 40, 50];
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
    imageShow: any = '';
    protected modalOp: NgbModalRef;

    @ViewChild('showImage', { static: false }) showImageElementRef: ElementRef;
//   public showImageElementRef: ElementRef;

    constructor(
        private ncbService: NCBService,
        public toastr: ToastrService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        this.getListData(this.re_search);
    }

    getListData(params) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .searchPaycardImg(params)
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
                this.toastr.error('Vui lòng thử lại', 'Lỗi hệ thống!');
            });
    }

    deleteItem(event, index, data) {
        Swal.fire({
            title: 'Bạn có chắc chắn xoá?',
            text: 'Dữ liệu đã xoá không thể khôi phục lại',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Không, trở lại'
        }).then(result => {
            if (result.value) {
                this.ncbService.deletePaycardImg({ fileName: data }).then((res) => {
                    // this.listData.splice(index, 1);
                    if (res.json().code === '00') {
                        Swal.fire('Đã xoá!', 'Dữ liệu đã xoá hoàn toàn.', 'success');
                        this.onSearch(this.re_search);
                    } else {
                        this.toastr.error('Không thể xoá dự liệu', 'Thất bại');
                    }
                });
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn :)', 'error');
            }
        });
    }
    cancelAction(event) {
        console.log('huy bo thanh cong');
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
        if (payload.fileName !== '' || payload.status !== '') {
            payload.page = 0;
        } else {
            payload.page = 0;
        }
        this.getListData(payload);
    }
    keyDownFunction(event) {
      if (event.keyCode === 13) {
        this.getListData(this.re_search);
      }
    }
    changePageSize() {
        this.re_search.page = 0;
        this.getListData(this.re_search);
    }
    openModal(content, classLayout = '', type = '') {
        if (type === 'static') {
          this.modalOp = this.modalService.open(content, { keyboard: false, backdrop: 'static', windowClass: classLayout, size: 'lg' });
        } else if (type === 'sm') {
          this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'sm' });
        } else {
          this.modalOp = this.modalService.open(content, { windowClass: classLayout, size: 'lg' });
        }
        this.modalOp.result.then((result) => {
        }, (reason) => {
        });
    }
    closeModal() {
        this.modalOp.close();
    }
    async modalShowImage(image) {
    // tslint:disable-next-line:no-unused-expression
        await this.getImageShow(image);
        this.openModal(this.showImageElementRef, 'modal-showimage', 'sm');
    }
    getImageShow(image) {
        this.imageShow = image;
    }
}
