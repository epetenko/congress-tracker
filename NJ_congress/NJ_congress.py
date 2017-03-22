# coding=<utf-8>

import requests
import datetime
import json

NJ_house_members = requests.get("https://api.propublica.org/congress/v1/members/house/NJ/current.json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})

NJ_senate_members = requests.get("https://api.propublica.org/congress/v1/members/senate/NJ/current.json", headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})


file = open("data/NJ_house_members.json", "w+")
file.write(NJ_house_members.text)
file.close()

file = open("data/NJ_senate_members.json", "w+")
file.write(NJ_senate_members.text)
file.close()


def house_ids():
	parsed =  NJ_house_members.json()
	members = parsed["results"]
	NJ_house_ids = []
	for n in range(len(members)):
	    leg =  members[n]
	    leg_id = leg["id"]
	    NJ_house_ids.append(str(leg_id))
	return NJ_house_ids

house_ids_list = house_ids()


for n in house_ids_list:
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
    file = open("data/House/%s.json" %n, "w")
    file.write(detailed_list.text)
    file.close()



for n in house_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
    votes_json = member_votes.json()
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    revised_bill = json.dumps(revised_bill)
    file = open("data/House/%s_votes_filtered.json" %n, "w")
    file.write(revised_bill)
    file.close()



# house_detail_list = []
# for n in house_ids_list:
#     legislator_detail = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
#     house_detail_list.append(legislator_detail.text)

# file = open("data/NJ_house_detail.json", "w+")
# for n in house_detail_list:
# 	file.write("%s" %n)

# file.close()

def sen_ids():
	parsed =  NJ_senate_members.json()
	members = parsed["results"]
	NJ_sen_ids = []
	for n in range(len(members)):
	    leg =  members[n]
	    leg_id = leg["id"]
	    NJ_sen_ids.append(str(leg_id))
	return NJ_sen_ids

senate_ids_list = sen_ids()
for n in senate_ids_list:
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
    file = open("data/Senate/%s.json" %n, "w")
    file.write(detailed_list.text)
    file.close()

for n in senate_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
    votes_json = member_votes.json()
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage of the Bill":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    revised_bill = json.dumps(revised_bill)
    file = open("data/Senate/%s_votes_filtered.json" %n, "w")
    file.write(revised_bill)
    file.close()

# for n in senate_ids_list:
#     member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
#     file = open("data/Senate/%s_votes.json" %n, "w")
#     file.write(member_votes.content)
#     file.close()

