// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: gui.js
// DESC: Provides GUI functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initGUIScript() {
	logToConsole(LOG_INFO, "[VRR.GUI]: Initializing GUI script ...");
	logToConsole(LOG_INFO, "[VRR.GUI]: GUI script initialized successfully!");
}

// ===========================================================================

function playerPromptAnswerNo(client) {
	if(getPlayerData(client).promptType == VRR_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.GUI] ${getPlayerDisplayForConsole(client)} answered NO to their prompt (${getPlayerData(client).promptType})`);

	switch(getPlayerData(client).promptType) {
		case VRR_PROMPT_CREATEFIRSTCHAR:
			logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} chose not to create a first character. Kicking them from the server ...`);
			showPlayerErrorGUI(client, "You don't have a character to play. Goodbye!", "No Characters");
			setTimeout(function() { client.disconnect(); }, 5000);
			break;

			case VRR_PROMPT_BIZORDER:
				if(getPlayerData(client).businessOrderAmount > 0) {
					if(canPlayerUseGUI(client)) {
						showPlayerErrorGUI(client, "You canceled the order.", "Business Order Canceled");
					} else {
						logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} canceled the order of ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness)}`);
						messagePlayerError(client, "You canceled the order!");
					}
				} else {
					showPlayerErrorGUI(client, "You aren't ordering anything for a business!", "Business Order Canceled");
				}
				break;

		default:
			break;
	}

	getPlayerData(client).promptType = VRR_PROMPT_NONE;
}

// ===========================================================================

function playerPromptAnswerYes(client) {
	if(getPlayerData(client).promptType == VRR_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.GUI] ${getPlayerDisplayForConsole(client)} answered YES to their prompt (${getPlayerData(client).promptType})`);

	switch(getPlayerData(client).promptType) {
		case VRR_PROMPT_CREATEFIRSTCHAR:
			showPlayerNewCharacterGUI(client);
			break;

		case VRR_PROMPT_BIZORDER:
			if(getPlayerData(client).businessOrderAmount > 0) {
				if(getBusinessData(getPlayerData(client).businessOrderBusiness).till < getPlayerData(client).businessOrderCost) {
					logToConsole(LOG_DEBUG, `[VRR.GUI] ${getPlayerDisplayForConsole(client)} failed to order ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name} (Reason: Not enough money in business till)`);
					showPlayerErrorGUI(client, "This business doesn't have enough money! Deposit some using /bizdeposit", "Business Order Canceled");
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;
				} else {
					logToConsole(LOG_DEBUG, `[VRR.GUI] ${getPlayerDisplayForConsole(client)} successfully ordered ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name}`);
					showPlayerInfoGUI(client, `You ordered ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} (${getItemValueDisplay(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue)}) for ${getPlayerData(client).businessOrderCost}!`, "Business Order Successful");
					createItem(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue, VRR_ITEM_OWNER_BIZFLOOR, getBusinessData(getPlayerData(client).businessOrderBusiness).databaseId, getPlayerData(client).businessOrderAmount);
					cacheBusinessItems(getPlayerData(client).businessOrderBusiness);
					getBusinessData(getPlayerData(client).businessOrderBusiness).till -= getPlayerData(client).businessOrderCost;
					updateBusinessPickupLabelData(getPlayerData(client).businessOrderBusiness);
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;

				}
			} else {
				showPlayerErrorGUI(client, ``, `Business Order Canceled`);
			}
			break;

		case VRR_PROMPT_GIVEVEHTOCLAN:
			if(!isPlayerInAnyVehicle(client)) {
				messagePlayerError(client, getLocaleString(client, "MustBeInVehicle"));
				return false;
			}

			if(!getVehicleData(getPlayerVehicle(client))) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if(getVehicleData(getPlayerVehicle(client)).ownerType != VRR_VEHOWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			if(getVehicleData(getPlayerVehicle(client)).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			getVehicleData(getPlayerVehicle(client)).ownerType = VRR_VEHOWNER_CLAN;
			getVehicleData(getPlayerVehicle(client)).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveVehicleToClan"));
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;

		default:
			break;
	}

	getPlayerData(client).promptType = VRR_PROMPT_NONE;
}

// ===========================================================================

function canPlayerUseGUI(client) {
	return (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client));
}

// ===========================================================================

function playerPromptAnswerYesCommand(command, params, client) {
	playerPromptAnswerYes(client);
}

// ===========================================================================

function playerPromptAnswerNoCommand(command, params, client) {
	playerPromptAnswerNo(client);
}

// ===========================================================================

function playerToggledGUI(client) {
	toggleAccountGUICommand("gui", "", client);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client) {
	sendNetworkEventToPlayer("vrr.changePassword", client);
}

// ===========================================================================

function showPlayerTwoFactorAuthenticationGUI(client) {
	sendNetworkEventToPlayer("vrr.2fa", client);
}

// ===========================================================================