// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: config.js
// DESC: Provides server configuration
// TYPE: Server (JavaScript)
// ===========================================================================

let serverConfig = false;
let databaseConfig = false;
let emailConfig = false;
let gameConfig = false;

// ===========================================================================

let globalConfig = {
	keyBind: [],
	economy: {},
	accountPasswordHash: "SHA512",
	npcFarProximity: 100,
	npcMediumProximity: 40,
	npcCloseProximity: 12,
	meActionDistance: 20,
	doActionDistance: 15,
	shoutDistance: 30,
	talkDistance: 10,
	whisperDistance: 2,
	megaphoneDistance: 40,
	vehicleLockDistance: 5.5,
	startWorkingDistance: 5,
	takeJobDistance: 5,
	stopWorkingDistance: 10,
	spawnCarDistance: 5,
	payAndSprayDistance: 5,
	exitPropertyDistance: 3.0,
	enterPropertyDistance: 3.0,
	businessDimensionStart: 5000,
	houseDimensionStart: 100,
	buyVehicleDriveAwayDistance: 25.0,
	returnToJobVehicleTime: 30,
	walkieTalkieSpeakerDistance: 15,
	walkieTalkieTalkDistance: 15,
	phoneSpeakerDistance: 15,
	phoneTalkDistance: 15,
	tazerEffectDuration: 15000,
	vehicleRepairDistance: 5,
	itemActionStateReset: 5000,
	subAccountNameAllowedCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	emailValidationRegex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
	itemActionDelayExtraTimeout: 1000,
	geoIPCountryDatabaseFilePath: "geoip-country.mmdb",
	geoIPCityDatabaseFilePath: "geoip-city.mmdb",
	randomTipInterval: 600000,
	weaponEquippableTypes: [
		VRR_ITEM_USETYPE_WEAPON,
		VRR_ITEM_USETYPE_TAZER,
		VRR_ITEM_USETYPE_EXTINGUISHER,
		VRR_ITEM_USETYPE_SPRAYPAINT,
		VRR_ITEM_USETYPE_PEPPERSPRAY,
	],
	onFootOnlyItems: [
		VRR_ITEM_USETYPE_VEHREPAIR,
		VRR_ITEM_USETYPE_VEHCOLOUR,
		VRR_ITEM_USETYPE_VEHUPGRADE_PART,
		VRR_ITEM_USETYPE_VEHLIVERY,
		VRR_ITEM_USETYPE_VEHTIRE,
	],
	vehicleInactiveRespawnDelay: 1800000, // 20 minutes
	chatSectionHeaderLength: 96,
	useServerSideVehiclePurchaseCheck: true,
	businessPickupStreamInDistance: 100,
	businessPickupStreamOutDistance: 120,
	housePickupStreamInDistance: 100,
	housePickupStreamOutDistance: 120,
	jobPickupStreamInDistance: 100,
	jobPickupStreamOutDistance: 120,
	businessBlipStreamInDistance: 200,
	businessBlipStreamOutDistance: 220,
	houseBlipStreamInDistance: 200,
	houseBlipStreamOutDistance: 220,
	jobBlipStreamInDistance: 200,
	jobBlipStreamOutDistance: 220,
};

// ===========================================================================

function initConfigScript() {
	logToConsole(LOG_INFO, "[VRR.Config]: Initializing config script ...");
	logToConsole(LOG_DEBUG, "[VRR.Config]: Loading global config ...");
	loadGlobalConfig();

	logToConsole(LOG_INFO, "[VRR.Config]: Loading server config ...");
	serverConfig = loadServerConfigFromGameAndPort(server.game, server.port, getMultiplayerMod());

	logToConsole(LOG_INFO, "[VRR.Config]: Applying server config ...");
	getServerConfig().devServer = intToBool(toInteger(server.getCVar("vrr_devserver")));
	getServerConfig().fallingSnow = intToBool(toInteger(server.getCVar("vrr_fallingsnow")));
	getServerConfig().groundSnow = intToBool(toInteger(server.getCVar("vrr_groundsnow")));
	getServerConfig().useGUI = intToBool(toInteger(server.getCVar("vrr_gui")));
	getServerConfig().showLogo = false;
	getServerConfig().testerOnly = intToBool(toInteger(server.getCVar("vrr_testeronly")));
	getServerConfig().discordEnabled = false;
	getServerConfig().createJobPickups = intToBool(toInteger(server.getCVar("vrr_jobpickups")));
	getServerConfig().createBusinessPickups = intToBool(toInteger(server.getCVar("vrr_businesspickups")));
	getServerConfig().createHousePickups = intToBool(toInteger(server.getCVar("vrr_housepickups")));
	getServerConfig().createJobBlips = intToBool(toInteger(server.getCVar("vrr_jobblips")));
	getServerConfig().createBusinessBlips = intToBool(toInteger(server.getCVar("vrr_businessblips")));
	getServerConfig().createHouseBlips = intToBool(toInteger(server.getCVar("vrr_houseblips")));
	getServerConfig().useRealTime = intToBool(toInteger(server.getCVar("vrr_realtime")));
	getServerConfig().antiCheat.enabled = intToBool(toInteger(server.getCVar("vrr_anticheat")));

	applyConfigToServer(serverConfig);
	logToConsole(LOG_DEBUG, "[VRR.Config]: Server config applied successfully!");

	logToConsole(LOG_INFO, "[VRR.Config]: Config script initialized!");
}


// ===========================================================================

function loadGlobalConfig() {
	getGlobalConfig().economy = loadEconomyConfig();
	getGlobalConfig().locale = loadLocaleConfig();
	getGlobalConfig().accents = loadAccentConfig();
	getGlobalConfig().discord = loadDiscordConfig();
}

// ===========================================================================

function loadServerConfigFromGameAndPort(gameId, port, mpMod) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_game = ${gameId} AND svr_port = ${port} AND svr_mpmod = ${mpMod} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
				let tempServerConfigData = new ServerConfigData(dbAssoc);
				freeDatabaseQuery(dbQuery);
				return tempServerConfigData;
			}
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function loadServerConfigFromId(tempServerId) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_id = ${tempServerId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
				let tempServerConfigData = new ServerConfigData(dbAssoc);
				freeDatabaseQuery(dbQuery);
				return tempServerConfigData;
			}
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function applyConfigToServer(tempServerConfig) {
	if(isTimeSupported()) {
		logToConsole(LOG_DEBUG, `[VRR.Config]: Setting time to to ${tempServerConfig.hour}:${tempServerConfig.minute} with minute duration of ${tempServerConfig.minuteDuration}`);
		setGameTime(tempServerConfig.hour, tempServerConfig.minute, tempServerConfig.minuteDuration);
	}

	if(isWeatherSupported()) {
		logToConsole(LOG_DEBUG, `[VRR.Config]: Setting weather to ${tempServerConfig.weather}`);
		game.forceWeather(tempServerConfig.weather);
	}

	updateServerRules();
}

// ===========================================================================

function saveServerConfigToDatabase() {
	logToConsole(LOG_DEBUG, `[VRR.Config]: Saving server ${getServerConfig().databaseId} configuration to database ...`);
	if(getServerConfig().needsSaved) {
		let dbConnection = connectToDatabase();
		if(dbConnection) {
			let data = [
				//["svr_settings", toInteger(getServerConfig().settings)],
				["svr_start_time_hour", getServerConfig().hour],
				["svr_start_time_min", getServerConfig().minute],
				["svr_start_weather", getServerConfig().weather],
				["svr_newchar_pos_x", getServerConfig().newCharacter.spawnPosition.x],
				["svr_newchar_pos_y", getServerConfig().newCharacter.spawnPosition.y],
				["svr_newchar_pos_z", getServerConfig().newCharacter.spawnPosition.z],
				["svr_newchar_rot_z", getServerConfig().newCharacter.spawnHeading],
				["svr_newchar_skin", getServerConfig().newCharacter.skin],
				["svr_newchar_money", getServerConfig().newCharacter.money],
				["svr_gui_col1_r", getServerConfig().guiColourPrimary[0]],
				["svr_gui_col1_g", getServerConfig().guiColourPrimary[1]],
				["svr_gui_col1_b", getServerConfig().guiColourPrimary[2]],
				["svr_gui_col2_r", getServerConfig().guiColourSecondary[0]],
				["svr_gui_col2_g", getServerConfig().guiColourSecondary[1]],
				["svr_gui_col2_b", getServerConfig().guiColourSecondary[2]],
				["svr_connectcam_pos_x", getServerConfig().connectCameraPosition.x],
				["svr_connectcam_pos_y", getServerConfig().connectCameraPosition.y],
				["svr_connectcam_pos_z", getServerConfig().connectCameraPosition.z],
				["svr_connectcam_lookat_x", getServerConfig().connectCameraLookAt.x],
				["svr_connectcam_lookat_y", getServerConfig().connectCameraLookAt.y],
				["svr_connectcam_lookat_z", getServerConfig().connectCameraLookAt.z],
				["svr_charselect_cam_pos_x", getServerConfig().characterSelectCameraPosition.x],
				["svr_charselect_cam_pos_y", getServerConfig().characterSelectCameraPosition.y],
				["svr_charselect_cam_pos_z", getServerConfig().characterSelectCameraPosition.z],
				["svr_charselect_cam_lookat_x", getServerConfig().characterSelectCameraLookAt.x],
				["svr_charselect_cam_lookat_y", getServerConfig().characterSelectCameraLookAt.y],
				["svr_charselect_cam_lookat_z", getServerConfig().characterSelectCameraLookAt.z],
				["svr_charselect_ped_pos_x", getServerConfig().characterSelectPedPosition.x],
				["svr_charselect_ped_pos_y", getServerConfig().characterSelectPedPosition.y],
				["svr_charselect_ped_pos_z", getServerConfig().characterSelectPedPosition.z],
				["svr_charselect_ped_rot_z", getServerConfig().characterSelectPedHeading],
				["svr_charselect_int", getServerConfig().characterSelectInterior],
				["svr_charselect_vw", getServerConfig().characterSelectDimension],
				["svr_inflation_multiplier", getServerConfig().inflationMultiplier],
				["svr_intro_music", getServerConfig().introMusicURL],
			];

			let dbQuery = null;
			let queryString = createDatabaseUpdateQuery("svr_main", data, `svr_id=${getServerConfig().databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);

			getServerConfig().needsSaved = false;
			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);

		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Config]: Server ${getServerConfig().databaseId} configuration saved to database!`);
}

// ===========================================================================

/**
 *
 * @return {ServerConfigData} - Server configuration data
 *
 */
function getServerConfig() {
	//if(serverId != getServerId()) {
	//	return loadServerConfigFromId(serverId);
	//}
	return serverConfig;
}

// ===========================================================================

function getGlobalConfig() {
	return globalConfig;
}

// ===========================================================================

/**
 *
 * @return {number} - This server's ID
 *
 */
function getServerId() {
	return getServerConfig().databaseId;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setTimeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let hour = toInteger(getParam(params, " ", 1));
	let minute = toInteger(getParam(params, " ", 2)) || 0;

	if(hour > 23 || hour < 0) {
		messagePlayerError(client, "The hour must be between 0 and 23!");
		return false;
	}

	if(minute > 59 || minute < 0) {
		messagePlayerError(client, "The minute must be between 0 and 59!");
		return false;
	}

	getServerConfig().hour = hour;
	getServerConfig().minute = minute;

	game.time.hour = getServerConfig().hour;
	game.time.minute = getServerConfig().minute;

	//checkServerGameTime();

	getServerConfig().needsSaved = true;

	announceAdminAction("ServerTimeSet", getPlayerName(client), makeReadableTime(hour, minute));
	return true;
}


// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setMinuteDurationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let minuteDuration = toInteger(params);
	getServerConfig().minuteDuration = minuteDuration;
	setTimeMinuteDuration(null, minuteDuration);

	getServerConfig().needsSaved = true;

	announceAdminAction("ServerMinuteDurationSet", getPlayerName(client), makeReadableTime(hour, minute));
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setWeatherCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let weatherId = getWeatherFromParams(getParam(params, " ", 1));

	if(!weatherId) {
		messagePlayerError(client, `That weather ID or name is invalid!`);
		return false;
	}

	game.forceWeather(toInteger(weatherId));
	getServerConfig().weather = weatherId;

	getServerConfig().needsSaved = true;

	announceAdminAction("ServerWeatherSet", getPlayerName(client), getGameConfig().weatherNames[getServerGame()][toInteger(weatherId)]);
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setSnowingCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let falling = toInteger(getParam(params, " ", 1));
	let ground = toInteger(getParam(params, " ", 2));

	getServerConfig().fallingSnow = intToBool(falling);
	getServerConfig().groundSnow = intToBool(ground);

	updatePlayerSnowState(null);

	getServerConfig().needsSaved = true;

	announceAdminAction("ServerSnowSet", getPlayerName(client), `${getBoolRedGreenInlineColour(falling)}${getOnOffFromBool(falling)}`, `${getBoolRedGreenInlineColour(ground)}${getOnOffFromBool(ground)}`);
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setServerGUIColoursCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let colourRed = toInteger(getParam(params, " ", 1)) || 255;
	let colourGreen = toInteger(getParam(params, " ", 2)) || 255;
	let colourBlue = toInteger(getParam(params, " ", 3)) || 255;

	getServerConfig().guiColour = [colourRed, colourGreen, colourBlue];

	let clients = getClients();
	for(let i in clients) {
		sendPlayerGUIColours(clients[i]);
	}

	getServerConfig().needsSaved = true;

	//announceAdminAction(`${getPlayerName(client)} ${getInlineChatColourByName("orange")}set the server ${getBoolRedGreenInlineColour(fallingSnow)}${getOnOffFromBool(fallingSnow)} ${getInlineChatColourByName("orange")}and ground snow ${getBoolRedGreenInlineColour(groundSnow)}${getOnOffFromBool(groundSnow)}`);
	//updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function toggleServerLogoCommand(command, params, client) {
	getServerConfig().useLogo = !getServerConfig().useLogo;
	getServerConfig().needsSaved = true;

	updatePlayerShowLogoState(null, getServerConfig().useLogo);

	//announceAdminAction(`${getPlayerName(client)}{MAINCOLOUR}${getBoolRedGreenInlineColour(doesServerHaveServerLogoEnabled())}${toUpperCase(getOnOffFromBool(getServerConfig().useLogo))}`);
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerJobBlipsCommand(command, params, client) {
	getServerConfig().createJobBlips = !getServerConfig().createJobBlips;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerJobBlipsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createJobBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createJobBlips))}{MAINCOLOUR}`);
	resetAllJobBlips();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerJobPickupsCommand(command, params, client) {
	getServerConfig().createJobPickups = !getServerConfig().createJobPickups;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerJobPickupsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createJobPickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createJobPickups))}{MAINCOLOUR}`);
	resetAllJobPickups();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerBusinessBlipsCommand(command, params, client) {
	getServerConfig().createBusinessBlips = !getServerConfig().createBusinessBlips;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerBusinessBlipsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createBusinessBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createBusinessBlips))}{MAINCOLOUR}`);
	resetAllBusinessBlips();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerBusinessPickupsCommand(command, params, client) {
	getServerConfig().createBusinessPickups = !getServerConfig().createBusinessPickups;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerBusinessPickupsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createBusinessPickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createBusinessPickups))}{MAINCOLOUR}`);
	resetAllBusinessPickups();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerHouseBlipsCommand(command, params, client) {
	getServerConfig().createHouseBlips = !getServerConfig().createHouseBlips;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerHouseBlipsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createHouseBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createHouseBlips))}{MAINCOLOUR}`);
	resetAllHouseBlips();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleServerHousePickupsCommand(command, params, client) {
	getServerConfig().createHousePickups = !getServerConfig().createHousePickups;
	getServerConfig().needsSaved = true;

	announceAdminAction("ServerHousePickupsSet", `{adminRed}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(getServerConfig().createHousePickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createHousePickups))}{MAINCOLOUR}`);
	resetAllHousePickups();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function toggleServerGUICommand(command, params, client) {
	getServerConfig().useGUI = !getServerConfig().useGUI;

	getServerConfig().needsSaved = true;

	announceAdminAction(`${getPlayerName(client)}{MAINCOLOUR} turned GUI ${toLowerCase(getOnOffFromBool(getServerConfig().useGUI))} for this server`);
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function toggleServerUseRealWorldTimeCommand(command, params, client) {
	getServerConfig().useRealTime = !getServerConfig().useRealTime;

	getServerConfig().needsSaved = true;

	//announceAdminAction(`${getPlayerName(client)}{MAINCOLOUR} turned real-world time ${getServerConfig().useRealTime} for this server (GMT ${addPositiveNegativeSymbol(getServerConfig().realTimeZone)})`);
	updateServerGameTime();
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setServerRealWorldTimeZoneCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	getServerConfig().realTimeZone = toInteger(params);
	getServerConfig().needsSaved = true;

	//announceAdminAction(`${getPlayerName(client)} {MAINCOLOUR}set the time zone for in-game's real-world time to GMT ${addPositiveNegativeSymbol(getServerConfig().realTimeZone)}`);
	updateServerGameTime();
	updateServerRules();
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function reloadServerConfigurationCommand(command, params, client) {
	serverConfig = loadServerConfigFromGameAndPort(server.game, server.port);
	applyConfigToServer(serverConfig);
	updateServerRules();

	messagePlayerSuccess(client, `You reloaded the server configuration!`);
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function reloadEmailConfigurationCommand(command, params, client) {
	emailConfig = loadEmailConfiguration();
	messagePlayerSuccess(client, `You reloaded the email configuration!`);
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function reloadDatabaseConfigurationCommand(command, params, client) {
	if(databaseConfig.usePersistentConnection && isDatabaseConnected(persistentDatabaseConnection)) {
		console.warn(`[VRR.Database] Closing persistent database connection`);
		persistentDatabaseConnection.close();
		persistentDatabaseConnection = null;
	}
	databaseEnabled = false;
	databaseConfig = loadEmailConfig();
	messagePlayerSuccess(client, `You reloaded the database configuration!`);
	databaseEnabled = true;
	if(databaseConfig.usePersistentConnection) {
		connectToDatabase();
	}

	return true;
}

// ===========================================================================

function getServerIntroMusicURL() {
	return getServerConfig().introMusicURL;
}

// ===========================================================================

function loadLocaleConfig() {
	let localeConfig = JSON.parse(loadTextFile(`config/locale.json`));
	if(localeConfig != null) {
		return localeConfig;
	}
}

// ===========================================================================

function loadEconomyConfig() {
	let economyConfig = JSON.parse(loadTextFile(`config/economy.json`));
	if(economyConfig != null) {
		return economyConfig;
	}
}

// ===========================================================================

function loadAccentConfig() {
	let accentConfig = JSON.parse(loadTextFile(`config/accents.json`));
	if(accentConfig != null) {
		return accentConfig;
	}
}

// ===========================================================================

function loadDiscordConfig() {
	let discordConfig = JSON.parse(loadTextFile(`config/discord.json`));
	if(discordConfig != null) {
		return discordConfig;
	}
}

// ===========================================================================

function doesServerHaveGUIEnabled() {
	return getServerConfig().useGUI;
}

// ===========================================================================

function doesServerHaveTesterOnlyEnabled() {
	return getServerConfig().testerOnly;
}

// ===========================================================================

function doesServerHaveRealTimeEnabled() {
	return getServerConfig().useRealTime;
}

// ===========================================================================

function doesServerHaveBusinessPickupsEnabled() {
	return getServerConfig().createBusinessPickups
}

// ===========================================================================

function doesServerHaveHousePickupsEnabled() {
	return getServerConfig().createHousePickups;
}

// ===========================================================================

function doesServerHaveJobPickupsEnabled() {
	return getServerConfig().createJobPickups;
}

// ===========================================================================

function doesServerHaveBusinessBlipsEnabled() {
	return getServerConfig().createBusinessBlips;
}

// ===========================================================================

function doesServerHaveHouseBlipsEnabled() {
	return getServerConfig().createHouseBlips;
}

// ===========================================================================

function doesServerHaveJobBlipsEnabled() {
	return getServerConfig().createJobBlips;
}

// ===========================================================================

function doesServerHaveFallingSnowEnabled() {
	return getServerConfig().fallingSnow;
}

// ===========================================================================

function doesServerHaveGroundSnowEnabled() {
	return getServerConfig().groundSnow;
}

// ===========================================================================