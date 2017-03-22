import requests
import datetime
import json

#Part 1. Retrieve latest list of House and Senate members

NJ_house_members = requests.get("https://api.propublica.org/congress/v1/members/house/NJ/current.json",headers={"X-API-KEY":"NICE-TRY-HACKERS"})
NJ_senate_members = requests.get("https://api.propublica.org/congress/v1/members/senate/NJ/current.json", headers={"X-API-KEY":"NICE-TRY-HACKERS"})


file = open("data/NJ_house_members.json", "w+")
file.write(NJ_house_members.text)
file.close()

file = open("data/NJ_senate_members.json", "w+")
file.write(NJ_senate_members.text)
file.close()

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
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":"NICE-TRY-HACKERS"})
    with open("data/House/%s.json" %n, "w+") as file:
		file.write(detailed_list.text)     
    # file = open("data/House/%s.json" %n, "w")
    # file.write(detailed_list.text)
    # file.close()

#2c. Get latest votes
for n in house_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":"NICE-TRY-HACKERS"})
    votes_json = member_votes.json()
    #trying to get the bill urls
    for l in range(0, len(votes_json["results"][0]["votes"])):
        if "bill" in votes_json["results"][0]["votes"][l]:
            if "bill_uri" in votes_json["results"][0]["votes"][l]["bill"]:
                bill_url = votes_json["results"][0]["votes"][l]["bill"]["bill_uri"]
                bill_pull = requests.get(bill_url, headers={"X-API-KEY":"NICE-TRY-HACKERS"})
                bill_json = bill_pull.json()
                votes_json["results"][0]["votes"][l]["bill"]["gov-url"] = bill_json["results"][0]['congressdotgov_url']
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage" or votes_json["results"][0]["votes"][d]["question"] == "On the Joint Resolution" or votes_json["results"][0]["votes"][d]["question"] == "On the Nomination":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    revised_bill = json.dumps(revised_bill)
    with open("data/House/%s_votes_filtered.json" %n, "w+") as file:
		file.write(revised_bill)
    # file = open("data/House/%s_votes_filtered.json" %n, "w")
    # file.write(revised_bill)
    # file.close()

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
    detailed_list = requests.get("https://api.propublica.org/congress/v1/members/"+n+".json",headers={"X-API-KEY":"NICE-TRY-HACKERS"})
    with open("data/Senate/%s.json" %n, "w+") as file:
		file.write(detailed_list.text)    
    # file = open("data/Senate/%s.json" %n, "w")
    # file.write(detailed_list.text)
    # file.close()

for n in senate_ids_list:
    member_votes = requests.get("https://api.propublica.org/congress/v1/members/"+n+"/votes.json",headers={"X-API-KEY":"NICE-TRY-HACKERS"})
    votes_json = member_votes.json()
    revised_bill = []
    # create_vote_filter(votes_json, n)
    for d in range(0, len(votes_json["results"][0]["votes"])):
        if votes_json["results"][0]["votes"][d]["question"] == "On Passage of the Bill" or votes_json["results"][0]["votes"][d]["question"] == "On the Nomination" or votes_json["results"][0]["votes"][d]["question"] == "On the Joint Resolution":
            revised_bill.append(votes_json["results"][0]["votes"][d])
    revised_bill = json.dumps(revised_bill)
    with open("data/Senate/%s_votes_filtered.json" %n, "w+") as file:
		file.write(revised_bill)
    # file = open("data/Senate/%s_votes_filtered.json" %n, "w")
    # file.write(revised_bill)
    # file.close()


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
NJ_house_votes = requests.get(votes_house_url,headers={"X-API-KEY":"NICE-TRY-HACKERS"})

with open("data/Recent_house_votes.json", "w+") as file:
	file.write(NJ_house_votes.content)


#3b. same thing for senate
votes_senate_url = votes_senate_root + str(last_month) +"-" + str(lastday.strftime("%d")) + "/" + str(today.strftime("%Y-%m-%d")) +  ".json"
NJ_senate_votes = requests.get(votes_senate_url,headers={"X-API-KEY":"NICE-TRY-HACKERS"})

with open("data/Recent_senate_votes.json", "w+") as file:
	file.write(NJ_senate_votes.content)

#Part 4. Use bill parts to retrieve bill URLs


