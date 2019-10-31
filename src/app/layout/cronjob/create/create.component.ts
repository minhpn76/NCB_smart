import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { NCBService } from '../../../services/ncb.service';
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
  encapsulation: ViewEncapsulation.Native
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

  constructor(
    private ncbService: NCBService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public helper: Helper
  ) {
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      timeStart: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      timeEnd: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    });
  }
  get Form() { return this.dataForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.searchRoles(this.dataForm.value).then((result) => {

    });
  }
}
