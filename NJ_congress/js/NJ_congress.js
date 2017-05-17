//setting up pym variable for later
var pymChild = null;

$(document).ready(function () {
//some url roots for the variables
var propublica_house_members = "data/NJ_house_members.json";
var propublica_senate_members = "data/NJ_senate_members.json"
var house_details_root = "data/House/"
var senate_details_root = "data/Senate/"
var social_images = "img/"
var last_updated_url = "data/date_updated.txt"

var images = "https://theunitedstates.io/images/congress/225x275/"

//Since this is based around ids, need to have empty list to populate with ids
NJ_house_ids = [];
NJ_senate_ids = [];

//some Tabletop variables
var qsRegex;
var buttonFilter;
var $quicksearch = $('#quicksearch');
var $container = $('#database')
var timeout;
pymChild = new pym.Child();


var public_spreadsheet_url = '177QrUk4gjNE7so42QDTEeOfPmy-pdUtdZXY5ZKGgggw';


var timestampdata = "https://spreadsheets.google.com/feeds/cells/" + public_spreadsheet_url + "/2/public/full?alt=json"

//read JSON with IDs and basic, basic bio info
$.getJSON( propublica_house_members, function( data ) {
	//run loop through json
	$.each( data.results, function( i, item ) {
	     $('.reps').append(
	      $("<div id='"+ data.results[i].id+"' class='legislators-general'><a href='#'><button class='legislators-general-name "+ data.results[i].party +"'>" + data.results[i].name + ", " + data.results[i].party + "-" + data.results[i].district + "</a></button></div>")
	      );
	     $('#' + data.results[i].id + ".legislators-detail-bio").append(
	     	$("<p>" + data.results[i].next_election + "</p>")
	     	);
	     NJ_house_ids.push(data.results[i].id);
	});
}).done(get_details_house);



$.getJSON( propublica_senate_members, function( data ) {
	$.each( data.results, function( i, item ) {
	     $('.sen').append(
	      $("<div id='"+ data.results[i].id+"' class='legislators-general'><a href='#'><button class='legislators-general-name "+ data.results[i].party +"'>" + data.results[i].name + ", " + data.results[i].party +  "</a></button></div>")
	      );
	     NJ_senate_ids.push(data.results[i].id);
	});
}).done(get_details_senate);

$.ajax({
    url: timestampdata,
    dataType: "jsonp",
    success: function(data) {
        // Get timestamp and parse it to readable format
        var date = data.feed.updated.$t
        var MM = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        }
        var formatdate = String(new Date(date)).replace(
            /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
            function($0, $1, $2, $3, $4, $5, $6) {
                return MM[$1] + "-"  + $2 + "-" + $3 + ", at " + $4 % 12 + ":" + $5 + (+$4 > 12 ? "PM" : "AM") + " " + $6
            }
        )
        $('.updated').append(formatdate)
    },
});

$.ajax({
	url: last_updated_url,
	dataType: "text",
	success: function(data){
		$('.last-updated').html("<p>Votes updated on " + data + "</p>")
	}
});

Tabletop.init({
    key: public_spreadsheet_url,
    callback: getTable,
    simpleSheet: true
})


function get_details_house() {
	$.each(NJ_house_ids, function (i, item){
		$.getJSON(house_details_root + NJ_house_ids[i] + ".json", function(data) {
			$.each( data.results, function( i, item ) {
			     $('#' + data.results[0].member_id).append(
			      $("<div class='legislators-detail-container'><div class='legislators-detail-bio'><div class='rep-image'><img src='img/" + data.results[0].member_id + ".jpg'></div><p>" + data.results[0].first_name + " " + data.results[0].last_name + ", " + data.results[0].current_party + "-" + data.results[0].roles[0].district + "</p><p class='info-box-header'>More info:</p><p><a target='_blank' href='https://www.govtrack.us/congress/members/" + data.results[0].govtrack_id + "'>Govtrack</a>                  <a target='_blank' href='http://votesmart.org/candidate/biography/"+ data.results[0].votesmart_id +"'>Vote Smart</a></p><p class='info-box-header'>Contact info:</p><p><a target='_blank' href='http://facebook.com/ " + data.results[0].facebook_account+ "'><img src='"+ social_images+"facebook.gif'></a>        <a target='_blank' href='http://twitter.com/" + data.results[0].twitter_account+"'><img src='"+ social_images+"twitter.gif'></a></p></div><div class='legislators-detail-history'><div class='blue-header'>For this session:</div><table class='detail-table'><tr><td class='trump'><p class='blue-header'>FiveThirtyEight Trump score: </p></td></tr><tr><td><p class='blue-header'>Percent votes missed:</p><p class='detail-stats'> "+ data.results[0].roles[0].missed_votes_pct +"%</p></td><td><p class='blue-header'>Percent votes with party:</p><p class='detail-stats'> "+ data.results[0].roles[0].votes_with_party_pct+"%</p></td></table><table class='detail-table'><tr><td><p class='blue-header'>Number of bills sponsored this session:</p><p class='detail-stats'> " + data.results[0].roles[0].bills_sponsored+"</p></td><td><p class='blue-header'> Cosponsored: </p><p class='detail-stats'>" + data.results[0].roles[0].bills_cosponsored +"</p></td></tr></table><div class='comm-list'><p class='blue-header'>Committee Membership:</p></div><table class='latest-news'><p class='latest-news-header'>Latest news:</p></table></div><p><a href='#top-title'>Scroll to top</a></p></div>")
			      );
			$('#' + data.results[0].member_id + ' .legislators-general-name').click(function(){
					$('#' + data.results[0].member_id + " " + '.legislators-detail-container').slideToggle(
						function(){pymChild.sendHeight();}
						);
					$('#' + data.results[0].member_id + " " + '.legislators-detail-table').slideToggle(
						function(){pymChild.sendHeight();}
						);
					});
				});
		$.each(data.results[0].roles[0].committees, function(i, item){
			console.log(item)
			$('#'+ data.results[0].member_id + '.legislators-detail-container .legislators-detail-history .comm-list').append(
				$("<div class='comm'>This is a test</div>")
				);
		});
		}).done(votes_filtered_house);
		function votes_filtered_house(){
			$.getJSON(house_details_root + NJ_house_ids[i] + "_votes_filtered.json", function(data) {
					$('#'+ data[i].member_id).append(
				      $("<div class='legislators-detail-table'><table class='vote-positions'><tr><th>Date</th><th>Bill Description</th><th>Link</th><th>Their vote</th></tr><tr><td>" + data[0].date+"</td><td>" + data[0].description+"</td><td><a target='_blank' href='" + data[0].bill.gov_url+ "'>Link</a></td><td>"+ data[0].position+"</td></tr><tr><td>" + data[1].date+"</td><td>" + data[1].description+"</td><td><a target='_blank' href='" + data[1].bill.gov_url+ "'>Link</a></td><td>"+ data[1].position+"</td></tr><tr><td>" + data[2].date+"</td><td>" + data[2].description+"</td><td><a target='_blank' href='" + data[2].bill.gov_url+ "'>Link</a></td><td>"+ data[2].position+"</td></tr><tr><td>" + data[3].date+"</td><td>" + data[3].description+"</td><td><a target='_blank' href='" + data[3].bill.gov_url+ "'>Link</a></td><td>"+ data[3].position+"</td></tr><tr><td>" + data[4].date+"</td><td>" + data[4].description+"</td><td><a target='_blank' href='" + data[4].bill.gov_url+ "'>Link</a></td><td>"+ data[4].position+"</td></tr><tr><td>" + data[5].date+"</td><td>" + data[5].description+"</td><td><a target='_blank' href='" + data[5].bill.gov_url+ "'>Link</a></td><td>"+ data[5].position+"</td></tr><tr><td>" + data[6].date+"</td><td>" + data[6].description+"</td><td><a target='_blank' href='" + data[6].bill.gov_url+ "'>Link</a></td><td>"+ data[6].position+"</td></tr><tr><td>" + data[7].date+"</td><td>" + data[7].description+"</td><td><a target='_blank' href='" + data[7].bill.gov_url+ "'>Link</a></td><td>"+ data[7].position+"</td></tr></table></div>")
				      );
			});
		};
	});
	// var pymChild = new pym.Child();

// var pymChild.sendHeight();
};


function get_details_senate() {
	$.each(NJ_senate_ids, function (i, item){
		$.getJSON(senate_details_root + NJ_senate_ids[i] + ".json", function(data) {
			$.each( data.results, function( i, item ) {
			     $('#' + data.results[0].member_id).append(
			      $("<div class='legislators-detail-container'><div class='legislators-detail-bio'><div class='rep-image'><img src='" +images + data.results[0].member_id + ".jpg'></div><p>" + data.results[0].first_name + " " + data.results[0].last_name + ", " + data.results[0].current_party +"</p><p class='info-box-header'>More info:</p><p><a target='_blank' href='https://www.govtrack.us/congress/members/" + data.results[0].govtrack_id + "'>Govtrack</a>                  <a target='_blank' href='http://votesmart.org/candidate/biography/"+ data.results[0].votesmart_id +"'>Vote Smart</a></p><p class='info-box-header'>Contact info:</p><p><a target='_blank' href='http://facebook.com/ " + data.results[0].facebook_account+ "'><img src='"+ social_images+"facebook.gif'></a>        <a target='_blank' href='http://twitter.com/" + data.results[0].twitter_account+"'><img src='"+ social_images+"twitter.gif'></a></p></div><div class='legislators-detail-history'><table class='detail-table'><tr><td class='trump'><p class='blue-header'>FiveThirtyEight Trump score: </p></td></tr><tr><td><p class='blue-header'>Percent votes missed:</p><p class='detail-stats'> "+ data.results[0].roles[0].missed_votes_pct +"%</p></td><td><p class='blue-header'>Percent votes with party:</p><p class='detail-stats'> "+ data.results[0].roles[0].votes_with_party_pct+"%</p></td></table><table class='detail-table'><tr><td><p class='blue-header'>Number of bills sponsored this session:</p><p class='detail-stats'> " + data.results[0].roles[0].bills_sponsored+"</p></td><td><p class='blue-header'> Cosponsored: </p><p class='detail-stats'>" + data.results[0].roles[0].bills_cosponsored +"</p></td></tr></table><div class='comm-list'><p class='blue-header'>Committee Membership:</p></div><table class='latest-news'><p class='latest-news-header'>Latest news:</p></table></div><p><a href='#top-title'>Scroll to top</a></p></div>")
			      // <div><p class='blue-header'>Committee participation: </p><p>This session:" + data.results[0].roles[0].committees[0].name + "</p><p>Last session:" + data.results[0].roles[1].committees[0].name+"</div>
			      );
			$('#' + data.results[0].member_id + ' .legislators-general-name').click(function(){
					$('#' + data.results[0].member_id + " " + '.legislators-detail-container').slideToggle(function(){pymChild.sendHeight();}
						);
					$('#' + data.results[0].member_id + " " + '.legislators-detail-table').slideToggle(
						function(){pymChild.sendHeight();}
						);
			
				});
			});
		}).done(votes_filtered_senate);
		function votes_filtered_senate(){
			$.getJSON(senate_details_root + NJ_senate_ids[i] + "_votes_filtered.json", function(data) {
					$('#'+ data[i].member_id).append(
				      $("<div class='legislators-detail-container'><table class='vote-positions'><tr><th>Date</th><th>Bill Description</th><th>Link</th><th>Their vote</th></tr><tr><td>" + data[0].date+"</td><td>" + data[0].description+"</td><td><a target='_blank' href='" + data[0].bill.gov_url+ "'>Link</a></td><td>"+ data[0].position+"</td></tr><tr><td>" + data[1].date+"</td><td>" + data[1].description+"</td><td><a target='_blank' href='" + data[1].bill.gov_url+ "'>Link</a></td><td>"+ data[1].position+"</td></tr><tr><td>" + data[2].date+"</td><td>" + data[2].description+"</td><td><a target='_blank' href='" + data[2].bill.gov_url+ "'>Link</a></td><td>"+ data[2].position+"</td></tr><tr><td>" + data[3].date+"</td><td>" + data[3].description+"</td><td><a target='_blank' href='" + data[3].bill.gov_url+ "'>Link</a></td><td>"+ data[3].position+"</td></tr><tr><td>" + data[4].date+"</td><td>" + data[4].description+"</td><td><a target='_blank' href='" + data[4].bill.gov_url+ "'>Link</a></td><td>"+ data[4].position+"</td></tr><tr><td>" + data[5].date+"</td><td>" + data[5].description+"</td><td><a target='_blank' href='" + data[5].bill.gov_url+ "'>Link</a></td><td>"+ data[5].position+"</td></tr><tr><td>" + data[6].date+"</td><td>" + data[6].description+"</td><td><a target='_blank' href='" + data[6].bill.gov_url+ "'>Link</a></td><td>"+ data[6].position+"</td></tr><tr><td>" + data[7].date+"</td><td>" + data[7].description+"</td><td><a target='_blank' href='" + data[7].bill.gov_url+ "'>Link</a></td><td>"+ data[7].position+"</td></tr></table></div>")
				      );
			});
		};
	});
	// var pymChild = new pym.Child();

};


function getTable(data, tabletop) {
    var news = tabletop.foundSheetNames[0];
    var comm_sheet = tabletop.foundSheetNames[1];
    // var sheetnamecontrol = tabletop.foundSheetNames[2];
    var contact_sheet = tabletop.foundSheetNames[2];
    var trumpscore = tabletop.foundSheetNames[3];
    // Get title of datasheet
    // Get credits and explainer from "Control spreadsheet"
    // $.each(tabletop.sheets(sheetnamecontrol).all(), function(i, v) {
    //     var explainer = v.explainer
    //     var credits = v.credits
    //     $(".credit").append(credits)
    //     $(".explainer").append(explainer)
    // });
    var result = [];
    var count = 1;
    $.each(tabletop.sheets(news).all(), function(i, v) {
        // Parses the resulting JSON into the individual squares for each row
        $('#' + v.memberid + ' .latest-news').append(
        	// $('<p>This </p>')
        	// );
        	'<div class="news-name"><a href="' + v.link + ' " target="_blank">' + v.title + '<a></div></div>');		
        if (v.memberid == "all") {
        	$('#all-news').append()
        	.queue(function(next){
        		$('#all-news').append(
        		'<div id="element-item"><div class="news-name"><a href="' + v.link + ' " target="_blank">' + v.title + '<a></div></div>');
        		next();
        	});		
        };
        if (v.memberid == 'every') {
			$('.latest-news').append()
		        	.queue(function(next){
		        		$('.latest-news').append(
		        		'<div id="element-item"><div class="news-name"><a href="' + v.link + ' " target="_blank">' + v.title + '<a></div></div>');
		        		next();
		        	});		
        }
        // Gets all unique filtercategory values and puts them into an array
    });
	$.each(tabletop.sheets(comm_sheet).all(), function(i,v){
		$('#'+v.memberid +' .comm-list').append(
			"<div class='comm'><ul><li>" + v.commname +"</li></ul></div>"
			)
	});
	$.each(tabletop.sheets(contact_sheet).all(), function(i,v){
		$('#'+v.memberid +' .legislators-detail-bio').append(
			"<div class='contact'><p><a href='" + v.emaillink +"'>Email</a></p><p><a href='tel:1-"+ v.phone1 +"'>"+ v.phone1 + "</a></p><p><a href='tel:1-"+ v.phone2 +"'>"+ v.phone2 + "</a></p><p><a href='tel:1-"+ v.phone3 +"'>"+ v.phone3 + "</a></p></div>"
			)
	});
	$.each(tabletop.sheets(trumpscore).all(), function(i,v){
		$('#'+v.memberid +' .trump').append(
			"<p class='detail-stats'><a target='_blank' href='" + v.trumplink+"'>"+ v.trumpscore + "%</a></p><p><a class='twitter-share-button' href='https://twitter.com/intent/tweet?text=My%20representative,%20"+ v.name+ ",%20is%20in%20line%20with%20@POTUS%20Trump%20"+v.trumpscore +"%20percent%20of%20the%20time.%20Check%20yours:&url=http://www.nj.com/opinion/index.ssf/2017/05/are_your_interests_being_served_in_congress_use_this_tool_to_keep_track.html' data-size='large'><img src='img/Twitter_Social_Icon_Blue.png' width='25px'></a></p>"
			)
	});
	// var pymChild = new pym.Child();
	pymChild.sendHeight();

};

$('#dem-filter').click(function(){
	$('.R').hide();
	$('.D').show();
pymChild.sendHeight();
});

$('#gop-filter').click(function(){
	$('.D').hide();
	$('.R').show();
pymChild.sendHeight();
});

$('#all-filter').click(function(){
	$('.D').show();
	$('.R').show();
pymChild.sendHeight();
});

// $('.scroll').click(function(){
// 	console.log("this")
// 	pymChild.scrollParentTo('scroll-top');
// });

// $.getJSON(house_details_root + leg_id+ ".json", function(data) {
// 	console.log(data.results[0].member_id)
// 	$.each( data.results, function( i, item ) {
// 	     console.log()
// 		});
// });
})




