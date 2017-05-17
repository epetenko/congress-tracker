$(document).ready(function () {

// var propublica_house_members = "http://localhost:8000/Desktop/Coding/Congress-tracker/NJ_congress/data/NJ_house_members.json";
// var propublica_senate_members = "http://localhost:8000/Desktop/Coding/Congress-tracker/NJ_congress/data/NJ_senate_members.json"
// var house_votes_root = "http://localhost:8000/Desktop/Coding/Congress-tracker/NJ_congress/data/Recent_house_votes.json"
// var senate_votes_root = "http://localhost:8000/Desktop/Coding/Congress-tracker/NJ_congress/data/Recent_senate_votes.json"

var house_votes_root = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/Recent_house_votes.json"
var senate_votes_root = "https://s3.amazonaws.com/nj-data/Congress-tracker/NJ_congress/data/Recent_senate_votes.json"

NJ_house_ids = [];
NJ_senate_ids = [];


$.getJSON( house_votes_root, function( data ) {
    console.log(data)
    for (i = 0; i< 30; i++) {
        if (data.results.votes[i].question == "On Passage" || data.results.votes[i].question == "On the Joint Resolution" || data.results.votes[i].question == "On the Nomination") {
            $('#house-table.vote-positions').append(
                    $("<tr><td>" + data.results.votes[i].date + "</td><td>" + data.results.votes[i].description + "</td><td>" + data.results.votes[i].result + "</td><td>"+ data.results.votes[i].democratic.yes + "/" + data.results.votes[i].republican.yes + "</td><td>" + data.results.votes[i].bill.subject + "</td><td>" + data.results.votes[i].bill.sponsor + " (" + data.results.votes[i].bill.sponsor_party + "-" + data.results.votes[i].bill.sponsor_state +") </td><td><a target='_blank' href='" + data.results.votes[i].bill.gov_url + "'>Link</a></td></tr>"
                        // <td class='popup-click'><a href='#'>Click to view more</a></td></tr><div class='popup-show'>this</div>
                        )
            );
        };
        // $('.popup-click').click(function(){
        //     $(".popup-show").dialog();
        // });
    };
});

$.getJSON( senate_votes_root, function( data ) {
    console.log(data)
    for (i = 0; i< 15; i++) {
        if (data.results.votes[i].question == "On Passage of the Bill" || data.results.votes[i].question == "On the Nomination" || data.results.votes[i].question == "On the Joint Resolution") {
            $('#senate-table.vote-positions').append(
                    $("<tr id="+i+"><td>" + data.results.votes[i].date + "</td><td>" + data.results.votes[i].description + "</td><td>" + data.results.votes[i].result + "</td><td>" + data.results.votes[i].democratic.yes + "/" + data.results.votes[i].republican.yes + "</td></tr>")
            );
            if (data.results.votes[i].bill) {
                 $('#'+ i).append(
                    $("<td>" + data.results.votes[i].bill.subject + "</td><td>" + data.results.votes[i].bill.sponsor + " (" + data.results.votes[i].bill.sponsor_party + "-" + data.results.votes[i].bill.sponsor_state +") </td><td><a target='_blank' href='" + data.results.votes[i].bill.gov_url + "'>Link</a></td>")
            )} else {
                 $('#'+ i).append(
                    $("<td></td><td></td>")
                    )};
        };
    };
});





})





