import { Component, OnInit } from '@angular/core';
import { NCBService } from '../../../services/ncb.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import { AppSettings } from '../../../app.settings';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { HocSinh } from '../hoc-sinh';
import * as XLSX from 'xlsx';
import { config } from 'rxjs';
import { ExcelService } from '../../../services/excel.service';
import { element } from 'protractor';
import { Headers } from '@angular/http';
type AOA = any[][];

@Component({
  selector: 'app-uploadtuition',
  templateUrl: './uploadtuition.component.html',
  styleUrls: ['./uploadtuition.component.scss'],
  providers: [NCBService, Helper, ExcelService, NgbModal]
})
export class UploadtuitionComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    private excelService: ExcelService,
    public router: Router,
    private helper: Helper,
    public location: Location
  ) {
    this.listRoles = AppSettings.listRoles;
    // Đoạn này dung để khi them moi thanh cong thì hcuyen ve trang danh sach
   if (localStorage.getItem('redirect') === 'true') {
     this.router.navigateByUrl('/uploadtuition');
   }
   }

  dataForm: FormGroup;
  submitted = false;
  isErrAll = true;
  errAll = 0;
  errPage = 0;
  dataError: Array<{
    STT: Number ;
    MATRUONG: '' ;
     TENTRUONG: '';
    MAKHOA: '';
    TENKHOA: '';
    MALOP: '';
      TENLOP: '';
        MAHOCSINH: '';
           TENHOCSINH: '';
           KYTHANHTOAN: '';
            GHICHU: '';
  }> = [];
  dataSchoolStudent: Array<String> = [];
  listRoles: any;
  /*Phan trang */
  re_search = {
    size: 10,
    page: 1,
    previous_page: 0
  };
  listPageSize: any = [10, 20, 30, 40, 50];
  totalSearch: any;
  /*Ket thuc phan trang*/
  // @Input() listRoles: any = AppSettings.listRoles;
  tempRole: any;
  obj: any = {};
  role: any = {
    create: null,
    delete: null,
    read: null,
    update: null,
  };
  data: any[][];
  dataStudent: any[][];
  dataJson: any;
  worksheet: any;
  storeData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  listSchool: any[];
  schoolCode = '';
  listClass: any[];
  reseachClass = {
    schoolCode: '',
    status: 1,
    size: 1000,
    page: 1,
    previous_page: 0
  };
  listFaculty: any[];
  reseachFaculty = {
    schoolCode: '',
    status: 1,
    size: 1000,
    page: 1,
    previous_page: 0
  };
  testapi;
  listCost: any;
  fileExcel: any = {
    file: File,
    path: null,
    name: ''
  };
  temp: any = {
    loading: false
  };
  headers: any = [
    'STT',
    'MATRUONG*',
    'TENTRUONG',
    'MAKHOA',
    'TENKHOA',
    'MALOP*',
    'TENLOP*',
    'MAHOCSINH*',
    'TENHOCSINH*',
    'KYTHANHTOAN*',
    'GHICHU',
  ];
  loadPage(page: number)  {
    const page_number = page;
    if (page_number !== this.re_search.previous_page) {
      this.re_search.page = page_number;
      this.re_search.previous_page = page_number;
      this.XuLyPage();
    }
  }
  private XuLyPage() {
    this.errPage = 0;
    const end = (this.re_search.page) * this.re_search.size;
    if (this.re_search.previous_page === 0) {this.re_search.previous_page = 1; }// truong hop page =1
    const start = (this.re_search.previous_page - 1) * this.re_search.size;
    const part = this.data.slice(start, end);
    this.dataStudent = part;
  }
  changePageSize() {
    this.re_search.page = 1;
    this.XuLyPage();
  }
/*chọn học phí cần đóng */
  SelectCost(cost) {
    if (this.headers.find(m => m === cost) === cost) {
      console.log('remove->' + cost);
      const index =  this.headers.indexOf(cost);
      if (index > -1) {
        this.headers.splice(index, 1);
      }
      // this.headers.remove(cost);
    } else {
      console.log('add->' + cost);
       this.headers.push(cost);
    }

  }
  /*export file */
  export() {
    if (this.headers.length < 12) {
      alert('Vui lòng chọn các khoản phí cần đóng!');
    }
    const targetTableElm = document.getElementById('DataTable');
    const wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: 'page1' });
    XLSX.writeFile(wb, `TemplateHocPhi.xlsx`);
   // this.excelService.exportAsExcelFile(this.headers, 'TemplateHocPhi');
  }
  /*Doc file & xu li file */
  GetData(event) {
    /*Read excel */
    this.errAll = 0; this.errPage = 0; this.isErrAll = true;
    this.onFileChange(event, this.showdata);
    this.dataError = [];
    this.dataSchoolStudent = [];
    /*To json */

  }
  resetTable() {
    // this.fileUploaded = document.getElementById('datafile').files[0];
    this.readExcel();
  }
  readExcel() {
    const readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      const data = new Uint8Array(this.storeData);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
    };
    readFile.readAsArrayBuffer(this.fileUploaded);

  }
  XulyMau(dataArr) {
    let check = 1;
    if (dataArr[0].length !== this.headers.length) {
      alert('File template không đúng định dạng!');
    }
    for (let i = 1; i < this.headers.length; i++) {
      const filde = dataArr[0][i].toLowerCase().replace('*', '');
      console.log(filde);
      if (!filde.includes(this.headers[i].toLowerCase().replace('*', ''))) {
        alert('Thiếu thông tin trường ' + this.headers[i]);
        if (this.isErrAll) {this.errAll = this.errAll + 1; }

        check = 0;
     }
    }
    return check;
  }
  onFileChange(evt: any, myCallback) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
        this.dataStudent = null; this.errAll = 0; this.errPage = 0;
        this.isErrAll = true; throw new Error('Cannot use multiple files');
       }
    /*Lưu phục vụ việc upload */
    const fileList: FileList = target.files;
    if (fileList.length > 0) {
      this.fileExcel.file = fileList[0];
      this.fileExcel.name = fileList[0].name;
    }
     /*Xử lý hiển thị */
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      /*Xử lý xem đúng mẫu hay không */

      if (this.XulyMau(this.data.slice(0, 1)) === 1) {
            this.data.slice(1).forEach(row => {
              this.onCheckHocPhi(row);
              this.onCheckSchool(row[1]);
              this.onCheckClass(row[5]);
              if (row[7] || row[8]) {
                this.errPage = this.errPage + 1;
              }
              if (row[1] !== undefined &&  row[7] !== undefined) {
              const tem = row[1].toString().trim() + row[7].toString().trim() ;
              if (this.dataSchoolStudent !== null) {
                const check = this.dataSchoolStudent.find(e => e.toLowerCase() === tem.toString().toLowerCase());
                if (check !== undefined) {
                  this.dataError.push({STT: row[0],
                    MATRUONG: row[1],
                    TENTRUONG: row[2],
                    MAKHOA: row[3],
                    TENKHOA: row[4],
                    MALOP: row[5],
                    TENLOP: row[6],
                    MAHOCSINH: row[7],
                    TENHOCSINH: row[8],
                    KYTHANHTOAN: row[9],
                    GHICHU: row[10]});
                } else {
                  if (tem !== undefined) {
                    this.dataSchoolStudent.push(tem.toString());
                  }
                }
              } else if (tem !== undefined) {
                this.dataSchoolStudent.push(tem.toString());
              }
            }
          });
         // bỏ đi herder của file excell
         this.data = this.data.slice(1);
        /*Set page and load data */
        this.totalSearch = this.data.length;
        // Load dữ liệu lên trang
        this.XuLyPage();
        this.isErrAll = false;
        // console.log(this.datapost);
         console.log(JSON.stringify(this.data.shift()));
         console.log(this.dataSchoolStudent);
      }

    };
    reader.readAsBinaryString(target.files[0]);
  }
  /**Ket thuc xu li file */
  ngOnInit() {
      this.getCost();
      this.getSchools();

  }
  showdata(datas) {
    // alert(datas);
  }
  onCheckHocPhi(data) {
    let check = false;
    for (let i = 11; i < this.headers.length; i++) {
      // console.log(this.headers.length + '|' + this.headers[i] + '=>' + data[i]);
      const validate = /^(\d+|\d{1,3}(,\d{3})*)$/.test(data[i]);
      if (this.isEmpty(data[i])) {
        // if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
        check = true;
      } else {
        if (!validate) {
           if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
          check = true;
        }
      }
    }
    return check;
  }
  onCheckSchool(data) {
    if (data !== undefined) {
      // console.log('school=' + data + '|' + this.schoolCode);
      if ((this.schoolCode.toLowerCase() === data.toLowerCase())) {
        return false;
      } else {
        if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
        return true;
      }
    }

  }
  onCheckClass(data) {
    if (data !== undefined) {
      const check = this.listClass.find(e => e.classCode.toLowerCase() === data.toString().toLowerCase());
      if (check === undefined) {
        if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
        return true;
      } else {
        return false;
      }
    }

  }
  checkStudent(data) {
    if (data[7]) {
      const check = this.dataSchoolStudent.find(e => e.toLowerCase() === data[7].toString().toLowerCase());
      if (check === undefined) {
       if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
        this.dataError.push(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);

      }
    }
  }
  checkFaculty(data) { // tuition
    if (data !== undefined) {
      const check = this.listFaculty.find(e => e.facultyCode.toLowerCase() === data.toString().toLowerCase());
      if (check === undefined) {
        if (this.isErrAll) {this.errAll = this.errAll + 1; } else { this.errPage = this.errPage + 1; }
        return true;
      } else {
        return false;
      }
    }
  }
  getCost() {
    this.ncbService.getListHpCosts(null).then(result => {
      setTimeout(() => {
        const body = result.json().body.content;
        this.listCost = body;
      }, 300);
    }).catch(err => {
      this.listCost = [];
    });
  }
  getSchools() {
    this.ncbService.getListHpSchool(null).then((result) => {
      const body = result.json().body.content;
      this.listSchool = body;
    }).catch(err => {
      this.toastr.error(err.json().decription, 'Thất bại!');
    });
  }
  getClass(idschool) {
    this.reseachClass.schoolCode = idschool;
    if ( this.reseachClass.schoolCode === '') {
      return null;
    }
    this.ncbService.getListHpClass(this.reseachClass).then(result => {
      setTimeout(() => {
        const body = result.json().body.content;
        this.listClass = body;
      }, 300);
    }).catch(err => {
      this.listClass = [];
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  getFaculties(idschool) {
    this.reseachFaculty.schoolCode = idschool;
    if ( this.reseachFaculty.schoolCode === '') {
      return null;
    }
    this.ncbService.getListHpFaculties(this.reseachClass).then(result => {
      setTimeout(() => {
        const body = result.json().body.content;
        this.listFaculty = body;
      }, 300);
    }).catch(err => {
      this.listFaculty = [];
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
  isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
  }
  onSend() {

      if (this.fileExcel.file) {
        this.temp.loading = true;
         const file: File = this.fileExcel.file;
        this.ncbService.upFileExcelHpTuition(file).then((result) => {
          if (result.status === 200) {
            if (result.json().code !== '00') {
              this.toastr.error(result.json().message, 'Thất bại!');
            } else {
              this.toastr.success('Upload dữ liệu thành công', 'Thành công!');
              this.temp.loading = false;
              setTimeout(() => {
              }, 3000);
            }
          } else {
            this.toastr.error(result.message, 'Thất bại!');
          }

        }).catch((err) => {
          this.toastr.error(err.json().message, 'Thất bại!');

        });
      }
    // } else {
    //   alert('Các thông tin chưa được hoàn thiện');
    // }

  }
  resetPage() {
    window.location.reload();
  }
}
