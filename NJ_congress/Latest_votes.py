import requests
import datetime
import json

propublica_api_key = "IM_NOT_TELLING"

#Part 1. Retrieve latest list of House and Senate members

NJ_house_members = requests.get("https://api.propublica.org/congress/v1/members/house/NJ/current.json",headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})
NJ_senate_members = requests.get("https://api.propublica.org/congress/v1/members/senate/NJ/current.json", headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})

with open("data/NJ_house_members.json", "w+") as file:
    file.write(NJ_house_members.text)   

with open("data/NJ_senate_members.json", "w+") as file:
    file.write(NJ_senate_members.text)  


#Part 2. Use IDs retrieved in first step to get details on each id
#2a. find unique IDs
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

# 2b. Get biographical info
for n in house_ids_list:
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":propublica_api_key})
    with open("data/House/%s.json" %n, "w+") as file:
		file.write(detailed_list.text)     


#2c. Get latest votes
for n in house_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":propublica_api_key})
    votes_json = member_votes.json()
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage" or votes_json["results"][0]["votes"][d]["question"] == "On the Joint Resolution" or votes_json["results"][0]["votes"][d]["question"] == "On the Nomination":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    #trying to get the bill urls
    for l in range(0, len(revised_bill)):
        if "bill" in revised_bill[l]:
            if "bill_uri" in revised_bill[l]["bill"]:
                bill_url = revised_bill[l]["bill"]["bill_uri"]
                bill_pull = requests.get(bill_url, headers={"X-API-KEY":propublica_api_key})
                bill_json = bill_pull.json()
                revised_bill[l]["bill"]["gov_url"] = bill_json["results"][0]['congressdotgov_url']
                revised_bill[l]["bill"]["sponsor"] = bill_json["results"][0]['sponsor']
                revised_bill[l]["bill"]["sponsor_party"] = bill_json["results"][0]['sponsor_party']
                revised_bill[l]["bill"]["sponsor_state"] = bill_json["results"][0]['sponsor_state']
    revised_bill = json.dumps(revised_bill)
    with open("data/House/%s_votes_filtered.json" %n, "w+") as file:
		file.write(revised_bill)


#same steps for senate

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
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":propublica_api_key})
    with open("data/Senate/%s.json" %n, "w+") as file:
		file.write(detailed_list.text)    


for n in senate_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":propublica_api_key})
    votes_json = member_votes.json()
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage of the Bill" or votes_json["results"][0]["votes"][d]["question"] == "On the Nomination" or votes_json["results"][0]["votes"][d]["question"] == "On the Joint Resolution":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    for l in range(0, len(revised_bill)):
        if "bill" in revised_bill[l]:
            if "bill_uri" in revised_bill[l]["bill"]:
                bill_url = revised_bill[l]["bill"]["bill_uri"]
                bill_pull = requests.get(bill_url, headers={"X-API-KEY":propublica_api_key})
                bill_json = bill_pull.json()
                revised_bill[l]["bill"]["gov_url"] = bill_json["results"][0]['congressdotgov_url']
                revised_bill[l]["bill"]["sponsor"] = bill_json["results"][0]['sponsor']
                revised_bill[l]["bill"]["sponsor_party"] = bill_json["results"][0]['sponsor_party']
                revised_bill[l]["bill"]["sponsor_state"] = bill_json["results"][0]['sponsor_state']
    revised_bill = json.dumps(revised_bill)
    with open("data/Senate/%s_votes_filtered.json" %n, "w+") as file:
		file.write(revised_bill)



# Part 3. latest NJ votes

#pre step - template variables
latest_votes_template = "https://api.propublica.org/congress/v1/house/votes/"
votes_house_root = "https://api.propublica.org/congress/v1/house/votes/"
votes_senate_root = "https://api.propublica.org/congress/v1/senate/votes/"

#3a. get datetime stamp
today = datetime.date.today()
first = today.replace(day=1)
lastMonth = first - datetime.timedelta(days=1)
last_month = lastMonth.strftime("%Y-%m")
lastday = today - datetime.timedelta(days=30)
#end datetime stamp

#3b. pull request for latest votes
votes_house_url = votes_house_root + str(last_month) +"-" + str(lastday.strftime("%d")) + "/" + str(today.strftime("%Y-%m-%d")) +  ".json"
NJ_house_votes = requests.get(votes_house_url,headers={"X-API-KEY":propublica_api_key})
NJ_house_votes_json = NJ_house_votes.json()

def pull_urls(input_json):   
    bill_urls = []
    for l in range(0, len(input_json["results"]["votes"])):
        if "bill" in input_json["results"]["votes"][l]:
            if "api_uri" in input_json["results"]["votes"][l]["bill"]:
                bill_url = input_json["results"]["votes"][l]["bill"]["api_uri"]
                bill_pull = requests.get(bill_url, headers={"X-API-KEY":propublica_api_key})
                bill_json = bill_pull.json()
                input_json["results"]["votes"][l]["bill"]["gov_url"] = bill_json["results"][0]['congressdotgov_url']
                input_json["results"]["votes"][l]["bill"]["sponsor"] = bill_json["results"][0]['sponsor']
                input_json["results"]["votes"][l]["bill"]["sponsor_party"] = bill_json["results"][0]['sponsor_party']
                input_json["results"]["votes"][l]["bill"]["sponsor_state"] = bill_json["results"][0]['sponsor_state']
                input_json["results"]["votes"][l]["bill"]["subject"] = bill_json["results"][0]['primary_subject']
        # else if "nomination" in input_json["results"]["votes"][l]:
        #     if "nomination_id" in input_json["results"]["votes"][l]["nomination"]:
        #         nom_id = input_json["results"]["votes"][l]["nomination"]["nomination_id"]
        #         congress_session = input_json["results"]["votes"][l]["congress"]
        #         nom_pull = requests.get("https://api.propublica.org/congress/v1/%s/nominees/%s.json" %(congress_session,nom_id),headers={"X-API-KEY":"nMQfwKZ1yz3mcfOh1nYWp3l0BTrM8HgH8GM6kqml"})     
    return json.dumps(input_json)

House_w_urls = pull_urls(NJ_house_votes_json)


with open("data/Recent_house_votes.json", "w+") as file:
	file.write(House_w_urls)


#3b. same thing for senate
votes_senate_url = votes_senate_root + str(last_month) +"-" + str(lastday.strftime("%d")) + "/" + str(today.strftime("%Y-%m-%d")) +  ".json"
NJ_senate_votes = requests.get(votes_senate_url,headers={"X-API-KEY":propublica_api_key})
NJ_senate_votes_json = NJ_senate_votes.json()
Senate_w_urls = pull_urls(NJ_senate_votes_json)

with open("data/Recent_senate_votes.json", "w+") as file:
	file.write(Senate_w_urls)


#4. quickly grab timestamp
with open("data/date_updated.txt", "w+") as file:
    file.write(str(today))

