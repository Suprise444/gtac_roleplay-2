// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2021 Asshat-Gaming (https://asshatgaming.com)
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_INFO, "[Asshat.Business]: Initializing business script ...");
	getServerData().businesses = loadBusinessesFromDatabase();

	cacheAllBusinessItems();

	if(getServerConfig().createBusinessPickups) {
		createAllBusinessPickups();
	}

	if(getServerConfig().createBusinessPickups) {
		createAllBusinessBlips();
	}

	setAllBusinessIndexes();

	logToConsole(LOG_INFO, "[Asshat.Business]: Business script initialized successfully!");
	return true;
}

// ===========================================================================

function loadBusinessFromId(businessId) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM biz_main WHERE biz_id = ${businessId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new serverClasses.businessData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadBusinessesFromDatabase() {
	logToConsole(LOG_INFO, "[Asshat.Business]: Loading businesses from database ...");

	let tempBusinesses = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM biz_main WHERE biz_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessData = new serverClasses.businessData(dbAssoc);
					tempBusinessData.locations = loadBusinessLocationsFromDatabase(tempBusinessData.databaseId);
					tempBusinesses.push(tempBusinessData);
					logToConsole(LOG_INFO, `[Asshat.Business]: Business '${tempBusinessData.name}' (ID ${tempBusinessData.databaseId}) loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[Asshat.Business]: ${tempBusinesses.length} businesses loaded from database successfully!`);
	return tempBusinesses;
}

// ===========================================================================

function loadBusinessLocationsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[Asshat.Business]: Loading business locations for business ${businessId} from database ...`);

	let tempBusinessLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if(dbConnection) {
		dbQueryString = `SELECT * FROM biz_loc WHERE biz_loc_biz = ${businessId}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessLocationData = new serverClasses.businessLocationData(dbAssoc);
					tempBusinessLocations.push(tempBusinessLocationData);
					logToConsole(LOG_VERBOSE, `[Asshat.Business]: Location '${tempBusinessLocationData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[Asshat.Business]: ${tempBusinessLocations.length} location for business ${businessId} loaded from database successfully!`);
	return tempBusinessLocations;
}

// ===========================================================================

function createBusinessCommand(command, params, client) {
	let tempBusinessData = createBusiness(params, getPlayerPosition(client), toVector3(0.0, 0.0, 0.0), getGameConfig().pickupModels[getServerGame()].business, getGameConfig().blipSprites[getServerGame()].business, getPlayerInterior(client), getPlayerDimension(client));
	getServerData().businesses.push(tempBusinessData);

	createBusinessEntrancePickup(getServerData().businesses.length-1);
	createBusinessExitPickup(getServerData().businesses.length-1);
	createBusinessEntranceBlip(getServerData().businesses.length-1);
	createBusinessExitBlip(getServerData().businesses.length-1);

	saveBusinessToDatabase(getServerData().businesses.length-1);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]created business [#0099FF]${tempBusinessData.name}`);
}

// ===========================================================================

function createBusinessLocationCommand(command, params, client) {
	if(!isPlayerSpawned(client)) {
		messagePlayerError(client, "You must be spawned to use this command!");
		return false;
	}

	let locationType = toString(splitParams[0]);
	let businessId = (isPlayerInAnyBusiness(splitParams[1])) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let tempBusinessLocationData = createBusinessLocation(locationType, businessId);
	getServerData().businesses[businessId].push(tempBusinessLocationData);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]created location [#0099FF]${params} [#FFFFFF]for business [#0099FF]${tempBusinessData.name}`);
}

// ===========================================================================

function createBusiness(name, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInteriorId = 0, entranceVirtualWorld = 0, exitInteriorId = -1, exitVirtualWorld = -1, exitPickupModel = -1, exitBlipModel = -1) {
	let tempBusinessData = new serverClasses.businessData(false);
	tempBusinessData.name = name;

	tempBusinessData.entrancePosition = entrancePosition;
	tempBusinessData.entranceRotation = 0.0;
	tempBusinessData.entrancePickupModel = entrancePickupModel;
	tempBusinessData.entranceBlipModel = entranceBlipModel;
	tempBusinessData.entranceInterior = entranceInteriorId;
	tempBusinessData.entranceDimension = entranceVirtualWorld;

	tempBusinessData.exitPosition = exitPosition;
	tempBusinessData.exitRotation = 0.0;
	tempBusinessData.exitPickupModel = exitPickupModel;
	tempBusinessData.exitBlipModel = exitBlipModel;
	tempBusinessData.exitInterior = exitInteriorId;
	tempBusinessData.exitDimension = exitVirtualWorld;

	return tempBusinessData;
}

// ===========================================================================

function deleteBusinessCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]deleted business [#0099FF]${getBusinessData(businessId).name}`);
	deleteBusiness(businessId, getPlayerData(client).accountData.databaseId);
}

// ===========================================================================

function deleteBusinessLocationCommand(command, params, client) {
	//let businessId = toInteger(splitParams[1]);
	//deleteBusinessLocation(businessId);
	//messagePlayerSuccess(client, `Business '${tempBusinessData.name} deleted!`);
}

// ===========================================================================

function setBusinessNameCommand(command, params, client) {
	let newBusinessName = toString(params);

	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let oldBusinessName = getBusinessData(businessId).name;
	getBusinessData(businessId).name = newBusinessName;
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.name", getBusinessData(businessId).name, true);
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]renamed business [#0099FF]${oldBusinessName} [#FFFFFF]to [#0099FF]${newBusinessName}`);
}

// ===========================================================================

function setBusinessOwnerCommand(command, params, client) {
	let newBusinessOwner = getPlayerFromParams(params);
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!newBusinessOwner) {
		messagePlayerError(client, "Player not found!");
		return false;
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).ownerType = AG_BIZOWNER_PLAYER;
	getBusinessData(businessId).ownerId = getServerData().clients[newBusinessOwner.index].accountData.databaseId;
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]owner to [#AAAAAA]${newBusinessOwner.name}`);
}

// ===========================================================================

function setBusinessClanCommand(command, params, client) {
	let clanId = getClanFromParams(params);
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(!getClanData(clanId)) {
		messagePlayerError(client, "Clan not found!");
		return false;
	}

	getBusinessData(businessId).ownerType = AG_BIZOWNER_CLAN;
	getBusinessData(businessId).ownerId = getClanData(clanId).databaseId;
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]owner to the [#FF9900]${getClanData(clanId).name} [#FFFFFF]clan`);
}

// ===========================================================================

function setBusinessJobCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if(!areParamsEmpty(params)) {
		jobId = getJobIdFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, "Job not found!");
		return false;
	}

	getBusinessData(businessId).ownerType = AG_BIZOWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]owner to the [#FFFF00]${getJobData(jobId).name} [#FFFFFF]job`);
}

// ===========================================================================

function setBusinessPublicCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).ownerType = AG_BIZOWNER_PUBLIC;
	getBusinessData(businessId).ownerId = 0;
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]owner set to [#AAAAAA]public`);
}

// ===========================================================================

function lockBusinessCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).locked = !getBusinessData(businessId).locked;
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.locked", getBusinessData(businessId).locked, true);
	messagePlayerSuccess(client, `${getLockedUnlockedEmojiFromBool((getBusinessData(businessId).locked))} Business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]${getLockedUnlockedTextFromBool((getBusinessData(businessId).locked))}!`);
}

// ===========================================================================

function setBusinessEntranceFeeCommand(command, params, client) {
	let splitParams = params.split(" ");
	let entranceFee = toInteger(splitParams[0]) || 0;
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).entranceFee = entranceFee;
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]entrance fee to [#AAAAAAA]$${entranceFee}`);
}

// ===========================================================================

function getBusinessInfoCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let ownerName = "Unknown";
	switch(getBusinessData(businessId).ownerType) {
		case AG_BIZOWNER_CLAN:
			ownerName = getClanData(getBusinessData(businessId).ownerId).name;
			break;

		case AG_BIZOWNER_JOB:
			ownerName = getJobData(getBusinessData(businessId).ownerId).name;
			break;

		case AG_BIZOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(getBusinessData(businessId).ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case AG_BIZOWNER_NONE:
			ownerName = "None";
			break;

		case AG_BIZOWNER_PUBLIC:
			ownerName = "Public";
			break;
	}

	messagePlayerInfo(client, `🏢 [#0099FF][Business Info] [#FFFFFF]Name: [#AAAAAA]${getBusinessData(businessId).name}, [#FFFFFF]Owner: [#AAAAAA]${ownerName} (${getBusinessOwnerTypeText(getBusinessData(businessId).ownerType)}), [#FFFFFF]Locked: [#AAAAAA]${getYesNoFromBool(intToBool(getBusinessData(businessId).locked))}, [#FFFFFF]ID: [#AAAAAA]${businessId}/${getBusinessData(businessId).databaseId}`);
}

// ===========================================================================

function setBusinessPickupCommand(command, params, client) {
	let splitParams = params.split(" ");
	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(isNaN(typeParam)) {
		if(isNull(getGameConfig().pickupModels[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a pickup model ID");
			messagePlayerInfo(client, `Pickup Types: [#AAAAAA]${Object.keys(getGameConfig().pickupModels[getServerGame()]).join(", ")}`)
			return false;
		}

		getBusinessData(businessId).entrancePickupModel = getGameConfig().pickupModels[getServerGame()][typeParam];
	} else {
		getBusinessData(businessId).entrancePickupModel = toInteger(typeParam);
	}

	deleteBusinessEntrancePickup(businessId);
	deleteBusinessExitPickup(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]pickup display to [#AAAAAA]${toLowerCase(typeParam)}'!`);
}

// ===========================================================================

function setBusinessInteriorTypeCommand(command, params, client) {
	let splitParams = params.split(" ");
	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "none") {
			getBusinessData(businessId).exitPosition = toVector3(0.0, 0.0, 0.0);
			getBusinessData(businessId).exitInterior = 0;
			getBusinessData(businessId).hasInterior = false;
			messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]remove business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]interior`);
			return false;
		}

		if(isNull(getGameConfig().interiorTemplates[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name or an existing business database ID");
			messagePlayerInfo(client, `Interior Types: [#AAAAAA]${Object.keys(getGameConfig().interiorTemplates[getServerGame()]).join(", ")}`)
			return false;
		}

		messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]interior type to [#AAAAAA]${toLowerCase(typeParam)}`);
		getBusinessData(businessId).exitPosition = getGameConfig().interiorTemplates[getServerGame()][typeParam].exitPosition;
		getBusinessData(businessId).exitInterior = getGameConfig().interiorTemplates[getServerGame()][typeParam].exitInterior;
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId+getGlobalConfig().businessDimensionStart;
		getBusinessData(businessId).hasInterior = true;
	} else {
		if(!getBusinessData(businessId)) {
			messagePlayerError(client, "Business ID not found!");
			return false;
		}
		getBusinessData(businessId).exitPosition = getBusinessData(businessId).exitPosition;
		getBusinessData(businessId).exitInterior = getBusinessData(businessId).exitInterior;
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId+getGlobalConfig().businessDimensionStart;
		getBusinessData(businessId).hasInterior = true;
	}

	deleteBusinessEntrancePickup(businessId);
	deleteBusinessExitPickup(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function setBusinessBlipCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(isNaN(typeParam)) {
		if(isNull(getGameConfig().blipSprites[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a blip image ID");
			messagePlayerInfo(client, `Blip Types: [#AAAAAA]${Object.keys(getGameConfig().blipSprites[getServerGame()]).join(", ")}`)
			return false;
		}

		getBusinessData(businessId).entranceBlipModel = getGameConfig().blipSprites[getServerGame()][typeParam];
	} else {
		getBusinessData(businessId).entranceBlipModel = toInteger(typeParam);
	}

	deleteBusinessLocationEntranceBlip(businessId, closestEntrance.index);
	deleteBusinessLocationExitBlip(businessId, closestEntrance.index);
	createBusinessLocationEntranceBlip(businessId, closestEntrance.index);
	createBusinessLocationExitBlip(businessId, closestEntrance.index);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]set business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]blip display to [#AAAAAA]${toLowerCase(typeParam)}`);
}

// ===========================================================================

function giveDefaultItemsToBusinessCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(!isNaN(typeParam)) {
	}

	if(isNull(getGameConfig().defaultBusinessItems[getServerGame()][typeParam])) {
		messagePlayerError(client, "Invalid business items type! Use a business items type name");
		messagePlayerInfo(client, `Blip Types: [#AAAAAA]${Object.keys(getGameConfig().defaultBusinessItems[getServerGame()]).join(", ")}`)
		return false;
	}

	for(let i in getGameConfig().defaultBusinessItems[getServerGame()][typeParam]) {
		let itemTypeId = getItemTypeFromParams(getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][0]);
		let itemTypeData = getItemTypeData(itemTypeId);
		if(itemTypeData) {
			let newItemIndex = createItem(itemTypeId, itemTypeData.orderValue, AG_ITEM_OWNER_BIZFLOOR, getBusinessData(businessId).databaseId, getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][1]);
			getItemData(newItemIndex).buyPrice = applyServerInflationMultiplier(itemTypeData.orderPrice)*getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][2];
		}
	}

	cacheBusinessItems(businessId);
	updateBusinessPickupLabelData(businessId);
	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]gave business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]the default items for ${toLowerCase(typeParam)}`);
}

// ===========================================================================

function deleteBusinessFloorItemsCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	for(let i in getBusinessData(businessId).floorItemCache) {
		deleteItem(getBusinessData(businessId).floorItemCache);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]deleted all on-sale items for business [#0099FF]${getBusinessData(businessId).name}`);
}

// ===========================================================================

function deleteBusinessStorageItemsCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = splitParams[0] || "business";
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	for(let i in getBusinessData(businessId).storageItemCache) {
		deleteItem(getBusinessData(businessId).storageItemCache);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]deleted all stored items for business [#0099FF]${getBusinessData(businessId).name}`);
}

// ===========================================================================

function withdrawFromBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(splitParams[0]) || 0;
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(getBusinessData(businessId).till < amount) {
		messagePlayerError(client, `Business [#0099FF]${tempBusinessData.name} doesn't have that much money! Use /bizbalance.`);
		return false;
	}

	getBusinessData(businessId).till -= amount;
	givePlayerCash(client, amount);
	updatePlayerCash(client);
	messagePlayerSuccess(client, `You withdrew $${amount} from business [#0099FF]${getBusinessData(businessId).name} till`);
}

// ===========================================================================

function setBusinessBuyPriceCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(splitParams[0]) || 0;
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getBusinessData(businessId).buyPrice = amount;
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.price", getBusinessData(businessId).buyPrice, true);
	messagePlayerSuccess(client, `[#FFFFFF]You set business [#0099FF]${getBusinessData(businessId).name}'s [#FFFFFF]for-sale price to [#AAAAAA]$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function depositIntoBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(splitParams[0]) || 0;
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, `You don't have that much money! You only have $${getPlayerCurrentSubAccount(client).cash}`);
		return false;
	}

	getBusinessData(businessId).till += amount;
	takePlayerCash(client, amount);
	updatePlayerCash(client);
	messagePlayerSuccess(client, `You deposited $${amount} into business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]till`);
}

// ===========================================================================

function orderItemForBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 3, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let itemType = getItemTypeFromParams(splitParams.slice(0,-2).join(" "));

	if(!getItemTypeData(itemType)) {
		messagePlayerError(client, "Invalid item type name or ID!");
		messagePlayerInfo(client, "Use [#AAAAAA]/itemtypes [#FFFFFF]for a list of items");
		return false;
	}
	let pricePerItem = getOrderPriceForItemType(itemType);

	let amount = toInteger(splitParams.slice(-2, -1)) || 1;
	let value = toInteger(splitParams.slice(-1)) || getItemTypeData(itemType).capacity;
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	logToConsole(LOG_DEBUG, `[Asshat.Business] ${getPlayerDisplayForConsole(client)} is ordering ${amount} ${splitParams.slice(0,-2).join(" ")} (${value})`);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "You must be inside or near a business door!");
		return false;
	}

	let orderTotalCost = pricePerItem*amount;

	//getPlayerData(client).promptType = AG_PROMPT_BIZORDER;
	getPlayerData(client).businessOrderAmount = amount;
	getPlayerData(client).businessOrderBusiness = businessId;
	getPlayerData(client).businessOrderItem = itemType;
	getPlayerData(client).businessOrderValue = value;
	getPlayerData(client).businessOrderCost = orderTotalCost;

	showPlayerPrompt(client, AG_PROMPT_BIZORDER, `Ordering ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${makeLargeNumberReadable(pricePerItem)} each will cost a total of $${makeLargeNumberReadable(orderTotalCost)}`, "Business Order Cost");
}

// ===========================================================================

function orderItemForBusiness(businessId, itemType, amount) {
	if(getBusinessData(businessId).till < orderTotalCost) {
		let neededAmount = orderTotalCost-getBusinessData(businessId).till;
		//messagePlayerError(client, `The business doesn't have enough money (needs [#AAAAAA]$${neededAmount} [#FFFFFF]more)! Use [#AAAAAA]/bizdeposit [#FFFFFF]to add money to the business.`);
		return false;
	}

	getBusinessData(businessId).till -= orderTotalCost;
	addToBusinessInventory(businessId, itemType, amount);
	//messagePlayerSuccess(client, `You ordered ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${getItemTypeData(itemType).orderPrice} each for business [#0099FF]${getBusinessData(businessId).name}`);
}

// ===========================================================================

function viewBusinessTillAmountCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	messagePlayerSuccess(client, `Business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]till has [#AAAAAA]$${getBusinessData(businessId).till}`);
}

// ===========================================================================

function buyBusinessCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(getBusinessData(businessId).buyPrice <= 0) {
		messagePlayerError(client, `Business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]is not for sale!`);
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getBusinessData(businessId).buyPrice) {
		messagePlayerError(client, `You don't have enough money to buy business [#0099FF]${getBusinessData(businessId).name}!`);
		return false;
	}

	getBusinessData(client).ownerType = AG_BIZOWNER_PLAYER;
	getBusinessData(client).ownerId = getPlayerCurrentSubAccount(client).databaseId;
	getBusinessData(client).buyPrice = 0;

	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, `Business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]till has [#AAAAAA]$${getBusinessData(businessId).till}`);
}

// ===========================================================================

function moveBusinessEntranceCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).entrancePosition = getPlayerPosition(client);
	getBusinessData(businessId).entranceDimension = getPlayerDimension(client);
	getBusinessData(businessId).entranceInterior = getPlayerInterior(client);

	deleteBusinessEntranceBlip(businessId);
	deleteBusinessEntrancePickup(businessId);

	createBusinessEntranceBlip(businessId);
	createBusinessEntrancePickup(businessId);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]moved business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]entrance to their position`);
}

// ===========================================================================

function moveBusinessExitCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client)).business;

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	getBusinessData(businessId).exitPosition = getPlayerPosition(client);
	getBusinessData(businessId).exitDimension = getPlayerDimension(client);
	getBusinessData(businessId).exitInterior = getPlayerInterior(client);

	deleteBusinessExitBlip(businessId);
	deleteBusinessExitPickup(businessId);

	createBusinessExitBlip(businessId);
	createBusinessExitPickup(businessId);

	messageAdmins(`[#AAAAAA]${client.name} [#FFFFFF]moved business [#0099FF]${getBusinessData(businessId).name} [#FFFFFF]exit to their position`);
}

// ===========================================================================

function getBusinessDataFromDatabaseId(databaseId) {
	let matchingBusinesses = getServerData().businesses.filter(b => b.databaseId == businessId)
	if(matchingBusinesses.length == 1) {
		return matchingBusinesses[0];
	}
	return false;
}

// ===========================================================================

function getClosestBusinessEntrance(position) {
	let closest = getServerData().businesses[0].locations[0];
	for(let i in businesses) {
		for(let j in getServerData().businesses[i].locations) {
			if(getDistance(position, businesses[i].locations[j].entrancePosition) <= getDistance(position, closest.entrancePosition)) {
				closest = getServerData().businesses[i].locations[j];
			}
		}
	}
	return closest;
}

// ===========================================================================

function isPlayerInAnyBusiness(client) {
	if(doesEntityDataExist(client, "ag.inBusiness")) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerBusiness(client) {
	if(doesEntityDataExist(client, "ag.inBusiness")) {
		return getEntityData(client, "ag.inBusiness");
	}

	return -1;
}

// ===========================================================================

function saveAllBusinessesToDatabase() {
	for(let i in getServerData().businesses) {
		saveBusinessToDatabase(i);
	}
}

// ===========================================================================

function saveBusinessToDatabase(businessId) {
	let tempBusinessData = getServerData().businesses[businessId]
	logToConsole(LOG_DEBUG, `[Asshat.Business]: Saving business '${tempBusinessData.name}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeBusinessName = escapeDatabaseString(dbConnection, tempBusinessData.name);
		if(tempBusinessData.databaseId == 0) {
			let dbQueryString = `INSERT INTO biz_main (
					biz_server,
					biz_name,
					biz_owner_type,
					biz_owner_id,
					biz_locked,
					biz_entrance_fee,
					biz_till,
					biz_entrance_pos_x,
					biz_entrance_pos_y,
					biz_entrance_pos_z,
					biz_entrance_rot_z,
					biz_entrance_int,
					biz_entrance_vw,
					biz_entrance_pickup,
					biz_entrance_blip,
					biz_exit_pos_x,
					biz_exit_pos_y,
					biz_exit_pos_z,
					biz_exit_rot_z,
					biz_exit_int,
					biz_exit_vw,
					biz_exit_pickup,
					biz_exit_blip,
					biz_has_interior
				) VALUES (
					${getServerId()},
					'${safeBusinessName}',
					${tempBusinessData.ownerType},
					${tempBusinessData.ownerId},
					${boolToInt(tempBusinessData.locked)},
					${tempBusinessData.entranceFee},
					${tempBusinessData.till},
					${tempBusinessData.entrancePosition.x},
					${tempBusinessData.entrancePosition.y},
					${tempBusinessData.entrancePosition.z},
					${tempBusinessData.entranceRotation},
					${tempBusinessData.entranceInterior},
					${tempBusinessData.entranceDimension},
					${tempBusinessData.entrancePickupModel},
					${tempBusinessData.entranceBlipModel},
					${tempBusinessData.exitPosition.x},
					${tempBusinessData.exitPosition.y},
					${tempBusinessData.exitPosition.z},
					${tempBusinessData.exitRotation},
					${tempBusinessData.exitInterior},
					${tempBusinessData.databaseId+getGlobalConfig().businessDimensionStart},
					${tempBusinessData.exitPickupModel},
					${tempBusinessData.exitBlipModel},
					${boolToInt(tempBusinessData.hasInterior)}
				)`;
			queryDatabase(dbConnection, dbQueryString);
			getServerData().businesses[businessId].databaseId = getDatabaseInsertId(dbConnection);
		} else {

			let dbQueryString =
				`UPDATE biz_main SET
					 biz_name='${safeBusinessName}',
					biz_owner_type=${tempBusinessData.ownerType},
					biz_owner_id=${tempBusinessData.ownerId},
					biz_locked=${boolToInt(tempBusinessData.locked)},
					biz_entrance_fee=${tempBusinessData.entranceFee},
					biz_till=${tempBusinessData.till},
					biz_entrance_pos_x=${tempBusinessData.entrancePosition.x},
					biz_entrance_pos_y=${tempBusinessData.entrancePosition.y},
					biz_entrance_pos_z=${tempBusinessData.entrancePosition.z},
					biz_entrance_rot_z=${tempBusinessData.entranceRotation},
					biz_entrance_int=${tempBusinessData.entranceInterior},
					biz_entrance_vw=${tempBusinessData.entranceDimension},
					biz_entrance_pickup=${tempBusinessData.entrancePickupModel},
					biz_entrance_blip=${tempBusinessData.entranceBlipModel},
					biz_exit_pos_x=${tempBusinessData.exitPosition.x},
					biz_exit_pos_y=${tempBusinessData.exitPosition.y},
					biz_exit_pos_z=${tempBusinessData.exitPosition.z},
					biz_exit_rot_z=${tempBusinessData.exitRotation},
					biz_exit_int=${tempBusinessData.exitInterior},
					biz_exit_vw=${tempBusinessData.exitDimension},
					biz_exit_pickup=${tempBusinessData.exitPickupModel},
					biz_exit_blip=${tempBusinessData.exitBlipModel},
					biz_has_interior=${boolToInt(tempBusinessData.hasInterior)},
					biz_buy_price=${tempBusinessData.buyPrice}
				 WHERE biz_id=${tempBusinessData.databaseId}`;

			dbQueryString = dbQueryString.replace(/(?:\r\n|\r|\n|\t)/g, "");

			let dbQuery = queryDatabase(dbConnection, dbQueryString);
			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);
		}
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[Asshat.Business]: Saved business '${tempBusinessData.name}' to database!`);

	return false;
}

// ===========================================================================

function createAllBusinessPickups() {
	for(let i in getServerData().businesses) {
		for(let j in getServerData().businesses[i].locations) {
			createBusinessLocationEntrancePickup(i, j);
			createBusinessLocationExitPickup(i, j);
		}
	}
}

// ===========================================================================

function createAllBusinessBlips() {
	for(let i in getServerData().businesses) {
		for(let j in getServerData().businesses[i].locations) {
			createBusinessLocationEntranceBlip(i, j);
			createBusinessLocationExitBlip(i, j);
		}
	}
}

// ===========================================================================

function createBusinessLocationEntrancePickup(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].entrancePickupModel != -1) {
		let pickupModelId = getGameConfig().pickupModels[getServerGame()].business;

		if(getServerData().businesses[businessId].locations[locationId].entrancePickupModel != 0) {
			pickupModelId = getBusinessData(businessId).locations[locationId].entrancePickupModel;
		}


	}
}

// ===========================================================================

function createBusinessLocationEntranceBlip(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].entranceBlipModel != -1) {
		let blipModelId = getGameConfig().blipSprites[getServerGame()].business;

		if(getServerData().businesses[businessId].entranceBlipModel != 0) {
			blipModelId = getBusinessData(businessId).locations[locationId].entranceBlipModel;
		}

		getBusinessData(businessId).locations[locationId].entranceBlip = gta.createBlip(getBusinessData(businessId).locations[locationId].entrancePosition, blipModelId, 1, getColourByName("businessBlue"));
		getBusinessData(businessId).locations[locationId].entranceBlip.onAllDimensions = false;
		getBusinessData(businessId).locations[locationId].entranceBlip.dimension = getBusinessData(businessId).locations[locationId].entranceDimension;
		getBusinessData(businessId).locations[locationId].entranceBlip.setData("ag.owner.type", AG_BLIP_BUSINESS_ENTRANCE, false);
		getBusinessData(businessId).locations[locationId].entranceBlip.setData("ag.owner.id", businessId, false);
		addToWorld(getBusinessData(businessId).locations[locationId].entranceBlip);
	}
}

// ===========================================================================

function createBusinessLocationExitPickup(businessId, locationId) {
	if(getBusinessData(businessId).hasInterior) {
		if(getBusinessData(businessId).locations[locationId].exitPickupModel != -1) {
			let pickupModelId = getGameConfig().pickupModels[getServerGame()].exit;

			if(getServerData().businesses[businessId].locations[locationId].exitPickupModel != 0) {
				pickupModelId = getBusinessData(businessId).locations[locationId].exitPickupModel;
			}

			getBusinessData(businessId).locations[locationId].exitPickup = gta.createPickup(pickupModelId, getBusinessData(businessId).locations[locationId].exitPosition);
			getBusinessData(businessId).locations[locationId].exitPickup.onAllDimensions = false;
			getBusinessData(businessId).locations[locationId].exitPickup.dimension = getBusinessData(businessId).locations[locationId].exitDimension;
			getBusinessData(businessId).locations[locationId].exitPickup.setData("ag.owner.type", AG_PICKUP_BUSINESS_EXIT, false);
			getBusinessData(businessId).locations[locationId].exitPickup.setData("ag.owner.id", businessId, false);
			getBusinessData(businessId).locations[locationId].exitPickup.setData("ag.label.type", AG_LABEL_EXIT, true);
			addToWorld(getBusinessData(businessId).locations[locationId].exitPickup);
		}
	}
}

// ===========================================================================

function createBusinessLocationExitBlip(businessId, locationId) {
	if(getBusinessData(businessId).hasInterior) {
		if(getBusinessData(businessId).locations[locationId].exitBlipModel != -1) {
			let blipModelId = getGameConfig().blipSprites[getServerGame()].business;

			if(getServerData().businesses[businessId].locations[locationId].exitBlipModel != 0) {
				blipModelId = getBusinessData(businessId).locations[locationId].exitBlipModel;
			}

			getBusinessData(businessId).locations[locationId].exitBlip = gta.createBlip(getBusinessData(businessId).locations[locationId].exitPosition, blipModelId, 1, getColourByName("businessBlue"));
			getBusinessData(businessId).locations[locationId].exitBlip.onAllDimensions = false;
			getBusinessData(businessId).locations[locationId].exitBlip.dimension = getBusinessData(businessId).locations[locationId].entranceDimension;
			//getBusinessData(businessId).exitBlip.interior = getBusinessData(businessId).exitInterior;
			getBusinessData(businessId).locations[locationId].exitBlip.setData("ag.owner.type", AG_BLIP_BUSINESS_EXIT, false);
			getBusinessData(businessId).locations[locationId].exitBlip.setData("ag.owner.id", businessId, false);
			addToWorld(getBusinessData(businessId).locations[locationId].exitBlip);
		}
	}
}

// ===========================================================================

function deleteBusiness(businessId, deletedBy = 0) {
	let tempBusinessData = getServerData().businesses[businessId];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `DELETE FROM biz_main WHERE biz_id = ${tempBusinessData.databaseId}`);
		if(dbQuery) {
			freeDatabaseQuery(dbQuery);
		}

		dbQuery = queryDatabase(dbConnection, `DELETE FROM biz_loc WHERE biz_loc_biz = ${tempBusinessData.databaseId}`);
		if(dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	deleteBusinessEntrancePickups(businessId);
	deleteBusinessExitPickups(businessId);

	deleteBusinessEntranceBlips(businessId);
	deleteBusinessExitBlips(businessId);

	removePlayersFromBusiness(businessId);

	getServerData().businesses.splice(businessId, 1);
}

// ===========================================================================

function removePlayersFromBusiness(businessId) {
	getClients().forEach(function(client) {
		if(doesBusinessHaveInterior(businessId)) {
			if(isPlayerInAnyBusiness(client)) {
				if(getPlayerBusiness(client) == businessId) {
					exitBusiness(client);
				}
			}
		}
	});
}

// ===========================================================================

function removePlayerFromBusinesses(client) {
	if(isPlayerInAnyBusiness(client)) {
		exitBusiness(client);
	}
}

// ===========================================================================

function exitBusiness(client) {
	let businessId = getEntityData(client, "ag.inBusiness");
	if(isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().businesses[businessId].entranceInterior);
		setPlayerDimension(client, client, getServerData().businesses[businessId].entranceDimension);
		setPlayerPosition(client, client, getServerData().businesses[businessId].entrancePosition);
	}
	removeEntityData(client, "ag.inBusiness");
}

// ===========================================================================

function getBusinessOwnerTypeText(ownerType) {
	switch(ownerType) {
		case AG_BIZOWNER_CLAN:
			return "clan";

		case AG_BIZOWNER_JOB:
			return "job";

		case AG_BIZOWNER_PLAYER:
			return "player";

		case AG_BIZOWNER_NONE:
		case AG_BIZOWNER_PUBLIC:
			return "not owned";

		default:
			return "unknown";
	}
}

// ===========================================================================

function getBusinessData(businessId) {
	if(typeof getServerData().businesses[businessId] != null) {
		return getServerData().businesses[businessId];
	}
	return false;
}

// ===========================================================================

function doesBusinessHaveInterior(businessId) {
	return getBusinessData(businessId).hasInterior;
}

function deleteBusinessEntrancePickups(businessId) {
	for(let i in getServerData().businesses[businessId].locations) {
		deleteBusinessLocationEntrancePickup(businessId, i);
	}
}

// ===========================================================================

function deleteBusinessEntranceBlips(businessId) {
	for(let i in getServerData().businesses[businessId].locations) {
		deleteBusinessLocationEntranceBlip(businessId, i);
	}
}

// ===========================================================================

function deleteBusinessExitPickups(businessId) {
	for(let i in getServerData().businesses[businessId].locations) {
		deleteBusinessLocationExitPickup(businessId, i);
	}
}

// ===========================================================================

function deleteBusinessExitBlips(businessId) {
	for(let i in getServerData().businesses[businessId].locations) {
		deleteBusinessLocationExitBlip(businessId, i);
	}
}

// ===========================================================================

function deleteBusinessLocationEntrancePickup(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].entrancePickup) {
		destroyElement(getBusinessData(businessId).locations[locationId].entrancePickup);
		getBusinessData(businessId).locations[locationId].entrancePickup = false;
	}
}

// ===========================================================================

function deleteBusinessLocationExitPickup(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].exitPickup) {
		destroyElement(getBusinessData(businessId).locations[locationId].exitPickup);
		getBusinessData(businessId).locations[locationId].exitPickup = false;
	}
}

// ===========================================================================

function deleteBusinessLocationEntranceBlip(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].entranceBlip) {
		destroyElement(getBusinessData(businessId).locations[locationId].entranceBlip);
		getBusinessData(businessId).locations[locationId].entranceBlip = false;
	}
}

// ===========================================================================

function deleteBusinessLocationExitBlip(businessId, locationId) {
	if(getBusinessData(businessId).locations[locationId].exitBlip) {
		destroyElement(getBusinessData(businessId).locations[locationId].exitBlip);
		getBusinessData(businessId).locations[locationId].exitBlip = false;
	}
}

// ===========================================================================

function reloadAllBusinessesCommand(command, params, client) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerInAnyBusiness(clients[i])) {
			removePlayerFromBusinesses(clients[i]);
		}
	}

	for(let i in getServerData().businesses) {
		deleteBusinessExitBlip(i);
		deleteBusinessEntranceBlip(i);
		deleteBusinessExitPickup(i);
		deleteBusinessEntrancePickup(i);
	}

	//forceAllPlayersToStopWorking();
	getServerData().businesses = null;
	getServerData().businesses = loadBusinessesFromDatabase();
	createAllBusinessPickups();
	createAllBusinessBlips();

	messageAdminAction(`All businesses have been reloaded by an admin!`);
}

// ===========================================================================

function setAllBusinessIndexes() {
	for(let i in getServerData().businesses) {
		getServerData().businesses[i].index = i;
	}
}

// ===========================================================================

function addToBusinessInventory(businessId, itemType, amount, buyPrice) {
	let tempItemData = new serverClasses.itemData(false);
	tempItemData.amount = amount;
	tempItemData.buyPrice = buyPrice;
	tempItemData.itemType = getItemTypeData(itemType).databaseId;
	tempItemData.ownerId = getBusinessData(business).databaseId;
	tempItemData.ownerType = AG_ITEMOWNER_BIZ;
	tempItemData.ownerIndex = businessId;
	tempItemData.itemTypeIndex = itemType;
	saveItemToDatabase(tempItemData);
	getServerData().items.push(tempItemData);

	let index = getServerData().items.length-1;
	getServerData().items[index].index = index;
}

// ===========================================================================

function buyFromBusinessCommand(command, params, client) {
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(areParamsEmpty(params)) {
		showBusinessFloorInventoryToPlayer(client, businessId);
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	if(getBusinessData(businessId).locked) {
		messagePlayerError(client, `This business is closed!`);
		return false;
	}

	if(getBusinessData(businessId).hasInterior) {
		if(!getPlayerBusiness(client)) {
			if(doesPlayerHaveKeyBindForCommand(client, "enter")) {
				messagePlayerTip(client, `You need to enter the business first! Press [#AAAAAA]${sdl.getKeyName(getPlayerKeyBindForCommand(client, "enter").key)} [#FFFFFF]to enter and exit a business`);
			} else {
				messagePlayerNormal(client, `You need to enter the business first! Use /enter to enter and exit a business`);
			}
			return false;
		}
	}

	let itemSlot = toInteger(splitParams[0]) || 1;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let amount = 1;
	if(areThereEnoughParams(params, 2, " ")) {
		amount = toInteger(splitParams[1]) || 1;
		if(amount <= 0) {
			messagePlayerError(client, "The amount must be more than 0!");
			return false;
		}
	}

	if(getPlayerCurrentSubAccount(client).cash < getBusinessData(businessId).floorItemCache[itemSlot-1].buyPrice*amount) {
		messagePlayerError(client, `You don't have enough money! You need [#AAAAAA]${getBusinessData(businessId).floorItemCache[itemSlot-1].buyPrice*amount-getPlayerCurrentSubAccount(client).cash} [#FFFFFF]more!`);
		return false;
	}

	if(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount < amount) {
		messagePlayerError(client, `There are only ${getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount} ${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name} in slot ${itemSlot-1}`);
		return false;
	}

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if(firstSlot == -1) {
		messagePlayerError(client, `You don't have any space to carry this (full inventory)!`);
		return false;
	}

	let totalCost = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice*amount;
	let individualCost = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice;
	let itemName = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name;
	let priceEach = (amount > 1) ? `($${individualCost} each)` : ``;

	takePlayerCash(client, totalCost);
	createItem(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex, getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).value, AG_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId, amount);
	cachePlayerHotBarItems(client);
	getBusinessData(businessId).till = getBusinessData(businessId).till + totalCost;

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount - amount;
	if(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount == 0) {
		destroyItem(getBusinessData(businessId).floorItemCache[itemSlot-1]);
	}

	messagePlayerSuccess(client, `You bought ${amount} [#AAAAAA]${itemName} [#FFFFFF]for ${totalCost} ${priceEach}`);
}

// ===========================================================================

function setBusinessItemSellPriceCommand(command, params, client) {
	let splitParams = params.split(" ");
	let businessId = getBusinessFromParams(splitParams[2]) || (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let itemSlot = toInteger(splitParams[0]) || 0;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot-1} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot-1} slot is empty!`);
		return false;
	}

	let oldPrice = getBusinessData(businessId).floorItemCache[itemSlot-1].buyPrice;
	let newPrice = toInteger(splitParams[1]) || oldPrice;
	if(newPrice < 0) {
		messagePlayerError(client, "The price can't be negative!");
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice = newPrice;

	messagePlayerSuccess(client, `You changed the price of the [#AAAAAA]${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name}'s [#FFFFFF]in slot [#AAAAAA]${itemSlot} [#FFFFFF]from $${makeLargeNumberReadable(oldPrice)} to $${makeLargeNumberReadable(newprice)}`);
}

// ===========================================================================

function storeItemInBusinessStorageCommand(command, params, client) {
	let splitParams = params.split(" ");
	let businessId = getBusinessFromParams(splitParams[2]) || (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let itemSlot = toInteger(splitParams[0]) || 0;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessStorageFirstFreeItemSlot(businessId);

	if(firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).ownerType = AG_ITEM_OWNER_BIZSTORAGE;
	getBusinessData(businessId).storageItemCache[firstSlot] = getBusinessData(businessId).floorItemCache[itemSlot-1];
	getBusinessData(businessId).storageItemCache[itemSlot-1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} to the business storage in slot ${firstSlot}`);
}

// ===========================================================================

function stockItemOnBusinessFloorCommand(command, params, client) {
	let splitParams = params.split(" ");
	let businessId = (isPlayerInAnyBusiness(client)) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "Business not found!");
		return false;
	}

	let itemSlot = toInteger(splitParams[0]) || 0;

	if(typeof getBusinessData(businessId).storageItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).storageItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessFloorFirstFreeItemSlot(businessId);

	if(firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).storageItemCache[itemSlot-1]).ownerType = AG_ITEM_OWNER_BIZFLOOR;
	getBusinessData(businessId).floorItemCache[firstSlot] = getBusinessData(businessId).storageItemCache[itemSlot-1];
	getBusinessData(businessId).storageItemCache[itemSlot-1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} of the business storage to the business floor slot ${firstSlot}`);
}

// ===========================================================================

function getBusinessStorageFirstFreeItemSlot(businessId) {
	for(let i in getBusinessData(businessId).storageItemCache) {
		if(getBusinessData(businessId).storageItemCache[i] == -1) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getBusinessFloorFirstFreeItemSlot(businessId) {
	for(let i in getBusinessData(businessId).floorItemCache) {
		if(getBusinessData(businessId).floorItemCache[i] == -1) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function cacheAllBusinessItems() {
	logToConsole(LOG_DEBUG, "[Asshat.Business] Caching all business items ...");
	for(let i in getServerData().businesses) {
		cacheBusinessItems(i);
	}
	logToConsole(LOG_DEBUG, "[Asshat.Business] Cached all business items successfully!");
}

// ===========================================================================

function cacheBusinessItems(businessId) {
	getBusinessData(businessId).floorItemCache = [];
	getBusinessData(businessId).storageItemCache = [];

	logToConsole(LOG_VERBOSE, `[Asshat.Business] Caching business items for business ${businessId} (${getBusinessData(businessId).name}) ...`);
	for(let i in getServerData().items) {
		if(getItemData(i).ownerType == AG_ITEM_OWNER_BIZFLOOR && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).floorItemCache.push(i);
		} else if(getItemData(i).ownerType == AG_ITEM_OWNER_BIZSTORAGE && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).storageItemCache.push(i);
		}
	}
	logToConsole(LOG_VERBOSE, `[Asshat.Business] Successfully cached ${getBusinessData(businessId).floorItemCache.length} floor items and ${getBusinessData(businessId).storageItemCache} storage items for business ${businessId} (${getBusinessData(businessId).name})!`);
}

// ===========================================================================

function getHouseIdFromDatabaseId(databaseId) {
	for(let i in getServerData().businesses) {
		if(getBusinessData(i).databaseId == databaseId) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function updateBusinessPickupLabelData(businessId) {
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.owner.type", AG_PICKUP_BUSINESS_ENTRANCE, false);
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.owner.id", businessId, false);
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.type", AG_LABEL_BUSINESS, true);
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.name", getBusinessData(businessId).name, true);
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.locked", getBusinessData(businessId).locked, true);
	setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.help", AG_BIZLABEL_INFO_NONE, true);
	if(getBusinessData(businessId).hasInterior) {
		setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.help", AG_BIZLABEL_INFO_ENTER, true);
	} else {
		if(getBusinessData(businessId).floorItemCache.length > 0) {
			setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.help", AG_BIZLABEL_INFO_BUY, true);
		}
	}

	if(getBusinessData(businessId).buyPrice > 0) {
		setEntityData(getBusinessData(businessId).entrancePickup, "ag.label.price", getBusinessData(businessId).buyPrice, true);
	}

	setEntityData(getBusinessData(businessId).exitPickup, "ag.owner.type", AG_PICKUP_BUSINESS_EXIT, false);
	setEntityData(getBusinessData(businessId).exitPickup, "ag.owner.id", businessId, false);
	setEntityData(getBusinessData(businessId).exitPickup, "ag.label.type", AG_LABEL_EXIT, true);
}

// ===========================================================================