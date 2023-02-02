let xhr = new XMLHttpRequest();
xhr.open("GET", "/players.json", true);
xhr.responseType = "json";
xhr.onload = function () {
  if (xhr.status === 200) {
    let json_data = xhr.response;
    console.assert(typeof json_data === "object", "json_data is not an object");

    let players = [];

    for (let i in json_data) players.push([i, json_data[i]]);

    const teams = ["ATL", "BOS", "BRK", "CHI", "CHO", "CLE", "DAL", 
            "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL",
            "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC",
            "ORL", "PHI", "PHO", "POR", "SAC", "SAS", "TOR",
            "UTA", "WAS"]; //prettier-ignore

    const playersInTrade1 = document.getElementById("trade__side__1") //prettier-ignore
    const contractTotals1 = document.getElementById("contract__var1");
    const capCleared1 = document.getElementById("net__gain1") //prettier-ignore
    const playersInTrade2 = document.getElementById("trade__side__2") //prettier-ignore
    const contractTotals2 = document.getElementById("contract__var2");
    const capCleared2 = document.getElementById("net__gain2") //prettier-ignore

    function clearTotals() {
      if (playersInTrade1.innerHTML == "" && playersInTrade2.innerHTML == "") {
        contractTotals1.innerHTML = 0;
        capCleared1.innerHTML = 0;
        contractTotals2.innerHTML = 0;
        capCleared2.innerHTML = 0;
      }
    }

    function clickCard(playerInTeam, tradeNum, card) {
      card.addEventListener("click", function () {
        const targetDiv = tradeNum == 1 ? "trade__side__1" : "trade__side__2";
        const targetDivElement = document.getElementById(targetDiv);
        const returnDiv = document.getElementById("team" + tradeNum);
        const contractVar = document.getElementById(`contract__var${tradeNum}`);
        const oldValue = parseFloat(contractVar.innerHTML);
        const firstYear = parseFloat((playerInTeam.firstYear / 1000000).toFixed(1)); //prettier-ignore

        //Removing card from trade
        if (targetDivElement.contains(card)) {
          // remove card and subtract values
          targetDivElement.removeChild(card);
          returnDiv.appendChild(card);

          contractVar.innerHTML = (oldValue - firstYear).toFixed(1);

          const oppositeTradeNum = tradeNum == 1 ? 2 : 1;
          const netLoss = document.getElementById(`net__gain${oppositeTradeNum}`); //prettier-ignore

          const netLossOldValue = parseFloat(netLoss.innerHTML);
          netLoss.innerHTML = (netLossOldValue + firstYear).toFixed(1);

          const netGain = document.getElementById(`net__gain${tradeNum}`);
          const netGainOldValue = parseFloat(netGain.innerHTML);
          netGain.innerHTML = (netGainOldValue - firstYear).toFixed(1);
          clearTotals();
        }
        //Adding cards to trade
        else {
          // add card and add values
          targetDivElement.appendChild(card);

          const total = parseFloat(oldValue) + parseFloat(firstYear);

          contractVar.innerHTML = total.toFixed(1);

          const oppositeTradeNum = tradeNum == 1 ? 2 : 1;
          const netLoss = document.getElementById(`net__gain${oppositeTradeNum}`); //prettier-ignore

          const netLossOldValue = parseInt(netLoss.innerHTML);
          netLoss.innerHTML = (netLossOldValue - firstYear).toFixed(1);

          const netGain = document.getElementById(`net__gain${tradeNum}`);
          const netGainOldValue = parseInt(netGain.innerHTML);
          netGain.innerHTML = (netGainOldValue + firstYear).toFixed(1);
        }
      });
    }

    function createStatsDiv(playerInTeam, i, tradeNum) {
      const card = document.createElement("div");
      card.className = "card";
      card.id = "card" + i;

      const player = document.createElement("div");
      player.className = "player";

      const img = new Image();
      img.className = "logos";
      img.src = "images/" + playerInTeam.team + ".svg";
      card.appendChild(img);

      const classNames = ["name", "contract", "age", "ppg", "ast", "reb"];
      const innerTexts = [
        playerInTeam.name,
        "$" + (playerInTeam.firstYear / 1000000).toFixed(1) + "M" + " - " + playerInTeam.years + "Yr", //prettier-ignore
        "Age: " + playerInTeam.age,
        "PPG: " + playerInTeam.ppg,
        "AST: " + playerInTeam.ast,
        "REB: " + playerInTeam.trb, //prettier-ignore
      ];

      for (let j = 0; j < classNames.length; j++) {
        const elem = document.createElement("div");
        elem.className = classNames[j];
        elem.innerText = innerTexts[j];
        player.appendChild(elem);
      }

      card.appendChild(player);
      clickCard(playerInTeam, tradeNum, card);

      return card;
    }

    function playerOptions(selector, teamNum) {
      let e = document.getElementById(selector);
      let selectedTeam = e.options[e.selectedIndex].text;
      let selectedIndex = e.value;
      let teamPayroll = 0;

      const payrollDiv = document.getElementById("payroll" + teamNum);
      const capDiv = document.getElementById("cap" + teamNum);

      const playerDiv = document.getElementById("roster__view");
      const parentDiv = document.createElement("div");
      parentDiv.className = "team";
      parentDiv.id = "team" + teamNum;

      for (let i = 0; i < players[0][1].length; i++) {
        let playerInTeam = players[0][1][i];

        if (playerInTeam.num > selectedIndex) {
          break;
        }

        if (playerInTeam.team == selectedTeam && playerInTeam.firstYear > 0) {
          const childDiv = createStatsDiv(playerInTeam, i, teamNum);
          teamPayroll += playerInTeam.firstYear;

          parentDiv.appendChild(childDiv);
        }
      }

      payrollDiv.innerHTML = "Active Roster Cap: $" + teamPayroll.toLocaleString("en-US"); //prettier-ignore
      capDiv.innerHTML = "Current Cap Space: $" + (123655000 - teamPayroll).toLocaleString("en-US"); //prettier-ignore
      playerDiv.appendChild(parentDiv);
    }

    function teamOptions(selectorId) {
      let select = document.getElementById(selectorId);

      for (let i = 0; i < teams.length; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = teams[i];
        select.appendChild(opt);
      }
    }

    function refreshPlayers(selector) {
      const updateTeam = document.getElementById(selector);

      updateTeam.onchange = function updateTeam1() {
        const divElements = document.querySelectorAll(".team");
        divElements.forEach((div) => div.remove());
        for (let i = 1; i < 3; i++) {
          const tradeView = document.getElementById("trade__side__" + i);
          const contractTotals = document.getElementById("contract__var" + i);
          const netGain = document.getElementById("net__gain" + i);
          tradeView.innerHTML = "";
          contractTotals.innerHTML = 0;
          netGain.innerHTML = 0;
        }
        playerOptions("selector1", 1);
        playerOptions("selector2", 2);
      };
    }

    teamOptions("selector1");

    teamOptions("selector2");

    playerOptions("selector1", 1);
    playerOptions("selector2", 2);

    refreshPlayers("selector1");
    refreshPlayers("selector2");
  }
};
xhr.send();
