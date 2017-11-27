function updateProperty(propName) {

  var ntab = $("#" + propName).val();

  $.ajax({
    url: `/${propName}/${ntab.toString()}`
  }).done(function(data) {
      console.log(data);
      $("#" + propName + "_val").text(data);
  });
}

$(window).on('load', function() {

  updateProperty("power");
  updateProperty("duration_imp");
  updateProperty("duration_between_imp");
  updateProperty("exposure_mix");
  updateProperty("exposure_cont");
  updateProperty("volume");
  updateProperty("brightness");

});

$(document).on('input',
  '#power, \
  #duration_imp, \
  #duration_between_imp, \
  #exposure_mix, \
  #exposure_cont, \
  #volume, \
  #brightness', function() {

  var id = $(this).attr("id");

  updateProperty(id);
});
