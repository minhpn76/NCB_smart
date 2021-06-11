import { Component, OnInit } from '@angular/core';
import { NCBService } from '../../../services/ncb.service';
import { ToastrService } from 'ngx-toastr';
import { OrderPipe } from 'ngx-order-pipe';
import { Helper } from '../../../helper';

@Component({
  selector: 'app-cauhinhsodu',
  templateUrl: './cauhinhsodu.component.html',
  styleUrls: ['./cauhinhsodu.component.scss'],
  providers: [NCBService, Helper],
})
export class CauhinhsoduComponent implements OnInit {

  constructor( private ncbService: NCBService,
    public toastr: ToastrService,
    private orderPipe: OrderPipe
    ) { }
  listData: any[];
  listPageSize: any = [10, 20, 30, 40, 50];
  search_keyword: any = '';
  isSearch: any = false;
  isProcessLoad: any = 0;
  totalSearch: any = 0;

  ngOnInit() {
    this.onSearch();
  }
  onSearch() {
    this.listData = [];
    this.isProcessLoad = 1;
    this.ncbService.getlistPushContent().then(result => {
      setTimeout(() => {
        const body = result.json().body;
        this.listData = body;
        this.totalSearch = body.totalElements;
        this.isProcessLoad = 0;
      }, 300);
    }).catch(err => {
      this.listData = [];
      this.toastr.error('Không lấy được danh sách dữ liệu. Vui lòng liên hệ khối Công nghệ để được hỗ trợ', 'Lỗi hệ thống!');
    });
  }
}
