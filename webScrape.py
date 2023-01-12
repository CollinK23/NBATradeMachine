from bs4 import BeautifulSoup
import requests
import pandas as pd
import json
import csv

teams = ["ATL", "BOS", "BRK", "CHI", "CHO", "CLE", "DAL", 
         "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL",
         "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC",
         "ORL", "PHI", "PHO", "POR", "SAC", "SAS", "TOR",
         "UTA", "WAS"]

allContracts = []
allStats = []
combined = {}

#urlTemplate = "https://www.basketball-reference.com/contracts/{}.html"
urlTemplate = "https://www.basketball-reference.com/teams/{}/2023.html"

def webScrape():
    #send Request to website
    for team in teams:
        url = urlTemplate.format(team)
        data = requests.get(url)

        with open("stats/{}.html".format(team), "w+", encoding="utf-8") as f:
            f.write(data.text)



def convertToCSV():
    for team in teams:
        with open("contracts/{}.html".format(team), encoding="utf-8") as f:
            page = f.read()
        soup = BeautifulSoup(page, "html.parser")
        soup.find('tr', class_="over_header").decompose()
        element = soup.find('tr', class_="partial_table")
        if element:
            element.decompose()
        contractTable = soup.find_all(id="contracts")
        contracts = pd.read_html(str(contractTable))[0].fillna(0)
        contracts[contracts.columns[2:9]] = contracts[contracts.columns[2:9]].replace('[\$,]', '', regex=True).astype(int)
        contracts["Team"] = team
        
        allContracts.append(contracts)

    teamContracts = pd.concat(allContracts)

    teamContracts.to_csv("contracts.csv")

def convertToCSV2():
    for team in teams:
        with open("stats/{}.html".format(team), encoding="utf-8") as f:
            page = f.read()
        soup = BeautifulSoup(page, "html.parser")
        statsTable = soup.find(id="per_game")
        stats = pd.read_html(str(statsTable))[0].fillna(0)

        del stats['Rk']
        del stats['eFG%']
        del stats['2P%']
        del stats['ORB']
        del stats['DRB']
        del stats['GS']
        del stats['G']
        del stats['PF']
        
        allStats.append(stats)

    teamStats = pd.concat(allStats)

    teamStats.to_csv("stats.csv")

def combineCSV():
    with open ("contracts.csv" , "r", encoding="utf-8") as csv1, open ("stats.csv" , "r", encoding="utf-8") as csv2:
        # Create a CSV reader for each file
        reader1 = csv.reader(csv1)
        reader2 = csv.reader(csv2)
        next(reader1)
        next(reader2)

        # Iterate through the rows of the first CSV file
        for row in reader1:
            # Get the player name
            name = row[1].replace(' ', '')
            # Add the data to the dictionary
            combined[name] = row

        # Iterate through the rows of the second CSV file
        for row in reader2:
            # Get the player name
            name = row[1].replace(' ', '')
            if name not in combined:
                continue
            else:
                combined[name].extend(row[2:])

def conJSON():
    data = {"players": []}
    for key in combined:
        if (combined[key][1] == 'Team Totals' or combined[key][1] == '0'):
            continue

        total = 0
        yearsRem = 0
        for i in range(3,9):
            total += int(combined[key][i])
            if (combined[key][i]) != "0":
                yearsRem += 1

        points = 0
        assists = 0
        reb = 0
        if len(combined[key]) == 31:
            points = combined[key][30]
            assists = combined[key][26]
            reb = combined[key][25]

        data["players"].append({
                "team": combined[key][10],
                "name": combined[key][1], 
                "age" : int(float(combined[key][2])),
                "years": yearsRem,
                "contract": total,
                "ppg" : points,
                "ast" : assists,
                "trb" : reb,
            })
    
    with open("players.json", "w") as f:
        json.dump(data, f, indent=4)

#webScrape()

#convertToCSV()

#convertToCSV2()

#convertToJSON()

combineCSV()

conJSON()