import json_data from './players.json' assert {type: 'json'};

var players = [];

for(var i in json_data)
    players.push([i, json_data [i]]);

const teams = ["ATL", "BOS", "BRK", "CHI", "CHO", "CLE", "DAL", 
         "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL",
         "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC",
         "ORL", "PHI", "PHO", "POR", "SAC", "SAS", "TOR",
         "UTA", "WAS"];


function createStatsDiv(playerInTeam){
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    const parentDiv = document.createElement('div');
    parentDiv.className = 'player';

    const img = document.createElement('img');
    img.className = 'logos';
    img.src = '/images/' + playerInTeam.team + '.svg';
    cardDiv.appendChild(img);

    const childDiv1 = document.createElement('div');
    childDiv1.className = 'name';
    childDiv1.innerHTML = playerInTeam.name;
    parentDiv.appendChild(childDiv1);

    const childDiv2 = document.createElement('div');
    childDiv2.className = 'contract';
    childDiv2.innerHTML = "$" + Math.round(playerInTeam.contract / 1000000) + "M" + " / " + playerInTeam.years + "Yr";
    parentDiv.appendChild(childDiv2);

    const childDiv3 = document.createElement('div');
    childDiv3.className = 'age';
    childDiv3.innerText = "Age: " + playerInTeam.age;
    parentDiv.appendChild(childDiv3);

    const childDiv4 = document.createElement('div');
    childDiv4.className = 'ppg';
    childDiv4.innerText = "PPG: " + playerInTeam.ppg;
    parentDiv.appendChild(childDiv4);

    const childDiv5 = document.createElement('div');
    childDiv5.className = 'ast';
    childDiv5.innerText = "AST: " + playerInTeam.ast;
    parentDiv.appendChild(childDiv5);

    const childDiv6 = document.createElement('div');
    childDiv6.className = 'reb';
    childDiv6.innerText = "REB: " + playerInTeam.trb;
    parentDiv.appendChild(childDiv6);

    cardDiv.appendChild(parentDiv)

    return cardDiv;
}

function playerOptions(selector){
    var e = document.getElementById(selector);
    var selectedTeam = e.options[e.selectedIndex].text;
    var selectedIndex = e.value;
    const playerDiv = document.getElementById('roster__view');
    const parentDiv = document.createElement('div');
    parentDiv.className = 'team';

    for (var i = 0; i < players[0][1].length; i++){
        
        let playerInTeam = players[0][1][i];

        if(playerInTeam.num > selectedIndex){
            break;
        }

        if (playerInTeam.team == selectedTeam){
            const childDiv = createStatsDiv(playerInTeam);

            parentDiv.appendChild(childDiv);
        }
    }
    playerDiv.appendChild(parentDiv);
}

function teamOptions1(){
    var select = document.getElementById('selector1');

    for (var i = 0; i < teams.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = teams[i];
        select.appendChild(opt);
    }

}

function teamOptions2(){
    var select2 = document.getElementById('selector2');

    for (var i = 0; i < teams.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = teams[i];
        select2.appendChild(opt);
    }
}

function updateOptions1(){
    console.log("hello");
}

function refreshPlayers(selector){
    const updateTeam = document.getElementById(selector);

    updateTeam.onchange = function updateTeam1(){
        const divElements = document.querySelectorAll('.team');
        divElements.forEach(div => div.remove());
        playerOptions('selector1');
        playerOptions('selector2');
    }
}

  
teamOptions1();

teamOptions2();

playerOptions('selector1');
playerOptions('selector2');

refreshPlayers('selector1');
refreshPlayers('selector2');

// const teamOneContracts = document.getElementById("team_1_contracts");
// teamOneContracts.append("Contract Totals: " + "$" + 0);

// const teamTwoContracts = document.getElementById("team_2_contracts");
// teamTwoContracts.append("Contract Totals: " + "$" + 0);