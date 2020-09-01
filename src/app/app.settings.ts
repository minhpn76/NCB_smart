import { timestamp } from 'rxjs/operators';

export class AppSettings {
    public static API_NCB_SMART = '/NCB-smart';
    public static UPLOAD_IMAGE = {
        file_size: 10 * 1024 * 1024,
        file_ext: 'image/jpg,image/png,image/jpeg,image/gif',
        height: 300,
        width: 300
    };
    // isC: CREATE
    // isR: READ
    // isU: UPDATE
    // isD: DELETE
    // isA: approved
    public static listRoles = [
        {
            code: 'NGUOI_DUNG',
            name: 'Người dùng',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'QUAN_TRI'
        },
        {
            code: 'PHAN_QUYEN',
            name: 'Phân quyền',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'QUAN_TRI'
        },
        {
            code: 'CHI_NHANH',
            name: 'Chi nhánh',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'GIAO_DICH'
        },
        {
            code: 'NGH_CHUYEN_KHOAN',
            name: 'Ngân hàng chuyển khoản',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'GIAO_DICH'
        },
        {
            code: 'NHA_CC_DICH_VU',
            name: 'Nhà cung cấp dịch vụ',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'GIAO_DICH'
        },
        {
            code: 'HINH_THE',
            name: 'Hình ảnh, phôi thẻ',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'THAM_SO'
        },
        {
            code: 'GOI_SP',
            name: 'Gói sản phẩm',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'GOI_KH_SU_DUNG',
            name: 'Gói khách hàng sử dụng',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'DV_KH_DK',
            name: 'Dịch vụ khách hàng đăng ký',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'KHUYEN_MAI',
            name: 'Khuyến mãi, ưu đãi',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'TT_KH',
            name: 'Thông tin khách hàng',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'SO_TONG_DAI',
            name: 'Số tổng đài',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'THAM_SO'
        },
        {
            code: 'NOTIFY',
            name: 'Notify(in App)',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'THAM_SO'
        },
        {
            code: 'CRONJOB',
            name: 'Cấu hình Schedule',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'THAM_SO'
        },
        {
            code: 'DIEU_KHOAN',
            name: 'Điều khoản sử dụng',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'TRA_CUU'
        },
        {
            code: 'MANG_LUOI_CN',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            name: 'Mạng lưới chi nhánh',
            menu: 'TRA_CUU'
        },
        {
            code: 'HD_SU_DUNG',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            name: 'Hướng dẫn sử dụng',
            menu: 'TRA_CUU'
        },
        {
            code: 'THANH_PHO',
            name: 'Thành phố',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'TRA_CUU'
        },
        {
            code: 'TT_QA',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            name: 'Thông tin Q&As',
            menu: 'TRA_CUU'
        },
        {
            code: 'GOP_Y_LOI',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            name: 'Góp ý - lỗi',
            menu: 'TRA_CUU'
        },
        {
            code: 'BANNER',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            name: 'Banner',
            menu: 'TRA_CUU'
        },
        {
            code: 'RESET_PASSWORD',
            name: 'Người dùng',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'QUAN_TRI'
        },
        {
            code: 'QR_SERVICE',
            name: 'Dịch vụ thanh toán',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'QR_COUPON',
            name: 'Dịch vụ thanh toán giảm giá',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        },
        {
            code: 'QR_MERCHANT',
            name: 'Nhà cung cấp dịch vụ QR',
            isAll: false,
            isC: false,
            isR: false,
            isU: false,
            isD: false,
            isA: false,
            menu: 'KHACH_HANG'
        }
        
    ];
    public static getListRoles() {
        const getListRoles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : '';
        return getListRoles;
    }
}
