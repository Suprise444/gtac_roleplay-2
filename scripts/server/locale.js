// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale structures, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

let translateURL = "http://api.mymemory.translated.net/get?de={3}&q={0}&langpair={1}|{2}";

// ===========================================================================

function initLocaleScript() {
	logToConsole(LOG_INFO, "[VRR.Locale]: Initializing locale script ...");
	getServerData().localeStrings = loadAllLocaleStrings();

	// Translation Cache
	getServerData().cachedTranslations = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom.fill([]);
	getServerData().cachedTranslations.fill(getServerData().cachedTranslationFrom);

	getGlobalConfig().locale.defaultLanguageId = getLocaleFromParams(getGlobalConfig().locale.defaultLanguageId);

	logToConsole(LOG_INFO, "[VRR.Locale]: Locale script initialized!");
}

// ===========================================================================

function getLocaleString(client, stringName, ...args) {
	let tempString = getRawLocaleString(stringName, getPlayerData(client).locale);
	if(tempString == "") {
		submitBugReport(client, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getPlayerLocaleName(client)}"`);
	}

	for(let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i-1]);
	}

	return tempString;
}

// ===========================================================================

function getGroupedLocaleString(client, stringName, index, ...args) {
	let tempString = getRawGroupedLocaleString(stringName, getPlayerData(client).locale, index);

	for(let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i-1]);
	}

	return tempString;
}

// ===========================================================================

function getRawLocaleString(stringName, localeName) {
	return getLocaleStrings()[localeName][stringName];
}

// ===========================================================================

function getRawGroupedLocaleString(stringName, localeName, index) {
	return getLocaleStrings()[localeName][stringName][index];
}

// ===========================================================================

function getPlayerLocaleName(client) {
	let localeId = getPlayerData(client).locale;
	return getLocales()[localeId][0];
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = getGlobalConfig().locale.locales;
	for(let i in locales) {
		let localeData = locales[i];
		let localeFile = JSON.parse(loadTextFile(`locale/${localeData[1]}.json`));
		tempLocaleStrings[i] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings() {
	return getServerData().localeStrings;
}

// ===========================================================================

function getLocaleFromParams(params) {
	let locales = getLocales();
	if(isNaN(params)) {
		for(let i in locales) {
			if(toLowerCase(locales[i][2]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}

			if(toLowerCase(locales[i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function getLocales() {
	return getGlobalConfig().locale.locales;
}

// ===========================================================================

function showLocaleListCommand(command, params, client) {
	let localeList = getLocales().map(function(x) { return x[0]; });
	let chunkedList = splitArrayIntoChunks(localeList, 10);

	messagePlayerInfo(client, getLocaleString(client, "HeaderLocaleList"));
	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setLocaleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let localeId = getLocaleFromParams(params);

	if(!getLocaleData(localeId)) {
		messagePlayerInfo(client, getLocaleString(client, "InvalidLocale"));
		return false;
	}

	getPlayerData(client).accountData.locale = localeId;
	getPlayerData(client).locale = localeId;
	messagePlayerSuccess(client, getLocaleString(client, "LocaleChanged1"), getLocaleString(client, "LocaleNativeName"));
}

// ===========================================================================

function getLocaleData(localeId) {
	if(typeof getLocales()[localeId] != "undefined") {
		return getLocales()[localeId];
	}

	return false;
}

// ===========================================================================

function reloadLocaleConfigurationCommand(command, params, client) {
	getGlobalConfig().locale = loadLocaleConfig();
	getServerData().localeStrings = loadAllLocaleStrings();

	// Translation Cache
	getServerData().cachedTranslations = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom.fill([]);
	getServerData().cachedTranslations.fill(getServerData().cachedTranslationFrom);

	getGlobalConfig().locale.defaultLanguageId = getLocaleFromParams(getGlobalConfig().locale.defaultLanguage);

	messageAdmins(`${client.name}{MAINCOLOUR} has reloaded the locale settings and texts`);
}

// ===========================================================================

async function translateMessage(messageText, translateFrom = getGlobalConfig().locale.defaultLanguageId, translateTo = getGlobalConfig().locale.defaultLanguageId) {
	return new Promise(resolve => {
		if(translateFrom == translateTo) {
			resolve(messageText);
		}

		for(let i in cachedTranslations[translateFrom][translateTo]) {
			if(cachedTranslations[translateFrom][translateTo][i][0] == messageText) {
				logToConsole(LOG_DEBUG, `[Translate]: Using existing translation for ${getGlobalConfig().locale.locales[translateFrom][0]} to ${getGlobalConfig().locale.locales[translateTo][0]} - (${messageText}), (${cachedTranslations[translateFrom][translateTo][i][1]})`);
				resolve(cachedTranslations[translateFrom][translateTo][i][1]);
			}
		}

		let thisTranslationURL = translateURL.format(encodeURI(messageText), toUpperCase(getGlobalConfig().locale.locales[translateFrom][2]), toUpperCase(getGlobalConfig().locale.locales[translateTo][2]), getGlobalConfig().locale.apiEmail);
		httpGet(
			thisTranslationURL,
			"",
			function(data) {
				data = ArrayBufferToString(data);
				let translationData = JSON.parse(data);
				cachedTranslations[translateFrom][translateTo].push([messageText, translationData.responseData.translatedText]);
				resolve(translationData.responseData.translatedText);
			},
			function(data) {
			}
		);
	});
}

// ===========================================================================