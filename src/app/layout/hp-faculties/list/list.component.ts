
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbTabChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [NCBService]
})
export class ListComponent implements OnInit {
  re_search = {
    codeSchool: '',
    codeFacultie: '',
    status: 1,
    size: 10,
    page: 0,
    previous_page: 0
  };
  listStatus: any = [
    {
      name: 'Tất cả',
      code: -1,
    },
    {
      name: 'Active',
      code: 1,
    },
    {
      name: 'Deactive',
      code: 0,
    }
  ];
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;
  listData: any[];
  listSchool: any[];
  modalOp: any;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  arrayBuffer: any = [];
  filelist: any = [];
  temp: any = {
      loading: false,
  };
  constructor(
    public toastr: ToastrService,
    private ncbService: NCBService,
    private orderPipe: OrderPipe,
    private modalService: NgbModal,
    private router: Router
  ) {
    localStorage.setItem('redirect', 'false');
  }
  ngOnInit() {
    this.getSchool();
     this.getListData(this.re_search);
  }
  loadPage(page: number)  {
    const page_number = page;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.onSearch(this.re_search);
    }
  }
  /*Câ[j nhat lại ham sert tai day] */
  onSearch(payload) {
    this.listData = [];
    this.isProcessLoad = 1;
    this.ncbService.getListHpFaculties(payload).then(result => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  /*Đổi tên hàm serach trong NCB service */
  getListData(params) {
    this.listData = [];
    this.isProcessLoad = 1;
    // xu ly
    this.ncbService.getListHpFaculties(params).then((result) => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body.content;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.isProcessLoad = 0;
      this.listData = [];
      this.totalSearch = 0;
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  deleteItem(code) {
    Swal.fire({
      title: 'Bạn có chắc chắn xoá?',
      text: 'Dữ liệu đã xoá không thể khôi phục lại',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không, trở lại'
    }).then((result) => {
      if (result.value) {
        this.ncbService.deleteFaculties(code).then(res => {
          if (res.json().code === '00') {
            // this.listData.splice(index, 1);
            Swal.fire(
              'Đã xoá!',
              'Dữ liệu đã xoá hoàn toàn.',
              'success'
            );
            this.onSearch(this.re_search);
          } else {
            this.toastr.error('Xoá thất bại', 'Thất bại');
          }
        }).catch(err => {});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Huỷ bỏ',
          'Dữ liệu được bảo toàn :)',
          'error'
        );
      }
    });
  }
  /*Get danh sach truong */
  getSchool() {
    this.listSchool = [];
    this.listSchool.push({ schoolName: '--Chưa chọn---', schoolCode: ''});
    // xu ly
    this.ncbService.getListHpSchool(null).then((result) => {
      setTimeout(() => {
        const body = result.json().body.content;
        body.forEach(element => {
          this.listSchool.push({
            schoolName: ' - ' + element.schoolName,
            schoolCode: element.schoolCode
          });
        });
      }, 300);
    }).catch(err => {
      this.listSchool = [];
      this.toastr.error('Không lấy được dữ liệu trường học', 'Thất bại');
    });
  }

  /**Upload file excel */
  openModal(content) {
    this.modalOp = this.modalService.open(content);
  }

  closeModal() {
      this.modalOp.close();
  }
  changePage(page: number) {
    this.re_search.page = page;
    this.getListData(this.re_search);
  }
  changePageSize() {
    this.re_search.page = 0;
    this.getListData(this.re_search);
  }
  onUploadFile(event) {
      const fileList: FileList = event.files;
      if (fileList.length > 0) {
          this.fileExcel.file = fileList[0];
          this.fileExcel.name = fileList[0].name;
          this.fileExcel.size = fileList[0].size;
      }
  }
    onUploadServer() {
      if (this.fileExcel.file) {
          this.temp.loading = true;
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(this.fileExcel.file);
          fileReader.onload = (e) => {
              this.arrayBuffer = fileReader.result;
              const data = new Uint8Array(this.arrayBuffer);
              const arr = new Array();
              for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
              const bstr = arr.join('');
              const workbook = XLSX.read(bstr, { type: 'binary' });
              const first_sheet_name = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[first_sheet_name];
              console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
              const arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
              this.filelist = arraylist;
              this.ncbService
                  .createHpFaculty(arraylist)
                  .then((result) => {
                      if (result.status === 200) {
                          if (result.json().code === '00') {
                              this.toastr.success(
                                  'Thêm mới thành công',
                                  'Thành công!'
                              );
                              setTimeout(() => {
                                  this.router.navigateByUrl('/faculties');
                              }, 500);
                              this.onSearch(this.re_search);
                          } else if (result.json().code === '909') {
                              this.toastr.error('Dữ liệu đã tồn tại', 'Thất bại!');
                          } else {
                              this.toastr.error('Thêm mới thất bại', 'Thất bại!');
                          }
                      }
                  })
                  .catch((err) => {
                      this.toastr.error(err.json().description, 'Thất bại!');
                  });
          };
          this.temp.loading = false;
          this.closeModal();
      }
  }
}
