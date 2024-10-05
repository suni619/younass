// Data structure to store the CSV data
let playerData = [];
let selectedPlayers = [];

// Fetch CSV file and initiate parsing and displaying
function loadCSVFile() {
  fetch('players.csv')  // Path to your CSV file
    .then(response => response.text())
    .then(data => {
      playerData = parseCSVData(data);  // Parse the CSV data and store it
      displayRoster(playerData);        // Display the data in a table
    })
    .catch(error => {
      console.error('Error fetching the CSV file:', error);
      // playerData = {
      //   name: "Test player",
      //   games: 10,
      //   ref: 1,
      //   lastRef: "2000-01-01",
      //   setup: 2,
      //   lastSetup: "2000-01-01",
      //   ratioGamesToRef: 100,
      //   ratioGamesToSetup: 100
      // };
      // displayRoster([playerData]);
    });
}

// Parse the CSV data and return an array of player objects
function parseCSVData(data) {
  const rows = data.split('\n');
  const parsedData = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (row) { // Ignore empty rows
      const cols = row.split(',');
      const games = parseInt(cols[1]);
      const ref = parseInt(cols[2]);
      const setup = parseInt(cols[4])

      const player = {
        name: cols[0],
        games: games,
        ref: ref,
        lastRef: cols[3],
        setup: setup,
        lastSetup: cols[5],
        ratioGamesToRef: ref > 0 ? games / ref : 100,
        ratioGamesToSetup: setup > 0 ? games / setup : 100
      };
      parsedData.push(player);
    }
  }
  return parsedData;  // Return the parsed data array
}

// Extract the player names from the data and return a sorted array
function getSortedPlayers(data) {
  const playerNames = data.map(player => player.player);  // Extract player field
  return playerNames.sort();  // Sort the player names alphabetically
}

// Display the data in the table
function displayRoster(data) {
  const tableBody = document.querySelector('#playerTable tbody');
  tableBody.innerHTML = ''; // Clear any existing data

  // Create a table row for each player object
  data.forEach(player => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    // Create an "Add" button for each player
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.className = 'btn btn-primary btn-sm';
    addButton.onclick = function () {
      addPlayerToSelection(player);  // Add player to the selected list
    };
    td.appendChild(addButton);
    tr.appendChild(td);

    Object.values(player).forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

// Add player to selectedPlayers array and update display
function addPlayerToSelection(player) {
  // Check if player is already selected
  if (!selectedPlayers.includes(player)) {
    selectedPlayers.push(player);  // Add to selectedPlayers array
    displaySelectedPlayers();  // Update the displayed selected list
  }
}

// Display the selected players
function displaySelectedPlayers() {
  const selectedList = document.querySelector('#selectedPlayersList');
  selectedList.innerHTML = '';  // Clear existing list

  selectedPlayers.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player.name;
    selectedList.appendChild(li);
  });
}

function assignDuties() {
  // assign refreshments
  selectedPlayers.sort((a, b) => {
    // sort by ratio in descending order
    if (a.ratioGamesToRef > b.ratioGamesToRef) return -1;
    if (a.ratioGamesToRef < b.ratioGamesToRef) return 1;

    // break tie using last assignment
    if (new Date(a.lastRef) < new Date(b.lastRef)) return -1;
    if (new Date(a.lastRef) > new Date(b.lastRef)) return 1;

    // no sorting needed
    return 0;
  });
  console.log(selectedPlayers);

  const refreshmentAssignedPlayer = selectedPlayers.shift();
  console.log("Ref", refreshmentAssignedPlayer);
  const refreshmentAssignedPlayerTag = document.querySelector('#refreshmentAssignedPlayer');
  refreshmentAssignedPlayerTag.textContent = refreshmentAssignedPlayer.name;
  document.querySelector('#refreshmentsCard').style.display = "block";

  // assign ground setup
  selectedPlayers.sort((a, b) => {
    // sort by ratio in descending order
    if (a.ratioGamesToSetup > b.ratioGamesToSetup) return -1;
    if (a.ratioGamesToSetup < b.ratioGamesToSetup) return 1;

    // break tie using last assignment
    if (new Date(a.lastSetup) < new Date(b.lastSetup)) return -1;
    if (new Date(a.lastSetup) > new Date(b.lastSetup)) return 1;

    // no sorting needed
    return 0;
  });

  const setupAssignedPlayerList = document.querySelector('#setupAssignedPlayers');
  setupAssignedPlayerList.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const setupAssignedPlayer = selectedPlayers.shift();
    const li = document.createElement('li');
    li.textContent = setupAssignedPlayer.name;
    setupAssignedPlayerList.appendChild(li);
    console.log("Setup", setupAssignedPlayer);
  }
  document.querySelector('#setupCard').style.display = "block";

  setupAssignedPlayerList.scrollIntoView({ behavior: 'smooth' });
  setupAssignedPlayerList.focus();
}

// assign duties
document.querySelector('#assignDutiesButton').addEventListener('click', assignDuties);

// Load CSV when the page loads
window.onload = function () {
  loadCSVFile();
};
