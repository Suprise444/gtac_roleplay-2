// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

function receiveVehicleFromServer(vehicleId, position, model, colour1, colour2, colour3 = 0, colour4 = 0) {
	logToConsole(LOG_DEBUG, `[VRR.Job] Received vehicle ${vehicleId} (${getVehicleNameFromModel(model, getGame())}) from server`);

	if(getGame() == VRR_GAME_GTA_IV) {

	}
}

// ===========================================================================