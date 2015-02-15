var _ = require('lodash');
var xray = require('x-ray');

exports.opening_times = function(query, callback) {
  query = query || {};
  xray('https://www.vinbudin.is/desktopdefault.aspx/tabid-5/')
    .select([{
      $root: 'tbody tr',
      name: 'td:nth-child(1)',
      dates: 'td:nth-child(2)',
      opening_hours: {
        weekdays: 'td:nth-child(3)',
        friday: 'td:nth-child(4)',
        saturday: 'td:nth-child(5)',
        sunday: 'td:nth-child(6)'
      },
      phone: 'td:nth-child(7)'
    }])
    .run(function(err, array) {
      var cleaned = _.map(array, function(element, index) {
        if (element.dates.trim() === '') {
          element = _.omit(element, 'dates');
        }
        if(element.name.trim() === '') {
          element.name = array[index-1].name;
        }
        if(element.phone.trim() === '') {
          element.phone = array[index-1].phone;
        }
       return element;
      });
      return callback(null, _.where(cleaned, query));
    });
};
