// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Client (JavaScript)
// ===========================================================================

function initEventScript() {
	logToConsole(LOG_DEBUG, "[VRR.Event]: Initializing event script ...");
	addEventHandlers();
	logToConsole(LOG_DEBUG, "[VRR.Event]: Event script initialized!");
}

// ===========================================================================

function onResourceStart(event, resource) {
	sendResourceStartedSignalToServer();
	setUpInitialGame();
	//garbageCollectorInterval = setInterval(collectAllGarbage, 1000*60);
}

// ===========================================================================

function onResourceStop(event, resource) {
	sendResourceStoppedSignalToServer();
}

// ===========================================================================

function onResourceReady(event, resource) {
	sendResourceReadySignalToServer();
}

// ===========================================================================

function onProcess(event, deltaTime) {
	if(localPlayer == null) {
		return false;
	}

	if(!isSpawned) {
		return false;
	}

	processSync();
	processLocalPlayerControlState();
	processLocalPlayerVehicleControlState();
	processLocalPlayerSphereEntryExitHandling();
	processLocalPlayerVehicleEntryExitHandling();
	processJobRouteSphere();
	forceLocalPlayerEquippedWeaponItem();
	processWantedLevelReset();
	processGameSpecifics();
	processNearbyPickups();
	processVehiclePurchasing();
	//checkChatBoxAutoHide(); // Will be uncommented on 1.4.0 GTAC update
	//processVehicleFires();
}

// ===========================================================================

function onKeyUp(event, keyCode, scanCode, keyModifiers) {
	processSkinSelectKeyPress(keyCode);
	//processKeyDuringAnimation();
	processGUIKeyPress(keyCode);
	processToggleGUIKeyPress(keyCode);
}

// ===========================================================================

function onDrawnHUD(event) {
	if(!renderHUD) {
		return false;
	}

	if(localPlayer == null) {
		return false;
	}

	processSmallGameMessageRendering();
	processScoreBoardRendering();
	processLabelRendering();
	processLogoRendering();
	processItemActionRendering();
	processSkinSelectRendering();
	processNameTagRendering();
	processInteriorLightsRendering();
}

// ===========================================================================

function onPedWasted(event, wastedPed, killerPed, weapon, pedPiece) {
	logToConsole(LOG_DEBUG, `[VRR.Event] Ped ${wastedPed.name} died`);
	wastedPed.clearWeapons();
}

// ===========================================================================

function onElementStreamIn(event, element) {
	syncElementProperties(element);
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	if(ped == localPlayer) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited vehicle`);
		if(inVehicleSeat) {
			parkedVehiclePosition = false;
			parkedVehicleHeading = false;
		}
	}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	if(ped == localPlayer) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered vehicle`);

		if(inVehicleSeat == 0) {
			inVehicle.engine = false;
			if(!inVehicle.engine) {
				parkedVehiclePosition = inVehicle.position;
				parkedVehicleHeading = inVehicle.heading;
			}
		}
	}
}

// ===========================================================================

function onPedInflictDamage(event, damagedEntity, damagerEntity, weaponId, healthLoss, pedPiece) {
	//let damagerEntityString = (!isNull(damagedEntity)) ? `${damagerEntity.name} (${damagerEntity.name}, ${damagerEntity.type} - ${typeof damagerEntity})` : `Unknown ped`;
	//let damagedEntityString = (!isNull(damagedEntity)) ? `${damagedEntity.name} (${damagedEntity.name}, ${damagedEntity.type} - ${typeof damagedEntity})` : `Unknown ped`;
	//logToConsole(LOG_DEBUG, `[VRR.Event] ${damagerEntityString} damaged ${damagedEntityString}'s '${pedPiece} with weapon ${weaponId}`);
	if(!isNull(damagedEntity) && !isNull(damagerEntity)) {
		if(damagedEntity.isType(ELEMENT_PLAYER)) {
			if(damagedEntity == localPlayer) {
				//if(!weaponDamageEnabled[damagerEntity.name]) {
					event.preventDefault();
					sendNetworkEventToServer("vrr.weaponDamage", damagerEntity.name, weaponId, pedPiece, healthLoss);
				//}
			}
		}
	}
}

// ===========================================================================

function onPedEnterSphere(event, ped, sphere) {
	//logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered sphere`);
	if(ped == localPlayer) {
		if(sphere == jobRouteLocationSphere) {
			enteredJobRouteSphere();
		}
	}
}

// ===========================================================================

function onPedExitSphere(event, ped, sphere) {
	//logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited sphere`);
}

// ===========================================================================

function onLostFocus(event) {
	processLostFocusAFK();
}

// ===========================================================================

function onFocus(event) {
	processFocusAFK();
}

// ===========================================================================

function onPedChangeWeapon(oldWeapon, newWeapon) {

}

// ===========================================================================

function onCameraProcess(event) {

}

// ===========================================================================

function onMouseWheel(event, mouseId, up) {
	processMouseWheelForChatBox(mouseId, up);
}

// ===========================================================================