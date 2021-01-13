//v1.016 2021-01-13
let urlHttpServiceLichess = "https://lichess.org/api/user/";
let urlHttpServiceChessCom = "https://api.chess.com/pub/player/";
let intervalID;
let isFirstChessCom = false, inputNode1, inputNode2, tableNode1, tableNode2;

inputNode1 = InputOrder1;
inputNode2 = InputOrder2;
tableNode1 = TableOrder1;
tableNode2 = TableOrder2;

//localStorage.setItem("isFirstChessCom", "");
getDataFromStorage();

//set first chess.com
if (isFirstChessCom) {
  changeTablesOrder();
}

refresh();

elemCheckLichess.onclick = () => refreshLichess(); //refresh by click on checkBox of Lichess
elemCheckChessCom.onclick = () => refreshChessCom(); //refresh by click on checkBox of ChessCom

document.querySelector('.projectName').onclick = () => refresh(); //refresh by click on projectName
document.querySelector('.THeadLichess').onclick = () => refreshLichess(); //refresh by click on Head of Lichess Table
document.querySelector('.THeadChessCom').onclick = () => refreshChessCom(); //refresh by click on Head of ChessCom Table

buttonSettings.onclick = () => goSetMode();
buttonChangeTables.onclick = () => buttonChangeTablesFunction();
buttonReturnToMain.onclick = () => goMainMode();

//hot keys
document.addEventListener('keydown', function (event) {
  if (event.key === "Enter") { //Enter
    refresh();
  }
});

////////// T E S T //////////

// elemButtonTest.onclick = () => Test();

// function Test() {
// }

/////////////////////////////////////////////////////////////////////////////

//refresh Lichess
function refreshLichess() {
  thisIsLichess = true;
  clearTable(thisIsLichess);
  refreshOneTable(thisIsLichess);
  setDataToStorage();
}

//refresh Chess.com
function refreshChessCom() {
  thisIsLichess = false;
  clearTable(thisIsLichess);
  refreshOneTable(thisIsLichess);
  setDataToStorage();
}

//refresh all tables
function refresh() {
  clearAllTables();
  refreshOneTable(true);
  refreshOneTable(false);
  setDataToStorage();
}

function refreshOneTable(thisIsLichess) {
  SelectorTable = thisIsLichess ? ".TableLichess" : ".TableChessCom";
  SelectorCheck = thisIsLichess ? "elemCheckLichess" : "elemCheckChessCom";
  let elem = document.querySelector(SelectorTable);
  if (document.getElementById(SelectorCheck).checked) {
    if (elem.style.display !== 'block') {
      elem.style.display = 'block'; //table is visible
    }
    clearTable(thisIsLichess);
    fillTable(thisIsLichess);
  } else {
    if (elem.style.display !== 'none') {
      elem.style.display = 'none'; //table is non-visible
    }
  }
}

function clearAllTables() {
  clearTable(true);
  clearTable(false);
}

function clearTable(thisIsLichess) {
  const pref = thisIsLichess ? '.l' : '.c';
  n = getTableRowsNumber(thisIsLichess);
  for (let step = 0; step < n; step++) {
    const rowNum = step + 1;
    document.querySelector(pref + 'player' + rowNum).innerHTML = ""; //innerHTML (because 'href')
    document.querySelector(pref + 'bullet' + rowNum).textContent = "";
    document.querySelector(pref + 'blitz' + rowNum).textContent = "";
    document.querySelector(pref + 'rapid' + rowNum).textContent = "";
    document.querySelector(pref + 'puzzle' + rowNum).textContent = "";
  }
}

//clear all cells at row (exception: Player)
function clearRow(thisIsLichess, rowNum) {
  const pref = thisIsLichess ? '.l' : '.c';
  document.querySelector(pref + 'bullet' + rowNum).textContent = "";
  document.querySelector(pref + 'blitz' + rowNum).textContent = "";
  document.querySelector(pref + 'rapid' + rowNum).textContent = "";
  document.querySelector(pref + 'puzzle' + rowNum).textContent = "";
}

function clearRowLichess(rowNum) {
  const thisIsLichess = true;
  clearRow(thisIsLichess, rowNum);
}

function clearRowChessCom(rowNum) {
  const thisIsLichess = false;
  clearRow(thisIsLichess, rowNum);
}

function fillTable(thisIsLichess) {
  let elem, playerNames, arPlayerNames, rowNum;
  elem = getElementInputPlayers(thisIsLichess);
  playerNames = elem.value.trim(); //delete begin and end spaces
  arPlayerNames = playerNames.split(" "); //get array of Player's names
  rowNum = 0;
  for (let step = 0; step < arPlayerNames.length; step++) {
    playerName = arPlayerNames[step];
    if (playerName !== "") {
      if (++rowNum > getTableRowsNumber(thisIsLichess)) {
        addRowToTable(thisIsLichess, rowNum);
      }
      fetchTable(thisIsLichess, rowNum, playerName);
    }
  }
  //delete unnecessary last rows (if number of players less than number of rows)
  for (let j = 0; j < 100; j++) {
    if (rowNum++ >= getTableRowsNumber(thisIsLichess)) {
      break;
    }
    deleteLastRowFromTable(thisIsLichess);
  }
}

function getElementInputPlayers(thisIsLichess) {
  elem = thisIsLichess ? document.getElementById("elemTextLichessOrgPlayerNames") :
    document.getElementById("elemTextChessComPlayerNames");
  return elem;
}

function fetchTable(thisIsLichess, rowNum, playerName) {
  thisIsLichess ? fetchGetLichessOrg(rowNum, playerName) :
    fetchGetChessCom(rowNum, playerName);
}

function getTableRowsNumber(thisIsLichess) {
  const tableRef = getChessTableRef(thisIsLichess);
  return tableRef.rows.length;
}

function getChessTableRef(thisIsLichess) {
  const tableName = thisIsLichess ? '.TBodyLichess' : '.TBodyChessCom';
  const tableRef = document.querySelector(tableName);
  return tableRef;
}

function deleteLastRowFromTable(thisIsLichess) {
  const tableRef = getChessTableRef(thisIsLichess);
  tableRef.deleteRow(-1);
}

function addRowToTable(thisIsLichess, rowNum) {

  let atrClass;
  const letter = thisIsLichess ? 'l' : 'c';

  //create DOM-elements
  const tableRef = getChessTableRef(thisIsLichess);
  //const trRef = document.createElement('tr');
  const trRef = tableRef.insertRow();

  //player
  const textPlayerRef = document.createTextNode('player' + rowNum);
  const thRef = document.createElement('th');
  thRef.setAttribute('scope', 'row');
  atrClass = letter + 'player' + rowNum;
  thRef.setAttribute('class', atrClass);

  //bullet
  const tdBulletRef = document.createElement('td');
  atrClass = letter + 'bullet' + rowNum;
  tdBulletRef.setAttribute('class', atrClass);

  //blitz
  const tdBlitzRef = document.createElement('td');
  atrClass = letter + 'blitz' + rowNum;
  tdBlitzRef.setAttribute('class', atrClass);

  //rapid
  const tdRapidRef = document.createElement('td');
  atrClass = letter + 'rapid' + rowNum;
  tdRapidRef.setAttribute('class', atrClass);

  //puzzle
  const tdPuzzleRef = document.createElement('td');
  atrClass = letter + 'puzzle' + rowNum;
  tdPuzzleRef.setAttribute('class', atrClass);

  //new DOM-elements join to elements on HTML-page
  tableRef.appendChild(trRef);
  trRef.appendChild(thRef);
  thRef.appendChild(textPlayerRef);
  trRef.appendChild(tdBulletRef);
  trRef.appendChild(tdBlitzRef);
  trRef.appendChild(tdRapidRef);
  trRef.appendChild(tdPuzzleRef);
  // trRef.appendChild(tdOnlineRef);
}

//------------------------------------------------------
//fill table's row for player on Lichess.org
async function fetchGetLichessOrg(rowNum, playerName) {

  console.log("fetchGetLichessOrg, " + playerName + " - begin ------------------------------");

  clearRowLichess(rowNum);

  const url = urlHttpServiceLichess + playerName;
  const response = await fetch(url);
  if (response.ok) { // HTTP-state in 200-299
    const jsonObj = await response.json(); // read answer in JSON

    const isOnline = getJsonValue1(playerName, jsonObj, "online");
    const onlineSymbol = isOnline ? getOnlineSymbol() + " " : "";

    //player (href !)
    const playerURL = getJsonValue1(playerName, jsonObj, "url");
    document.querySelector('.lplayer' + rowNum).innerHTML = '<a href="' + playerURL + '">' + onlineSymbol + playerName + '</a>';

    //bullet
    document.querySelector('.lbullet' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "perfs", "bullet", "rating");
    //blitz
    document.querySelector('.lblitz' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "perfs", "blitz", "rating");
    //rapid
    document.querySelector('.lrapid' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "perfs", "rapid", "rating");
    //puzzle
    document.querySelector('.lpuzzle' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "perfs", "puzzle", "rating");

  } else {
    console.log(playerName + " - this is 1st error HTTP: " + response.status);
    //player not found
    document.querySelector('.lplayer' + rowNum).innerHTML = "? " + playerName;
  };
  console.log("fetchGetLichessOrg, " + playerName + " - end");
}

//------------------------------------------------------
//fill table's row for player on Chess.com
async function fetchGetChessCom(rowNum, playerName) {

  console.log("fetchGetChessCom, " + playerName + " - begin ------------------------------");

  let url, response, cell, createdAt, last_online;
  let playerURL = "", onlineSymbol = "";

  clearRowChessCom(rowNum);

  //is-online
  url = urlHttpServiceChessCom + playerName + "/is-online";
  try {
    response = await fetch(url);
    if (response.ok) { // HTTP-state in 200-299
      let jsonObj = await response.json(); // read answer in JSON
      let isOnline = getJsonValue1(playerName, jsonObj, "online");
      onlineSymbol = isOnline ? getOnlineSymbol() + " " : "";
    } else {
      console.log(playerName + " - this is 4 error HTTP: " + response.status);
    };
  } catch (err) {
    console.log(playerName + " - this is 4b error HTTP: " + err);
  }

  //player, playerURL, createdAt
  url = urlHttpServiceChessCom + playerName;
  try {
    response = await fetch(url); //async variant
    if (response.ok) { // HTTP-state in 200-299
      let jsonObj = await response.json(); // read answer in JSON
      playerURL = getJsonValue1(playerName, jsonObj, "url");
    } else {
      console.log(playerName + " - this is 2a error HTTP: " + response.status);
    };
  } catch (err) {
    console.log(playerName + " - this is 2b error HTTP: " + err);
  } finally {
    //player
    cell = document.querySelector('.cplayer' + rowNum);
    if (playerURL === ""
      || playerURL === undefined) {
      cell.innerHTML = "? " + playerName; //player not found
    }
    else {
      cell.innerHTML = '<a href="' + playerURL + '">' + onlineSymbol + playerName + '</a>';
    }
  }

  //blitz, bullet, rapid, puzzle/rush
  url = urlHttpServiceChessCom + playerName + "/stats";
  response = await fetch(url);
  if (response.ok) { // HTTP-state in 200-299
    let jsonObj = await response.json(); // read answer in JSON
    //bullet
    document.querySelector('.cbullet' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "chess_bullet", "last", "rating");
    //blitz
    document.querySelector('.cblitz' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "chess_blitz", "last", "rating");
    //rapid
    document.querySelector('.crapid' + rowNum).textContent = getJsonValue3(playerName, jsonObj, "chess_rapid", "last", "rating");
    //max puzzle / rush
    tactics = getJsonValue3(playerName, jsonObj, "tactics", "highest", "rating");
    rush = getJsonValue3(playerName, jsonObj, "puzzle_rush", "best", "score");
    // value = (tactics !== "" || rush !== "") ? puzzle = tactics + " / " + rush : "";
    value = (tactics !== "" || rush !== "") ? tactics + " / " + rush : "";
    document.querySelector('.cpuzzle' + rowNum).textContent = value;
  } else {
    console.log(playerName + " - this is 3 error HTTP: " + response.status);
  };

  console.log("fetchGetChessCom, " + playerName + " - end");
}

function getJsonValue1(playerName, jsonObj, field1) {
  value = "";
  try {
    value = jsonObj[field1];
  }
  catch (err) {
    console.log("Error in getJsonValue1(): playerName=" + playerName + " " + field1 + ": " + err);
  }
  return value;
}

function getJsonValue3(playerName, jsonObj, field1, field2, field3) {
  value = "";
  try {
    value = jsonObj[field1][field2][field3];
  }
  catch (err) {
    console.log("Error in getJsonValue3(): playerName=" + playerName + " " + field1 + "." + field2 + "." + field3 + ": " + err);
  }
  return value;
}

function getOnlineSymbol() {
  return "&#10004;"; //check
}

///////////////////////////////////////////////////////////

function goSetMode() {
  document.querySelector("main").style.display = 'none'; //section is non-visible
  document.querySelector(".sectionSettingsArea").style.display = 'block'; //section is visible
}

function goMainMode() {

  //AutoRefreshInterval is correct ?
  let s = document.getElementById("elemAutoRefreshInterval").value.trim();
  if (s !== "") {
    let n = parseInt(s, 10);
    if (isNaN(n) || !(Number.isInteger(n) && n >= 0 && n <= 9999)) {
      alert('Interval must be between 0 and 9999 !');
      return; //not correct
    }
    s = n.toString(10);
  }
  document.getElementById("elemAutoRefreshInterval").value = s; //correct
  localStorage.setItem("AutoRefreshInterval", s);
  SetAutoRefresh();

  document.querySelector(".sectionSettingsArea").style.display = 'none'; //section is non-visible
  document.querySelector("main").style.display = 'block'; //section is visible
}

function buttonChangeTablesFunction() {
  changeTablesOrder();
  setFirstChessComToStorage();
}

//////////////////////////////////////////////////////////

function getDataFromStorage() {
  let playerNames = localStorage.getItem("LichessOrgPlayerNames");
  if (playerNames !== "") {
    document.getElementById("elemTextLichessOrgPlayerNames").value = playerNames;
  }

  playerNames = localStorage.getItem("ChessComPlayerNames");
  if (playerNames !== "") {
    document.getElementById("elemTextChessComPlayerNames").value = playerNames;
  }

  let v = localStorage.getItem("LichessChecked");
  document.getElementById("elemCheckLichess").checked = (v === "1" ? true : false);

  v = localStorage.getItem("ChessComChecked");
  document.getElementById("elemCheckChessCom").checked = (v === "1" ? true : false);

  v = localStorage.getItem("isFirstChessCom");
  isFirstChessCom = (v === "1" ? true : false);

  v = localStorage.getItem("AutoRefreshInterval");
  document.getElementById("elemAutoRefreshInterval").value = v;
}

function setDataToStorage() {
  let playerNames = document.getElementById("elemTextLichessOrgPlayerNames").value;
  localStorage.setItem("LichessOrgPlayerNames", playerNames);

  playerNames = document.getElementById("elemTextChessComPlayerNames").value;
  localStorage.setItem("ChessComPlayerNames", playerNames);

  let v = document.getElementById("elemCheckLichess").checked ? "1" : "0";
  localStorage.setItem("LichessChecked", v);

  v = document.getElementById("elemCheckChessCom").checked ? "1" : "0";
  localStorage.setItem("ChessComChecked", v);
}

function setFirstChessComToStorage() {
  isFirstChessCom = !isFirstChessCom;
  const v = (isFirstChessCom ? "1" : "");
  localStorage.setItem("isFirstChessCom", v);
}

///////////////////////////////////////////////////////////

function SetAutoRefresh() {
  clearInterval(intervalID);
  let s = document.getElementById("elemAutoRefreshInterval").value.trim();
  if (s !== "") {
    let n = parseInt(s, 10);
    if (n !== 0) {
      let milliSeconds = n * 60 * 1000;
      intervalID = setInterval(refresh, milliSeconds);
    }
  }
}

function changeTablesOrder() {
  let t;

  inputNode2.parentNode.insertBefore(inputNode2, inputNode1);
  t = inputNode1;
  inputNode1 = inputNode2;
  inputNode2 = t;

  tableNode2.parentNode.insertBefore(tableNode2, tableNode1);
  t = tableNode1;
  tableNode1 = tableNode2;
  tableNode2 = t;
}

///////////////////////////////////////////////////////////

//get date & time in: YYYY-MM-DD HH:MM:SS
function getDateTime(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; //"+1", because return: from 0 to 11
  let dayOfMonth = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  //formatting
  //year = year.toString().slice(-2); //year in 2 digit
  year = year.toString();
  month = month < 10 ? '0' + month : month;
  dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
  hour = hour < 10 ? '0' + hour : hour;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return `${year}-${month}-${dayOfMonth} ${hour}:${minutes}:${seconds}`
}

//get date in: YYYY-MM-DD
function getDateYYYYMMDD(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1; //"+1", because return: from 0 to 11
  let dayOfMonth = date.getDate();

  //formatting
  //year = year.toString().slice(-2); //year in 2 digit
  year = year.toString();
  month = month < 10 ? '0' + month : month;
  dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

  return `${year}-${month}-${dayOfMonth}`
}
