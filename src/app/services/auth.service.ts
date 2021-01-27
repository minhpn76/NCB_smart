import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Response, Http } from '@angular/http';
import { AppSettings } from '../app.settings';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
const API_URL = environment.apiUrl;

declare const fbq: any;

@Injectable()
export class AuthService {
    res: any;
    my: any = new Date();
    public currentURL = '';

    constructor(
        private http: Http,
        public router: Router,
        private translate: TranslateService,
        public toastr: ToastrService,
    ) { }

    public getToken(): string {
        return localStorage.getItem('token');
    }

    login(user): Promise<any> {
        const url =  `${API_URL}/login`;
        return this.authRequest({ url: url, data: user, method: 'POST', dont_auth: true, application: true }, 1);
    }
    register(user): Promise<any> {
        const url = `${API_URL}/sign-up/`;
        return this.authRequest({ url: url, data: user, method: 'POST', dont_auth: true, application: true }, 1);
    }

    authRequest(config, showError = 0): Promise<any> {
        const param_header = {
            'Access-Control-Allow-Origin': '*'
        };

        if (config.is_file === true || config.is_file) {
            param_header['Content-Type'] = 'multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
        } else if (config.application === true || config.application) {
            param_header['Content-Type'] = 'application/json; charset=utf-8';
        } else {
            param_header['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        }
        if (config.dont_auth === false || !config.dont_auth) {
            param_header['Authorization'] = this.getToken();
        }
        const headers: Headers = new Headers(param_header);
        if (config.method === 'GET') {
            for (const prop in config.params) {
                if (config.params[prop] === undefined || config.params[prop].toString() === 'undefined') {
                    delete config.params[prop];
                } else {
                    if (config.params[prop] && typeof config.params[prop] === 'string') {
                        config.params[prop] = config.params[prop].trim();
                    }
                }
            }
            this.res = this.http.get(config.url, { headers: headers, params: config.params }).pipe(timeout(20000)).toPromise();
        } else {
            if (config.method === 'POST') {
                this.res = this.http.post(config.url, config.data, { headers: headers, params: config.params }).pipe(timeout(20000)).toPromise();
            } else {
                if (config.method === 'PUT') {
                    this.res = this.http.put(config.url, config.data, { headers: headers, params: config.params }).pipe(timeout(20000)).toPromise();
                } else {
                    if (config.method === 'DELETE') {
                        this.res = this.http.delete(config.url, { headers: headers, params: config.params }).pipe(timeout(20000)).toPromise();
                    } else {
                        if (config.method === 'PATCH') {
                            this.res = this.http.patch(config.url, config.data, { headers: headers, params: config.params }).pipe(timeout(20000)).toPromise();
                        }
                    }
                }
            }
        }

        this.res.then((result) => {

        }).catch((err) => {
            if (err.status === 401) {
                const profile = JSON.parse(localStorage.getItem('profile'));
                if (profile != null) {
                    localStorage.clear();
                    // get Current URL
                    this.currentURL = window.location.href; // this.router.url;
                    this.router.navigateByUrl('/login?return_url=' + this.currentURL);
                }
            } else {
                // if (err.status !== 500 && err.status !== 502 && err.status !== 404) {
                //     if (showError === 0) {
                //         // tslint:disable-next-line:max-line-length
                //         this.toastr.error('Lỗi xảy ra khi xác thực người dùng hệ thống', 'Lỗi hệ thống!');
                //     } else {
                //         this.toastr.error('Lỗi xảy ra khi xác thực người dùng hệ thống', 'Lỗi hệ thống!');
                //     }
                // } else {
                //     this.toastr.error('Lỗi xảy ra khi xác thực người dùng hệ thống', 'Lỗi hệ thống!');
                // }
            }
        });
        return this.res;
    }
    authRequestFile(config): Promise<any> {
        const param_header = {};
        if (config.dont_auth === false || !config.dont_auth) {
            param_header['Authorization'] = this.getToken();
        }
        const headers: Headers = new Headers(param_header);
        if (config.method === 'GET') {
            this.res = this.http.get(config.url, { headers: headers, params: config.params }).toPromise();
        } else {
            if (config.method === 'POST') {
                this.res = this.http.post(config.url, config.data, { headers: headers, params: config.params }).toPromise();
            } else {
                if (config.method === 'PUT') {
                    this.res = this.http.put(config.url, config.data, { headers: headers, params: config.params }).toPromise();
                } else {
                    if (config.method === 'DELETE') {
                        this.res = this.http.delete(config.url, { headers: headers, params: config.params }).toPromise();
                    }
                }
            }
        }
        this.res.then((result) => {
        }).catch((err) => {
            if (err.status === 401) {
                const profile = JSON.parse(localStorage.getItem('profile'));
                if (profile != null) {
                    localStorage.clear();
                    // get Current URL
                    this.currentURL = window.location.href; // this.router.url;
                    this.router.navigateByUrl('/login?return_url=' + this.currentURL);
                }
            } else {
                if (err.status !== 500 && err.status !== 502 && err.status !== 404) {
                    this.toastr.error('Lỗi xảy ra khi xác nhận người dùng gủi file', 'Lỗi hệ thống!');
                } else {
                    this.toastr.error('Lỗi xảy ra khi xác nhận người dùng gủi file', 'Lỗi hệ thống!');
                }
            }
        });
        return this.res;
    }

}
