import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
    constructor() {}
    order = 'name';
    reverse = false;

    search: any = {
        title: '',
        status: '',
        approveStatus: '',
        type: '',
        size: 10,
        page: 0,
        previous_page: 0
    };
    listData: any = [
        {
            name: 'name1',
            value: 'value1',
            type: 'type1',
            sort: 'sort',
            description: 'description1',
            code: 'code1',
        },
        {
            name: 'name1',
            value: 'value1',
            type: 'type1',
            sort: 'sort',
            description: 'description1',
            code: 'code1',
        },
        {
            name: 'name1',
            value: 'value1',
            type: 'type1',
            sort: 'sort',
            description: 'description1',
            code: 'code1',
        },
        {
            name: 'name1',
            value: 'value1',
            type: 'type1',
            sort: 'sort',
            description: 'description1',
            code: 'code1',
        },
    ];

    listStatus: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'active',
            code: 'A',
        },
        {
            name: 'Deactive',
            code: 'D',
        },
    ];

    listStatusApproved: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Đã phê duyệt',
            code: '1',
        },

        {
            name: 'Chưa phê duyệt',
            code: '0',
        },
    ];
    listType: any = [
        {
            name: 'Tất cả',
            code: '',
        },
        {
            name: 'Android',
            code: '0',
        },
        {
            name: 'IOS',
            code: '1',
        },
    ];

    ngOnInit() {}

    keyDownFunction() {
        alert('SUCCESS!! :-)');
    }

    keyDownFunctionSearch() {
        alert('SUCCESS!! :-)');
    }

    onSearch() {
        alert('Search');
    }
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }

        this.order = value;
    }
    deleteItem() {
        alert('deleted');
    }
}
