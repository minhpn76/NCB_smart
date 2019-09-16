import { Injectable } from '@angular/core';
import { AppSettings} from '../app.settings';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment.prod';
const API_URL = environment.apiUrl;


@Injectable()
export class NCBService {

  constructor(
      private auth: AuthService
  ) { }

  getListBranch(params): Promise<any> {
    const url =  `${API_URL}/branch/getAll`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  getListTransaction(params): Promise<any> {
    const url =  `${API_URL}/transaction/getAll`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  getListRole(): Promise<any> {
    const url =  `${API_URL}/role/get-roles`;
    return this.auth.authRequest({ url: url, method: 'GET'});
  }
  searchUser(params): Promise<any> {
    const url =  `${API_URL}/user/searchUser`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  getListUser(params): Promise<any> {
    const url =  `${API_URL}/user/get-listUser`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  createUser(data): Promise<any> {
    const url =  `${API_URL}/user/createUser`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  getListProvince(params): Promise<any> {
    const url = `${API_URL}/city/getAll`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  /**
   * search city
   *
   * @param cityCode,cityName,status
   * @return city
   *
   */
  searchProvince(params): Promise<any> {
    const url = `${API_URL}/city/searchCity`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  /**
   *
   * create new city
   *
   * @body cityCode, cityName, status
   * @return city new
   *
   */
  createProvince(body): Promise<any> {
    const url = `${API_URL}/city/createCity`;
    return this.auth.authRequest({ url: url, data: body, method: 'POST'});
  }
  /**
   * search bank tranfer
  */
  searchBankTranfer(params): Promise<any> {
    const url = `${API_URL}/bank-transfer/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  createBankTranfer(body): Promise<any> {
    const url = `${API_URL}/bank-transfer/create`;
    return this.auth.authRequest({ url: url, data: body, method: 'POST', application: true});
  }
  detailBankTranfer(params): Promise<any> {
    const url = `${API_URL}/bank-transfer/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  updateBankTranfer(data): Promise<any> {
    const url = `${API_URL}/bank-transfer/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  deleteBankTranfer(params): Promise<any> {
    const url = `${API_URL}/bank-transfer/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE'});
  }
  getListProvider(params): Promise<any> {
    const url = `${API_URL}/provider/getAll`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  searchProvider(params): Promise<any> {
    const url = `${API_URL}/provider/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  /**
   *
   * create new branch
   *
   * @body branchCode, branchName, branchId
   * @return branch new
   *
   */
  createBranch(body): Promise<any> {
    const url = `${API_URL}/ncb-branch/create`;
    return this.auth.authRequest({ url: url, data: body, method: 'POST', application: true});
  }
  /**
   *
   * create new provider
   *
   * @body providerId, providerCode, providerId, providerName, serviceCode, providerPartner
   * @return city new
   *
   */
  createProvider(body): Promise<any> {
    const url = `${API_URL}/provider/create`;
    return this.auth.authRequest({ url: url, data: body, method: 'POST', application: true});
  }
  detailProvider(params): Promise<any> {
    const url = `${API_URL}/provider/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  updateProvider(data): Promise<any> {
    const url = `${API_URL}/provider/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  deleteProvider(params): Promise<any> {
    const url = `${API_URL}/provider/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE'});
  }
  searchBranch(params): Promise<any> {
    const url = `${API_URL}/ncb-branch/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  detailBranch(params): Promise<any> {
    const url = `${API_URL}/ncb-branch/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  updateBranch(data): Promise<any> {
    const url = `${API_URL}/ncb-branch/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  deleteBranch(params): Promise<any> {
    const url = `${API_URL}/ncb-branch/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE'});
  }
  // quan ly anh the
  searchPayCard(params): Promise<any> {
    const url = `${API_URL}/par-card/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  createPayCard(body): Promise<any> {
    const url = `${API_URL}/par-card/create`;
    return this.auth.authRequest({ url: url, data: body, method: 'POST', application: true});
  }
  editPayCard(body): Promise<any> {
    const url = `${API_URL}/par-card/update`;
    return this.auth.authRequest({ url: url, data: body, method: 'PUT', application: true});
  }
  deletePayCard(body): Promise<any> {
    const url = `${API_URL}/par-card/delete`;
    return this.auth.authRequest({ url: url, param: body, method: 'DELETE'});
  }
  // @param prdcode
  detailPayCard(body): Promise<any> {
    const url = `${API_URL}/par-card/detail`;
    return this.auth.authRequest({ url: url, params: body, method: 'GET'});
  }
  // goi san pham khach hang su dung
  searchPackageUser(params): Promise<any> {
    const url = `${API_URL}/user-profile/searchUser`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET', application: true});
  }
  // quan ly thong tin khach hang
  searchProfileUser(params): Promise<any> {
    const url = `${API_URL}/user-profile/searchConsumer`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }
  // tham so tong dai
  /**
   *
   * search tham so thong dai
   *
   * @params paramNo, paramName, status
   * @return list
   *
   */
  searchParamCallCenter(params): Promise<any> {
    const url = `${API_URL}/param-manager/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET', application: true});
  }
  /**
   *
   * xoa tham so thong dai
   *
   * @params paramNo
   *
   */
  deleteParamCallCenter(params): Promise<any> {
    const url = `${API_URL}/param-manager/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE', application: true});
  }
  /**
   *
   * update tham so thong dai
   *
   * @body paramNo, paramName, paramValue, note, status
   *
   */
  updateParamCallCenter(data): Promise<any> {
    const url = `${API_URL}/param-manager/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * detail tham so thong dai
   *
   * @params paramNo
   *
   */
  detailParamCallCenter(params): Promise<any> {
    const url = `${API_URL}/param-manager/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET', application: true});
  }
  /**
   *
   * create tham so thong dai
   *
   * @body paramNo, paramName, paramValue, note, status
   *
   */
  createParamCallCenter(data): Promise<any> {
    const url = `${API_URL}/param-manager/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * quan ly dieu khoan su dung
   *
   * @body provisionName, status
   * @params paginator
   * @return list
   *
   */
  searchMBProvision(data): Promise<any> {
    const url = `${API_URL}/mb-provision/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * create quan ly dieu khoan su dung
   *
   * @body provisionName, provisionLink, status, id (bo)
   *
   */
  createMBProvision(data): Promise<any> {
    const url = `${API_URL}/mb-provision/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * update quan ly dieu khoan su dung
   *
   * @body provisionName, provisionLink, status
   *
   */
  updateMBProvision(data): Promise<any> {
    const url = `${API_URL}/mb-provision/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * detail quan ly dieu khoan su dung
   *
   * @params id
   *
   */
  detailMBProvision(params): Promise<any> {
    const url = `${API_URL}/mb-provision/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }

  /**
   *
   * delete quan ly dieu khoan su dung
   *
   * @params id
   *
   */
  deleteMBProvision(params): Promise<any> {
    const url = `${API_URL}/mb-provision/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE'});
  }
  /**
   *
   * quan ly mang luoi chi nhanh PGD
   *
   * @params brnCode, branchName, departCode, departName, status
   * @params paginator
   * @return list
   *
   */
  searchNcbBranch(data): Promise<any> {
    const url = `${API_URL}/ncb-branch/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * quan ly mang luoi chi nhanh
   *
   * @body brnCode, branchName, departCode, departName, address, phone, fax, longitude, latitude, urlImg, dao
   *
   */
  createNcbBranch(data): Promise<any> {
    const url = `${API_URL}/ncb-branch/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * update quan ly mang luoi
   *
   * @body brnCode, branchName, departCode, departName, address, phone, fax, latitude, longitude, urlImg, dao, status
   *
   */
  updateNcbBranch(data): Promise<any> {
    const url = `${API_URL}/ncb-branch/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * detail quan ly mang luoi
   *
   * @params departCode
   *
   */
  detailNcbBranch(params): Promise<any> {
    const url = `${API_URL}/ncb-branch/detail`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET'});
  }

  /**
   *
   * delete quan ly dieu khoan su dung
   *
   * @params departCode
   *
   */
  deleteNcbBranch(params): Promise<any> {
    const url = `${API_URL}/ncb-branch/delete`;
    return this.auth.authRequest({ url: url, params: params, method: 'DELETE'});
  }
  /**
   *
   * quan ly huong dan su dung
   *
   * @params serviceId, status
   * @params paginator
   * @return list
   *
   */
  searchNcbGuide(data): Promise<any> {
    const url = `${API_URL}/ncb-guideline/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * quan ly huong dan su dung - detail
   *
   * @params id
   * @params paginator
   * @return one item
   *
   */
  detailNcbGuide(data): Promise<any> {
    console.log('XASDAS');
    const url = `${API_URL}/ncb-guideline/detail`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * quan ly huong dan su dung - create
   *
   * @body serviceId, content, status
   * @return item
   *
   */
  createNcbGuide(data): Promise<any> {
    const url = `${API_URL}/ncb-guideline/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * quan ly huong dan su dung - update
   *
   * @body serviceId, content, status, id
   * @return item
   *
   */
  updateNcbGuide(data): Promise<any> {
    const url = `${API_URL}/ncb-guideline/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * quan ly huong dan su dung - delete
   *
   * @body id
   * @return item
   *
   */
  deleteNcbGuide(data): Promise<any> {
    const url = `${API_URL}/ncb-guideline/delete`;
    return this.auth.authRequest({ url: url, params: data, method: 'DELETE', application: true});
  }
  /**
   *
   * QA - get
   *
   * @params productCode, productName, status
   * @return item
   *
   */
  searchNcbQA(data): Promise<any> {
    const url = `${API_URL}/ncb-qa/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * QA - detail
   *
   * @params id
   * @return item
   *
   */
  detailNcbQA(data): Promise<any> {
    const url = `${API_URL}/ncb-qa/detail`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * QA - create
   *
   * @body productCode, productName,  question, answer
   * @return item
   *
   */
  createNcbQA(data): Promise<any> {
    const url = `${API_URL}/ncb-qa/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * QA - update
   *
   * @body productCode, productName,  question, answer, id, status
   * @return item
   *
   */
  updateNcbQA(data): Promise<any> {
    const url = `${API_URL}/ncb-qa/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * quan ly huong dan su dung - delete
   *
   * @body id
   * @return item
   *
   */
  deleteNcbQA(data): Promise<any> {
    const url = `${API_URL}/ncb-qa/delete`;
    return this.auth.authRequest({ url: url, params: data, method: 'DELETE', application: true});
  }
  /**
   *
   * feed back - get
   *
   * @params productCode, productName, status
   * @return item
   *
   */
  searchNcbFeedBack(data): Promise<any> {
    const url = `${API_URL}/ncb-feedback/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * Feed back - detail
   *
   * @params id
   * @return item
   *
   */
  detailNcbFeedBack(data): Promise<any> {
    const url = `${API_URL}/ncb-feedback/detail`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * Feedback - create
   *
   * @body productCode, productName,  type, email, phone, name, address, description
   * @return item
   *
   */
  createNcbFeedBack(data): Promise<any> {
    const url = `${API_URL}/ncb-feedback/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * Feedback - update
   *
   * @body productCode, productName,  type, email, phone, name, address, description, status, id
   * @return item
   *
   */
  updateNcbFeedBack(data): Promise<any> {
    const url = `${API_URL}/ncb-feedback/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * Feedback - delete
   *
   * @body id
   * @return item
   *
   */
  deleteNcbFeedBack(data): Promise<any> {
    const url = `${API_URL}/ncb-feedback/delete`;
    return this.auth.authRequest({ url: url, params: data, method: 'DELETE', application: true});
  }
  /**
   *
   * register service - get
   *
   * @params comp_code, id_card, type, service, status, from_date, to_date
   * @paginator
   * @return item
   *
   */
  searchRegisterService(data): Promise<any> {
    const url = `${API_URL}/service-register/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * register service - detail
   *
   * @params id
   * @paginator
   * @return item
   *
   */
  detailRegisterService(id): Promise<any> {
    const url = `${API_URL}/service-register/${id}/detail`;
    return this.auth.authRequest({ url: url, method: 'GET', application: true});
  }
  /**
   *
   * register service - update
   *
   * @params id
   * @body comp_code, comp_name, status, comment, user_id
   * @return item
   *
   */
  updateRegisterService(service_id, data): Promise<any> {
    const url = `${API_URL}/service-register/${service_id}/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PATCH', application: true});
  }
  /**
   *
   * banner - get
   *
   * @params bannerCode, bannerName, status
   * @return item
   *
   */
  searchNcbBanner(data): Promise<any> {
    const url = `${API_URL}/ncb-banner/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * banner - detail
   *
   * @params id
   * @return item
   *
   */
  detailNcbBannner(data): Promise<any> {
    const url = `${API_URL}/ncb-banner/detail`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  /**
   *
   * bannner - create
   *
   * @body bannerCode, bannerName,  linkImg, linkUrlVn, linkUrlEn
   * @return item
   *
   */
  createNcbBanner(data): Promise<any> {
    const url = `${API_URL}/ncb-banner/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  /**
   *
   * Bannner - update
   *
   * @body bannerCode, bannerName,  linkImg, linkUrlVn, linkUrlEn
   * @return item
   *
   */
  updateNcbBanner(data): Promise<any> {
    const url = `${API_URL}/ncb-banner/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PUT', application: true});
  }
  /**
   *
   * banner - delete
   *
   * @body id
   * @return item
   *
   */
  deleteNcbBanner(data): Promise<any> {
    const url = `${API_URL}/ncb-banner/delete`;
    return this.auth.authRequest({ url: url, params: data, method: 'DELETE', application: true});
  }
  detailUser(data): Promise<any> {
    const url =  `${API_URL}/user/${data}/detail`;
    return this.auth.authRequest({ url: url, method: 'GET', application: true});
  }
  updateUser(data): Promise<any> {
    const url =  `${API_URL}/user/update-user`;
    return this.auth.authRequest({ url: url, data: data, method: 'PATCH', application: true});
  }
  updateStatusUser(data): Promise<any> {
    const url =  `${API_URL}/user/update-user-status`;
    return this.auth.authRequest({ url: url, data: data, method: 'PATCH', application: true});
  }
  deleteUser(id): Promise<any> {
    const url =  `${API_URL}/user/${id}/delete`;
    return this.auth.authRequest({ url: url, method: 'DELETE', application: true});
  }
  updatePassword(data): Promise<any> {
    const url =  `${API_URL}/user/change-password`;
    return this.auth.authRequest({ url: url, data: data, method: 'PATCH', application: true});
  }
  getBranchs(): Promise<any> {
    const link = '/ncb-branch/branch/activated-list';
    const url =  `${API_URL}${link}`;
    return this.auth.authRequest({ url: url, method: 'GET', application: true});
  }
  getPGD(data): Promise<any> {
    const link = '/ncb-branch/search';
    const url =  `${API_URL}${link}`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  // notify
  searchNotify(data): Promise<any> {
    const url = `${API_URL}/notify/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  // provider, type, error, msg_Code, msg_Code_1, mes_Vn, mes_En
  createNotify(data): Promise<any> {
    const url =  `${API_URL}/notify/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  detailNotify(data): Promise<any> {
    const url = `${API_URL}/notify/detail`;
    return this.auth.authRequest({ url: url, params: data, method: 'POST'});
  }
  // provider, type, error, msg_Code
  updateNotify(data): Promise<any> {
    const url =  `${API_URL}/notify/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  deleteNotify(data): Promise<any> {
    const url = `${API_URL}/notify/delete`;
    return this.auth.authRequest({ url: url, params: data, method: 'POST', application: true});
  }
  // roles
  searchRoles(data): Promise<any> {
    const url = `${API_URL}/role/search`;
    return this.auth.authRequest({ url: url, params: data, method: 'GET', application: true});
  }
  // provider, type, error, msg_Code, msg_Code_1, mes_Vn, mes_En
  createRoles(data): Promise<any> {
    const url =  `${API_URL}/role/create`;
    return this.auth.authRequest({ url: url, data: data, method: 'POST', application: true});
  }
  // provider, type, error, msg_Code
  updateRoles(data): Promise<any> {
    const url =  `${API_URL}/role/update`;
    return this.auth.authRequest({ url: url, data: data, method: 'PATCH', application: true});
  }
  detailRoles(value): Promise<any> {
    const url = `${API_URL}/role/` + value + `/detail`;
    return this.auth.authRequest({ url: url, method: 'GET', application: true});
  }
  // get all PGD
  getListPGD(): Promise<any> {
    const url = `${API_URL}/ncb-branch/depart/activated-list`;
    return this.auth.authRequest({ url: url, method: 'GET', application: true});
  }
  // goi sp
  searchPackage(params): Promise<any> {
    const url = `${API_URL}/function/search`;
    return this.auth.authRequest({ url: url, params: params, method: 'GET', application: true});
  }
  // up file parcard
  uploadFilePayCard(file): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('img', file, file.name);
    const url = `${API_URL}/img/uploadFile`;
    return this.auth.authRequestFile({ url: url, data: formData, method: 'POST' });
  }
  // delete file
  deleteFilePayCard(payload) {
    const url = `${API_URL}/img/deleteFile`;
    return this.auth.authRequest({ url: url, param: payload, method: 'DELETE' });
  }
}
