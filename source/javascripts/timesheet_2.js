(function() {
  'use strict';

  /**
   * Initialize a Timesheet
   */
  var Timesheet = function(container, min, max, data) {
    this.data = [];

    var _min = new Date(min * 1000);
    var _max = new Date(max * 1000);
    _min.setHours(0, 0, 0, 0);
    _max.setHours(0, 0, 0, 0);

    this.term = {
      min: _min,
      max: _max
    };

    this.parse(data || []);

    if (typeof document !== 'undefined') {
      this.container = (typeof container === 'string') ? document.querySelector('#'+container) : container;
      this.drawSections();
      this.insertData();
    }
  };

  /**
   * Insert data into Timesheet
   */
  Timesheet.prototype.insertData = function() {
    var html = [];
    var sectionWidth = this.container.querySelector('.scale section').offsetWidth;

    for (var n = 0, m = this.data.length; n < m; n++) {
      var cur = this.data[n];
      var bubble = new Bubble(sectionWidth, this.term.min, cur.start, cur.end);

      var line = [
        '<span style="margin-left: ' + bubble.getStartOffset() + 'px; width: ' + bubble.getWidth() + 'px;" class="bubble bubble-' + cur.type + '"></span>',
        '<span class="text">',
        '<span class="date">' + bubble.getDateLabel() + '</span> ',
        '<span class="label">' + cur.label + '</span>' +
        '</span>'
      ].join('');

      html.push('<li>' + line + '</li>');
    }

    this.container.innerHTML += '<ul class="data">' + html.join('') + '</ul>';
  };

  /**
   * Draw section labels
   */
  Timesheet.prototype.drawSections = function() {
    var html = [];
    var date = new Date(this.term.min.getTime());

    while (date <= this.term.max) {
      html.push('<section><div>' + this.formatDate(date) + '</div></section>');
      date.setDate(date.getDate() + 1);
    }

    this.container.className = 'timesheet color-scheme-default';
    this.container.innerHTML = '<div class="scale">' + html.join('') + '</div>';
  };

  /**
   * Parse passed data
   */
  Timesheet.prototype.parse = function(data) {
    for (var n = 0, m = data.length; n<m; n++) {
      var beg = new Date(data[n][0] * 1000);
      var end = new Date(data[n][1] * 1000);
      var lbl = data[n][2];
      var cat = data[n][3] || 'default';

      this.data.push({start: beg, end: end, label: lbl, type: cat});
    }
  };

  /**
   * Format date for display
   */
  Timesheet.prototype.formatDate = function(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var w = date.getDay();
    var wNames = ['日', '月', '火', '水', '木', '金', '土'];

    return m + '/' + d + '<br>' + wNames[w];
  };

  /**
   * Timesheet Bubble
   */
  var Bubble = function(sectionWidth, min, start, end) {
    this.min = min;
    this.start = start;
    this.end = end;
    this.sectionWidth = sectionWidth;
  };

  /**
   * Calculate starting offset for bubble
   */
  Bubble.prototype.getStartOffset = function() {
    var hourWidth = this.sectionWidth / 24;
    var hour = ((this.start - this.min) / 1000 / 60 / 60);

    return hourWidth * hour;
  };

  /**
   * Get bubble's width in pixel
   */
  Bubble.prototype.getWidth = function() {
    var hourWidth = this.sectionWidth / 24;
    var hour = ((this.end - this.start) / 1000 / 60 / 60);

    return hourWidth * hour;
  };

  /**
   * Get the bubble's label
   */
  Bubble.prototype.getDateLabel = function() {
    var arr = ['start', 'end'];
    var has_year = this.start.getFullYear() !== this.end.getFullYear();
    var labels = [];

    for (var n = 0; n < arr.length; n++) {
      var year   = eval('this.' + arr[n]).getFullYear();
      var month  = eval('this.' + arr[n]).getMonth() + 1;
      var date   = eval('this.' + arr[n]).getDate();
      var hour   = ('0' + eval('this.' + arr[n]).getHours()).slice(-2);
      var minute = ('0' + eval('this.' + arr[n]).getMinutes()).slice(-2);

      var label = month + '/' + date + ' ' + hour + ':' + minute;

      if (has_year) {
        label = year + ' ' + label
      }

      labels.push(label);
    }

    return labels.join(' - ');
  };

  window.Timesheet = Timesheet;
})();
