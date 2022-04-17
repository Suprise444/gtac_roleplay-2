// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: race.js
// DESC: Provides racing usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

function initRaceScript() {
	if(!getServerConfig().devServer) {
		getServerData().races = loadRacesFromDatabase();
	}

	setRaceDataIndexes();
}

// ===========================================================================

/**
 * @param {Number} raceId - The data index of the race
 * @return {RaceData} The race's data (class instance)
 */
function getRaceData(raceId) {
	if(typeof getServerData().races[raceId] != "undefined") {
		return getServerData().races[raceId];
	}
	return false;
}

// ===========================================================================