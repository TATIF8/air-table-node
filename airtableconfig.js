

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'pateWPjeOKml7xcJJ.ab0f8851041fb490e33f7027b2b92e29693b58597b7cd3664ccbae7c4d6f1a71'}).base('appiSfzer3iVlkmir');
console.log(base('baseuwu').name)
base('baseuwu').create({
    Field1: 'Value1',
    Field2: 'Value2',
  }).then(record => {
    console.log('Created record:', record);
  }).catch(err => {
    console.error('Error creating record:', err);
  });
  