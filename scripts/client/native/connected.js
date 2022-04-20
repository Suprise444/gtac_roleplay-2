// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

function sendNetworkEventToPlayer(networkEvent, client, ...args) {
	triggerNetworkEvent.apply(null, networkEvent, client, args);
}

// ===========================================================================

function getPlayerPosition() {
	return localPlayer.position;
}

// ===========================================================================

function setPlayerPosition(position) {
	if(getGame() == VRR_GAME_GTA_IV) {
		natives.setCharCoordinates(localPlayer, position);
	} else {
		localPlayer.position = position;
	}
}

// ===========================================================================

function getElementPosition(element) {
	return element.position;
}

// ===========================================================================

function setElementPosition(element, position) {
	if(!element.isSyncer) {
		return false;
	}

	element.position = position;
}

// ===========================================================================

function deleteGameElement(element, position) {
	if(!element.isOwner) {
		return false;
	}

	destroyGameElement(element);
}

// ===========================================================================

function createGameVehicle(modelIndex, position, heading) {
	return game.createVehicle(getGameConfig().vehicles[getGame()][modelIndex][0], position, heading);
}

// ===========================================================================

function addNetworkEventHandler(eventName, handlerFunction) {
	addNetworkHandler(eventName, handlerFunction);
}

// ===========================================================================

function sendNetworkEventToServer(eventName, ...args) {
	let argsArray = [eventName];
	argsArray = argsArray.concat(args);
	triggerNetworkEvent.apply(null, argsArray);
}

// ===========================================================================

function getElementId(element) {
	return element.id;
}

// ===========================================================================

function getClientFromIndex(index) {
	let clients = getClients();
	for(let i in clients) {
		if(clients[i].index == index) {
			return clients[i];
		}
	}
}

// ===========================================================================

function getVehiclesInRange(position, distance) {
	return getElementsByType(ELEMENT_VEHICLE).filter(x => x.player && x.position.distance(position) <= distance);
}

// ===========================================================================

function getClientsInRange(position, distance) {
	return getPlayersInRange(position, distance);
}

// ===========================================================================

function getCiviliansInRange(position, distance) {
	return getElementsByType(ELEMENT_PED).filter(x => !x.isType(ELEMENT_PLAYER) && getElementPosition(x).position.distance(position) <= distance);
}

// ===========================================================================

function getPlayersInRange(position, distance) {
	return getClients().filter(x => getPlayerPosition(x).distance(position) <= distance);
}

// ===========================================================================

function getElementsByTypeInRange(elementType, position, distance) {
	return getElementsByType(elementType).filter(x => getElementPosition(x).position.distance(position) <= distance);
}

// ===========================================================================

function getClosestCivilian(position) {
	return getElementsByType(ELEMENT_PED).reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}

// ===========================================================================

function is2dPositionOnScreen(pos2d) {
	return pos2d.x >= 0 && pos2d.y >= 0 && pos2d.x <= game.width && pos2d.y <= game.height;
}

// ===========================================================================

function getVehiclesInRange(position, range) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	let inRangeVehicles = [];
	for(let i in vehicles) {
		if(getDistance(position, vehicles[i].position) <= range) {
			inRangeVehicles.push(vehicles[i]);
		}
	}
	return inRangeVehicles;
}

// ===========================================================================

function createGameBlip(blipModel, position, name = "") {
	if(getGame() == VRR_GAME_GTA_IV) {
		let blipId = natives.addBlipForCoord(position);
		if(blipId) {
			natives.changeBlipSprite(blipId, blipModel);
			natives.setBlipMarkerLongDistance(blipId, false);
			natives.setBlipAsShortRange(blipId, true);
			natives.changeBlipNameFromAscii(blipId, `${name.substr(0, 24)}${(name.length > 24) ? " ...": ""}`);
			return blipId;
		}
	}

	return -1;
}

// ===========================================================================

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if(entity != null) {
		return entity.setData(dataName, dataValue);
	}
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if(entity != null) {
		return entity.removeData(dataName);
	}
	return null;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if(entity != null) {
		return (entity.getData(dataName) != null);
	}
	return null;
}

// ===========================================================================

function preventDefaultEventAction(event) {
	event.preventDefault();
}

// ===========================================================================

function getPlayerId(client) {
	return client.index;
}

// ===========================================================================

function consolePrint(text) {
	console.log(text);
}

// ===========================================================================

function getPlayerName(client) {
	return client.name;
}

// ===========================================================================