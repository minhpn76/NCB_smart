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
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelService } from '../../../services/excel.service';

@Component({
    selector: 'qr-merchant-list',
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
    private modalOp: NgbModalRef;
    constructor(
        private ncbService: NCBService,
        public toastr: ToastrService,
        public helper: Helper,
        private router: Router,
        private modalService: NgbModal,
    ) { }

    qrMerchants: any = []

    fileExcel: any = {
        file: File,
        path: null,
        name: ''
    };
    arrayBuffer: any = []
    filelist: any = []
    temp: any = {
        loading: false,
    };

    search: any = {
        size: 10,
        page: 0,
        previous_page: 0,
        search: '',
    };

    isProcessLoad: any = 0;
    totalSearch: any = 0;
    order = 'name';
    listRole: any = [];
    arrExport: any = [];
    reverse = false;
    isProcessLoadExcel: any = 0;


    listData = [];


    ngOnInit() {
        this.getListData(this.search);
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
            payload.search !== ''
        ) {
            payload.page = 0;
        }
        this.getListData(payload);
    }

    getListData(params: any) {
        this.listData = [];
        this.isProcessLoad = 1;
        // xu ly
        this.ncbService
            .getListQRMerchant(params)
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
            cancelButtonText: 'Không, trở lại',
        }).then((result) => {
            // nếu truyền  vào value thì sẽ call api và thông báo đã xóa
            if (result.value) {
                this.ncbService
                    .deleteQRMerchant(itemId)
                    .then((res) => {
                        if (res.json().code === '00') {
                            Swal.fire(
                                'Đã xoá!',
                                'Dữ liệu đã xoá hoàn toàn.',
                                'success'
                            );


                            this.onSearch(this.reloadDataSearch());
                        } else {
                            this.toastr.error('Xoá thất bại', 'Thất bại');
                        }
                    })
                    .catch((err) => { });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Huỷ bỏ', 'Dữ liệu được bảo toàn', 'error');
            }
        });
    }

    openModal(content) {
        this.modalOp = this.modalService.open(content);
    }

    closeModal() {
        this.modalOp.close();
    }

    onUploadFile(event) {
        const fileList: FileList = event.files;
        if (fileList.length > 0) {
            this.fileExcel.file = fileList[0];
            this.fileExcel.name = fileList[0].name;
            this.fileExcel.size = fileList[0].size;
        }
    }

    reloadDataSearch() {
        let { page, size, search, previous_page } = this.search;
        let tempage: number = 0
        if (page > 0) {
            tempage = page - 1
        }
        return {
            page: tempage,
            size: size,
            search: search,
            previous_page: previous_page
        }
    }
    onUploadServer() {
        if (this.fileExcel.file) {
            this.temp.loading = true
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.fileExcel.file);
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, { type: "binary" });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                this.filelist = arraylist
                this.ncbService
                    .createQRMerchant({
                        qrMerchants: arraylist
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            if (result.json().code === "00") {
                                this.toastr.success(
                                    "Thêm mới thành công",
                                    "Thành công!"
                                );
                                setTimeout(() => {
                                    this.router.navigateByUrl("/qr-merchants");
                                }, 500);
                                this.onSearch(this.reloadDataSearch());
                            } else if (result.json().code === "909") {
                                this.toastr.error("Dữ liệu đã tồn tại", "Thất bại!");
                            } else {
                                this.toastr.error("Thêm mới thất bại", "Thất bại!");
                            }
                        }
                    })
                    .catch((err) => {
                        this.toastr.error(err.json().description, "Thất bại!");
                    });
            }
            this.temp.loading = false
            this.closeModal();
        }
    }
}
