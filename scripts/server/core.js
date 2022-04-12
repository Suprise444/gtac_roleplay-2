// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: core.js
// DESC: Provides core data structures, function, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

let scriptVersion = "1.0";
let serverStartTime = 0;
let logLevel = LOG_INFO|LOG_DEBUG|LOG_VERBOSE|LOG_WARN|LOG_ERROR;

// ===========================================================================

let serverData = {
	vehicles: [],
	clients: new Array(128),
	businesses: [],
	houses: [],
	commands: {},
	groundItemCache: [],
	groundPlantCache: [],
	items: [],
	itemTypes: [],
	clans: [],
	antiCheat: {
		//whiteListedGameScripts: [],
		//blackListedGameScripts: [],
	},
	localeStrings: {},
	cachedTranslations: [],
	cachedTranslationFrom: [],
	triggers: [],
	npcs: [],
};

// ===========================================================================

// Pre-cache allowed skins
let allowedSkins = getAllowedSkins(getGame());

// ===========================================================================

function initServerData() {
}

// ===========================================================================

function getServerData() {
	return serverData;
}

// ===========================================================================

function getModNatives() {
	return modNatives;
}

// ===========================================================================