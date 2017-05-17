var url = "https://www.googleapis.com/civicinfo/v2/representatives?key="

var key = "AIzaSyB7Tx7_nHHfC9jeyKUBeI_Sp1Qrwraw0wc"
var pymChild = null;


// var pymChild = new pym.Child();


$(document).ready(function () {

pymChild = new pym.Child();


$("#input_click" ).click(function() {
 
  var street = $('#street').val();
  var town = $('#town').val();
  var state = $('#state').val();

  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: url + key + "&address=" + street + town + state + "&roles=legislatorLowerBody"
  }).done(create_cards_house);

   $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    url: url + key + "&address=" + street + town + state + "&roles=legislatorUpperBody"
  }).done(create_cards_senate);

$('.house').show();
$('.senate').show();
  pymChild.sendHeight();


});




function create_cards_house(data) {


  $('.house').html(
    $("<div class='title'>HOUSE</div>")
  );
    
  $.each(data.officials, function(i, item) {
    console.log(data)
     $('.house').append(
        $("<div class='legislators'><img src='"+ data.officials[i].photoUrl +"' class='geo-image'><div class='name'>" + data.officials[i].name + "</div><div class='partydist'>" + data.offices[0].name+  ", "+ data.officials[i].party +" </div><div class='contact-info'><p class='geo-leg-header'>Contact Information:</p><table class='geo-table'><tr><td>Phone:</td><td><a href='tel:1-"+ data.officials[i].phones[0] + "'>" + data.officials[i].phones[0] + "</a></td></tr><tr><td> Website:</td><td><a target='_blank' href='" + data.officials[i].urls[0] + "'>Link</a></td></tr><tr><td>" + data.officials[i].channels[0].type + ": </td><td><a target='_blank' href = 'http://" + data.officials[i].channels[0].type + ".com/" + data.officials[i].channels[0].id + "'>" + data.officials[i].channels[0].id +  "</a></td></tr><tr><td>" + data.officials[i].channels[1].type + ":</td><td><a target='_blank' href = 'http://" + data.officials[i].channels[1].type + ".com/" + data.officials[i].channels[1].id + "'>" + data.officials[i].channels[1].id +  "</a></td></tr></table><div class='address'><p class='geo-leg-header'>Primary Address:</p><p>" + data.officials[i].address[0].line1 + "</p><p>" + data.officials[i].address[0].city + ", " + data.officials[i].address[0].state + ", " + data.officials[i].address[0].zip +"</p></div></div></div>")
      );
  });
  pymChild.sendHeight();

};



function create_cards_senate(data) {

  console.log(data);

  $('.senate').html(
    $("<div class='title'>Senate</div>")
  );
    
  $.each(data.officials, function(i, item) {
     $('.senate').append(
        $("<div class='legislators'><img src='"+ data.officials[i].photoUrl +"' class='geo-image'><div class='name'>" + data.officials[i].name + "</div><div class='partydist'>" + data.offices[0].name+  ", "+ data.officials[i].party +" </div><div class='contact-info'><p class='geo-leg-header'>Contact Information:</p><table class='geo-table'><tr><td>Phone:</td><td>" + data.officials[i].phones[0] + "</td></tr><tr><td> Website:</td><td><a target='_blank' href='" + data.officials[i].urls[0] + "'>Link</a></td></tr><tr><td>" + data.officials[i].channels[0].type + ": </td><td><a target='_blank' href = 'http://" + data.officials[i].channels[0].type + ".com/" + data.officials[i].channels[0].id + "'>" + data.officials[i].channels[0].id +  "</a></td></tr><tr><td>" + data.officials[i].channels[1].type + ":</td><td><a target='_blank' href = 'http://" + data.officials[i].channels[1].type + ".com/" + data.officials[i].channels[1].id + "'>" + data.officials[i].channels[1].id +  "</a></td></tr></table><div class='address'><p class='geo-leg-header'>Primary Address:</p><p>" + data.officials[i].address[0].line1 + "</p><p>" + data.officials[i].address[0].city + ", " + data.officials[i].address[0].state + ", " + data.officials[i].address[0].zip +"</p></div></div></div>")
      );
  });
  $('#close-geo').show();

  pymChild.sendHeight();
};

  $('#close-geo').click(function(){
    console.log("this")
    $('.house').slideToggle(function(){pymChild.sendHeight();});
    $('.senate').slideToggle(function(){pymChild.sendHeight();});
  });

});






