
const http = require('http')
const pug = require('pug');
var express = require('express');
var app = express();
var SerialPort = require('serialport');
var serial = new SerialPort('/dev/ttyUSB0');
app.set('view engine', 'pug');
app.locals.basedir = './';
var utils = require('./utils.js');

var ntabs = [1, 1, 1, 1, 1, 1, 0];
var isStreamReady = true;

var out = "";

serial.on('error', function(err) {
  console.log('Error: ', err.message);
})

serial.on('readable', function () {
  var data = serial.read();

  console.log('<-', data, data.length);
});

app.get('/', function (req, res) {
  res.render('index', {
     power_tabs: utils.powers_all().length,
     duration_tabs: utils.durations_all().length,
     exposure_tabs: utils.exposures_all().length,
     volume_tabs: utils.volumes_all().length,
     brightness_tabs: utils.brightness_all().length - 1 // начинаем с нуля
  })
});

app.get('/:param/:ntab', function (req, res) {
  var param = req.params.param;
  var ntab = parseInt(req.params.ntab);

  // console.log(`${param} ${ntab}`);

  switch(param) {
    case "power" :
      ntabs[0] = ntab;
      res.end(utils.powers_all()[ntab-1]);
    break;

    case "duration_imp" :
      ntabs[1] = ntab;
      res.end(utils.durations_all()[ntab-1]);
    break;

    case "duration_between_imp" :
      ntabs[2] = ntab;
      res.end(utils.durations_all()[ntab-1]);
    break;

    case "exposure_mix" :
      ntabs[3] = ntab;
      res.end(utils.exposures_all()[ntab-1]);
    break;

    case "exposure_cont" :
      ntabs[4] = ntab;
      res.end(utils.exposures_all()[ntab-1]);
    break;

    case "volume" :
      ntabs[5] = ntab;
      res.end(utils.volumes_all()[ntab-1]);
    break;

    case "brightness" :
      ntabs[6] = ntab;
      res.end(utils.brightness_all()[ntab]);
    break;
  }

  var buf = new Buffer([
    utils.power_index_hundreds(ntabs[0]),
    utils.power_index_rest(ntabs[0]),
    ntabs[1],
    ntabs[2],
    ntabs[3],
    ntabs[4],
    ntabs[5],
    ntabs[6]
  ]);


  serial.write(buf, function() {
    // console.log("->", buf, buf.length);
  });

  serial.drain();

  res.end("nothing");
});

app.listen(3000, function () {
  console.log('Listening port 3000!');
});
