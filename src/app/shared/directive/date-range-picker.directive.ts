import {
  Directive,
  AfterViewInit,
  ElementRef,
  NgZone, Output, EventEmitter
} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appDatepicker]',
  exportAs: 'datepicker',
})
export class DateRangePickerDirective implements AfterViewInit {
  @Output() dateEventEmitter = new EventEmitter();
  startDate: any;
  endDate: any;
  constructor(private el: ElementRef, private ngZone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.scriptOutsideAngular(this.startDate, this.endDate, this.dateEventEmitter);
  }

  scriptOutsideAngular(startDate: any, endDate: any, dateEventEmitter: any): any {
    /*Datepicker*/
    $.datepicker.setDefaults({
      dateFormat: 'dd/mm/yy'
    });
    // Full date
    $(document).on('click', '.js-checkin, .js-checkout', function(){
      $('.full-date-canvas').appendTo($(this).parent()).addClass('show-full');
    });

    $('.full-date-close, .full-date-btn').click(function(){
      $('.full-date-canvas').removeClass('show-full');
    });

    $('.js-datepicker').datepicker({
      numberOfMonths: 2,
      changeMonth: true,
      minDate: new Date(),
      beforeShowDay(date) {
        let date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $('.js-mobile-checkin').val());
        let date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $('.js-mobile-checkout').val());
        return [true, date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2)) ? 'dp-highlight' : ''];
      },
      onSelect(dateText, inst) {
        let date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $('.js-mobile-checkin').val());
        let date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $('.js-mobile-checkout').val());
        let selectedDate = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText);
        if (!date1 || date2) {
          $('.js-mobile-checkin').val(dateText);
          $('.js-mobile-checkout').val('');
          startDate = dateText;
          endDate = '';
          $(this).datepicker();
        } else if (selectedDate < date1) {
          $('.js-mobile-checkout').val($('.js-checkin').val());
          $('.js-mobile-checkin').val(dateText);
          endDate = $('.js-checkin').val();
          startDate = dateText;
          $(this).datepicker();
        } else {
          $('.js-mobile-checkout').val(dateText);
          endDate = dateText;
          $(this).datepicker();
        }
        $('.js-checkin').val( $('.js-mobile-checkin').val());
        $('.js-checkout').val( $('.js-mobile-checkout').val());
        if (startDate) {
          dateEventEmitter.emit(startDate);
        }
        if (endDate) {
          dateEventEmitter.emit(endDate);
        }
      }
    });

    // Full search
    $('.full-search-toggle').click(function() {
      $('.full-search-canvas').addClass('show-full');
      $('.full-search-toggle').removeClass('active');
      $(this).addClass('active');
    });

    $('.full-search-toggle-destination').click(function() {
      $('.full-search-canvas-destination').addClass('show-full');
      $('.full-search-toggle-destination').removeClass('active');
      $(this).addClass('active');
    });

    $('.full-search-close').click(function() {
      $('.full-search-canvas').removeClass('show-full');
      $('.full-search-canvas-destination').removeClass('show-full');
      $('.full-search-toggle.active').val($('.full-search-input .form-control').val());
      $('.full-search-toggle-destination.active').val($('.full-search-input .form-control').val());
    });

    $('.full-search-toggle').click(function() {
      $('.full-search-input input').focus();
    });
  }

}
