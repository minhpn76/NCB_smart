import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../../services/excel.service';
import { Helper } from '../../../helper';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbTabChangeEvent, NgbTooltipConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'telecom-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [NCBService, ExcelService, Helper]
})
export class ListComponent implements OnInit {
  order = 'code';
  reverse = false;

  sortedCollection: any[];
  constructor(
    private ncbService: NCBService,
    public toastr: ToastrService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    public helper: Helper,
    public router: Router,
    private orderPipe: OrderPipe
  ) {
    this.sortedCollection = orderPipe.transform(this.listData, 'code');
   }
  isSearch: any = false;
  totalSearch: any = 0;
  isProcessLoad: any = 0;
  search_keyword: any = '';
  arrExport: any = [];
  isProcessLoadExcel: any = 0;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  temp: any = {
    loading: false
  };
  uploadedFiles: any[] = [];
  file_ext = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  file_size: number = 15 * 1024 * 1024;

  re_search: any = {
    code: '',
    name: '',
    value: '',
    page: 0,
    size: 10,
    previous_page: 0
  };
  protected modalOp: NgbModalRef;

  @ViewChild('uploadFile', { static: false }) uploadFileElementRef: ElementRef;
  @Output() emitCloseModal = new EventEmitter<any>();
  listData: any = [];
  listPageSize: any = [10, 20, 30, 40, 50];
  listStatus: any = [
    {
      name: 'Tất cả',
      code: '',
    },
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];

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
    this.ncbService.searchParamCallCenter(params).then((result) => {
      setTimeout(() => {
        this.isProcessLoad = 0;
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;

      }, 500);
    }).catch((err) => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });

  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.onSearch(this.re_search);
    }
  }

  deleteItem(event, index, code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteParamCallCenter({ id: code }).then((res) => {
          if (res.json().body === null) {
            this.toastr.error('Không thể xoá được dữ liệu', 'Lỗi!');
            return;
          }
          this.listData.splice(index, 1);
          Swal.fire(
            'Đã xoá!',
            'Dữ liệu đã xoá hoàn toàn.',
            'success'
          );
          setTimeout(() => {
            this.re_search.page = 0;
            this.getListData(this.re_search);
          }, 500);
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
  cancelAction(event) {
    console.log('huy bo thanh con');

  }
  onUpload(event) {
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

  loadPage(page: any) {
    const page_number = page - 1;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
      this.re_search.page = page;
    }
  }
  changeSize(size: number) {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }

  onSearch(params) {
    // date
    if (params.name !== '' || params.value !== '') {
      params.page = 0;
    }
    this.getListData(params);
  }

  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }
  getDataExcel(search): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.ncbService.searchParamCallCenter(search)
        .then((result) => {
            this.arrExport = this.arrExport.concat(result.json().body.content);
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
    const search = Object.assign({}, this.re_search);
    // search.size = 1000;
    // const page = Math.ceil(this.totalSearch / search.size);
    // search.page = 0;
    // await this.getDataExcel(search);
    const page = Math.ceil(this.totalSearch / search.size);

    for (let i = 0; i <= (page <= 0 ? 1 : page); i++) {
        search.page = i;
        await this.getDataExcel(search);
    }
    search.page = 0;
    const data = [];
    this.arrExport.forEach((element) => {
      data.push({
        'Mã nhà mạng': element.paramNo,
        'Tên nhà mạng': element.paramName,
        'Giá trị': element.paramValue,
        'Mô tả': element.note,
        'Trạng thái': element.status === 'A' ? 'Active' : 'Deactive',
      });
    });
    this.excelService.exportAsExcelFile(data, 'list_telecom');
    this.isProcessLoadExcel = 0;
    return;
  }
  popUpImportExcel() {

  }



  async onUploadFile(event, call_upload = 1) {
    const fileList: FileList = event.files;
    try {
        const check = await this.helper.validateFileImage(event.files[0], this.file_size, this.file_ext);
        if (check) {
            if (fileList.length > 0) {
              this.fileExcel.file = fileList[0];
              this.fileExcel.name = fileList[0].name;
            }
        }
    } catch (err) {
        this.toastr.error('Chọn tệp tin không thành công', 'Thất bại');
    }
  }
  onUploadServer() {
    if (this.fileExcel.file) {
      this.temp.loading = true;
       const file: File = this.fileExcel.file;
      this.ncbService.uploadFileTelecom(file).then((result) => {
        if (result.status === 200) {
          if (result.json().code !== '00') {
            this.toastr.error(result.json().message, 'Thất bại!');
          } else {
            this.toastr.success('Upload dữ liệu thành công', 'Thành công!');
            this.temp.loading = false;
            setTimeout(() => {
              this.closeModal();
              this.onSearch(this.re_search);
            }, 3000);
          }
        } else {
          this.toastr.error(result.message, 'Thất bại!');
        }

      }).catch((err) => {
        this.toastr.error(err.json().message, 'Thất bại!');

      });
    }
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
  async closeModal() {
    await this.clearFile();
    this.modalOp.close();
  }
  clearFile() {
    this.fileExcel = {
      file: File,
      path: null,
      name: ''
    };
  }

  async modalUploadFile() {
    // tslint:disable-next-line:no-unused-expression
      this.openModal(this.uploadFileElementRef, 'modal-uploadFile', 'sm');
  }

}
