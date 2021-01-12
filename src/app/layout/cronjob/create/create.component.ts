import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../../app.settings';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Helper } from '../../../helper';
import { CronOptions } from 'cron-editor/cron-editor';

@Component({
  selector: 'cronjob',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [NCBService, Helper],
  // encapsulation: ViewEncapsulation.Native
  encapsulation: ViewEncapsulation.None
  // encapsulation: ViewEncapsulation.ShadowDom
  // encapsulation: ViewEncapsulation.Emulated
})
export class CreateComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  public cronExpression = '4 3 2 12 1/1 ? *';
  public isCronDisabled = false;



  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '10:00:00',
    use24HourTime: true,

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,

    hideSeconds: false,
    removeSeconds: false,
    removeYears: false
  };
  userInfo: any = [];

  constructor(
    private ncbService: NCBService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public helper: Helper
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('profile')) ? JSON.parse(localStorage.getItem('profile')) : '';
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      timeStart: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      timeEnd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      createBy: [this.userInfo.userName],
    });
  }
  get Form() { return this.dataForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.createConfigCronjob(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm thành công', 'Thành công!');
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/config-cronjob');
  }
}
