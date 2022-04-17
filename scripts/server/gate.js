// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: gate.js
// DESC: Provides gate functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

function doesPlayerHaveGateKeys(client, vehicle) {
	let gateData = getGateData(vehicle);

	if(gateData.ownerType == VRR_GATEOWNER_PUBLIC) {
		return true;
	}

	if(gateData.ownerType == VRR_GATEOWNER_PLAYER) {
		if(gateData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_CLAN) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if(gateData.clanRank <= getPlayerCurrentSubAccount(client).clanRank) {
				return true;
			}
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_FACTION) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageFactions"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).faction) {
			if(gateData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
				return true;
			}
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_JOB) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).job) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_BUSINESS) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
			return true;
		}

		if(canPlayerManageBusiness(client, getBusinessIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_HOUSE) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
			return true;
		}

		if(canPlayerManageHouse(client, getHouseIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getGateData(gateId) {
	if(typeof getServerData().gates[gateId] != "undefined") {
		return getServerData().gates[gateId];
	}

	return false;
}

// ===========================================================================

function getClosestGate(position) {
	let closest = 0;
	for(let i in getServerData().gates[getServerGame()]) {
		if(getDistance(getServerData().gates[i].position, position) < getDistance(getServerData().gates[closest].position, position)) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

function triggerGateCommand(command, params, client) {
	let closestGate = getClosestGate(getPlayerPosition(client));

	if(!getGateData(closestGate)) {
		messagePlayerError(client, getLocaleString(client, "InvalidGate"));
	}

	if(!canPlayerUseGate(client, closestGate)) {
		messagePlayerError(client, getLocaleString(client, "NoGateAccess"));
		return false;
	}

	triggerGate(getGateData(closestGate).scriptName);
}

// ===========================================================================