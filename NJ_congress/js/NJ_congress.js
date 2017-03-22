
$(document).ready(function () {

var propublica_house_members = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/NJ_house_members.json";
var propublica_senate_members = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/NJ_senate_members.json"
var house_details_root = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/House/"
var senate_details_root = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/Senate/"
var images = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/img/"

NJ_house_ids = [];
NJ_senate_ids = [];

house_rss = [];
sen_rss = [];

$.getJSON( propublica_house_members, function( data ) {
	$.each( data.results, function( i, item ) {
	     $('.reps').append(
	      $("<div id='"+ data.results[i].id+"' class='legislators-general'><a href='#'><button class='legislators-general-name'>" + data.results[i].name + ", " + data.results[i].party + "-" + data.results[i].district + "</a></button></div>")
	      );
	     NJ_house_ids.push(data.results[i].id);
	});
}).done(get_details_house);



$.getJSON( propublica_senate_members, function( data ) {
	$.each( data.results, function( i, item ) {
	     $('.sen').append(
	      $("<div id='"+ data.results[i].id+"' class='legislators-general'><a href='#'><button class='legislators-general-name'>" + data.results[i].name + ", " + data.results[i].party +  "</a></button></div>")
	      );
	     NJ_senate_ids.push(data.results[i].id);
	});
}).done(get_details_senate);



function get_details_house() {
	$.each(NJ_house_ids, function (i, item){
		$.getJSON(house_details_root + NJ_house_ids[i] + ".json", function(data) {
			$.each( data.results, function( i, item ) {
			     $('#' + data.results[0].member_id).append(
			      $("<div class='legislators-detail-container'><div class='legislators-detail-bio'><div class='rep-image'><img src='" +images + data.results[0].member_id + ".jpg' width='150px' height='200px'></div><p>" + data.results[0].first_name + " " + data.results[0].last_name + ", " + data.results[0].current_party + "-" + data.results[0].roles[0].district + "</p><p>URL: <a target= '_blank' href='"+ data.results[0].url + "'>" + data.results[0].url +"</a></p><p>Facebook: <a target='_blank' href='http://facebook.com/ " + data.results[0].facebook_account+ "'>" + data.results[0].facebook_account+ "</a></p><p>Twitter: <a target='_blank' href='http://twitter.com/" + data.results[0].twitter_account+"'>@" + data.results[0].twitter_account + "</a></p><p>Phone number: "+ data.results[0].roles[0].phone+"</p></div><div class='legislators-detail-history'><div class='detail-table'><p style='color:#007EA7;font-size:24px'>Number of bills sponsored this session:</p><p> " + data.results[0].roles[0].bills_sponsored+"</p><p style='color:#007EA7;font-size:24px'> Cosponsored: </p><p>" + data.results[0].roles[0].bills_cosponsored +"</p><p style='color:#007EA7;font-size:24px'></div><br><div class='detail-table'><p style='color:#007EA7;font-size:24px'>Percent votes missed:</p><p> "+ data.results[0].roles[0].missed_votes_pct +"%</p><p style='color:#007EA7;font-size:24px'>Percent votes with party:</p><p> "+ data.results[0].roles[0].votes_with_party_pct+"%</p></div></div></div>")
			      // <div><p style='color:#007EA7;font-size:24px'>Committee participation: </p><p>This session:" + data.results[0].roles[0].committees[0].name + "</p><p>Last session:" + data.results[0].roles[1].committees[0].name+"</div>
			      );
			// if (data.results[0].roles[0].committees[0].code) {
			//      $('#' + data.results[0].member_id + ' .legislators-detail-history').append(
			//       $("<div class='legislators-detail-history'>"+ data.results[0].roles[0].committees[0].code + "</div>")
			//       // <div><p style='color:#007EA7;font-size:24px'>Committee participation: </p><p>This session:" + data.results[0].roles[0].committees[0].name + "</p><p>Last session:" + data.results[0].roles[1].committees[0].name+"</div>
			//       );
			 // };
				$('#' + data.results[0].member_id + ' .legislators-general-name').click(function(){
					$('#' + data.results[0].member_id + " " + '.legislators-detail-container').slideToggle();
				});
				$.ajax ({
					type: 'GET',
					url: data.results[0].rss_url,
					dataType: 'xml',
				}).done(console.log("this"));
			});
		});
		$.getJSON(house_details_root + NJ_house_ids[i] + "_votes_filtered.json", function(data) {
				$('#'+ data[i].member_id).append(
			      $("<div class='legislators-detail-container'><table class='vote-positions'><tr><th>Date</th><th>Bill Description</th><th>Their vote</th></tr><tr><td>" + data[0].date+"</td><td>" + data[0].description+"</td><td>"+ data[0].position+"</td></tr><tr><td>" + data[1].date+"</td><td>" + data[1].description+"</td><td>"+ data[1].position+"</td></tr><tr><td>" + data[2].date+"</td><td>" + data[2].description+"</td><td>"+ data[2].position+"</td></tr><tr><td>" + data[3].date+"</td><td>" + data[3].description+"</td><td>"+ data[3].position+"</td></tr><tr><td>" + data[4].date+"</td><td>" + data[4].description+"</td><td>"+ data[4].position+"</td></tr><tr><td>" + data[5].date+"</td><td>" + data[5].description+"</td><td>"+ data[5].position+"</td></tr><tr><td>" + data[6].date+"</td><td>" + data[6].description+"</td><td>"+ data[6].position+"</td></tr><tr><td>" + data[7].date+"</td><td>" + data[7].description+"</td><td>"+ data[7].position+"</td></tr></table></div>")
			      );
		});
	});
};

console.log(house_rss)

function get_details_senate() {
	$.each(NJ_senate_ids, function (i, item){
		$.getJSON(senate_details_root + NJ_senate_ids[i] + ".json", function(data) {
			$.each( data.results, function( i, item ) {
			     $('#' + data.results[0].member_id).append(
			      $("<div class='legislators-detail-container'><div class='legislators-detail-bio'><div class='rep-image'><img src='" +images + data.results[0].member_id + ".jpg' width='150px' height='200px'></div><p>" + data.results[0].first_name + " " + data.results[0].last_name + ", " + data.results[0].current_party + "</p><p>URL: <a target= '_blank' href='"+ data.results[0].url + "'>" + data.results[0].url +"</a></p><p>Facebook: <a target= '_blank' href='http://facebook.com/ " + data.results[0].facebook_account+ "'>" + data.results[0].facebook_account+ "</a></p><p>Twitter: <a target='_blank' href='http://twitter.com/" + data.results[0].twitter_account+"'>@" + data.results[0].twitter_account + "</a></p>p>Phone number: "+ data.results[0].roles[0].phone+"</p></div><div class='legislators-detail-history'><div class='detail-table'><p style='color:#007EA7;font-size:24px'>Number of bills sponsored this session:</p><p> " + data.results[0].roles[0].bills_sponsored+"</p><p style='color:#007EA7;font-size:24px'> Cosponsored: </p><p>" + data.results[0].roles[0].bills_cosponsored +"</p><p style='color:#007EA7;font-size:24px'></div><br><div class='detail-table'><p style='color:#007EA7;font-size:24px'>Percent votes missed:</p><p> "+ data.results[0].roles[0].missed_votes_pct +"%</p><p style='color:#007EA7;font-size:24px'>Percent votes with party:</p><p> "+ data.results[0].roles[0].votes_with_party_pct+"%</p></div></div></div>")
			      // <div><p style='color:#007EA7;font-size:24px'>Committee participation: </p><p>This session:" + data.results[0].roles[0].committees[0].name + "</p><p>Last session:" + data.results[0].roles[1].committees[0].name+"</div>
			      );
				if (data.results[0].roles[0].committees[0].code) {
			     $('#' + data.results[0].member_id + ' .legislators-detail-history').append(
			      $("<div class='committees'><p style='color:#007EA7;font-size:24px'>Committee Membership: </p><p>Current session: "+ data.results[0].roles[0].committees[0].name + "</p></div>")
			      // <div><p style='color:#007EA7;font-size:24px'>Committee participation: </p><p>This session:" + data.results[0].roles[0].committees[0].name + "</p><p>Last session:" + data.results[0].roles[1].committees[0].name+"</div>
			      );
			 };
			$('#' + data.results[0].member_id + ' .legislators-general-name').click(function(){
				$('#' + data.results[0].member_id + " " + '.legislators-detail-container').slideToggle();
			});
			});
		});
		$.getJSON(senate_details_root + NJ_senate_ids[i] + "_votes_filtered.json", function(data) {
				$('#'+ data[i].member_id).append(
			      $("<div class='legislators-detail-container'><table class='vote-positions'><tr><th>Date</th><th>Bill Description</th><th>Their vote</th></tr><tr><td>" + data[0].date+"</td><td>" + data[0].description+"</td><td>"+ data[0].position+"</td></tr><tr><td>" + data[1].date+"</td><td>" + data[1].description+"</td><td>"+ data[1].position+"</td></tr><tr><td>" + data[2].date+"</td><td>" + data[2].description+"</td><td>"+ data[2].position+"</td></tr><tr><td>" + data[3].date+"</td><td>" + data[3].description+"</td><td>"+ data[3].position+"</td></tr><tr><td>" + data[4].date+"</td><td>" + data[4].description+"</td><td>"+ data[4].position+"</td></tr><tr><td>" + data[5].date+"</td><td>" + data[5].description+"</td><td>"+ data[5].position+"</td></tr><tr><td>" + data[6].date+"</td><td>" + data[6].description+"</td><td>"+ data[6].position+"</td></tr></table></div>")
			      );
		});
	});
};




// $.getJSON(house_details_root + leg_id+ ".json", function(data) {
// 	console.log(data.results[0].member_id)
// 	$.each( data.results, function( i, item ) {
// 	     console.log()
// 		});
// });

})



// var NJ_leg_id = [];

// function NJ_reps( data ) {
// 	$.each( data.results, function( i, item ) {
// 		leg_id = data.results[i].id
//      $('.reps').append(
//       $("<div id='legislators'><a href='#'>" + data.results[i].name + ", " + data.results[i].party + "-" + data.results[i].district +"</a><p class='content-one'>This is a test</p></div>")
//       );
//      	NJ_leg_id.push(data.results[i].id);
// 	});

// 	     $('#legislators').click(function(){
//     	$('.content-one').slideToggle('slow');

// 		});
// 	};



// function NJ_sens( data ) {

// 	$.each( data.results, function( i, item ) {
//      $('.sen').append(
//       $("<div class='legislators'><a href='#'>" + data.results[i].name + ", " + data.results[i].party + "</a><p class = 'content-one'>This is a test</p></div>")
//       );

// 	});

// 	     $('.legislators').click(function(){
//     	$('.content-one').slideToggle('slow');

// 		});
// 	};


