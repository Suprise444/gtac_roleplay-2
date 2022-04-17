// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: database.js
// DESC: Provides database handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

let persistentDatabaseConnection = null;

// ===========================================================================

function initDatabaseScript() {
	logToConsole(LOG_INFO, "[VRR.Database]: Initializing database script ...");
	databaseConfig = loadDatabaseConfiguration();
	logToConsole(LOG_INFO, "[VRR.Database]: Database script initialized successfully!");
}

// ===========================================================================
