// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: animation.js
// DESC: Provides animation functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function makePedPlayAnimation(pedId, animationSlot, positionOffset) {
	let animationData = getAnimationData(animationSlot);
	logToConsole(LOG_DEBUG, `[VRR.Animation] Playing animation ${animationData[0]} for ped ${pedId}`);

	let freezePlayer = false;
	switch(animationData.moveType) {
		case VRR_ANIMMOVE_FORWARD:
			setElementCollisionsEnabled(ped, false);
			setElementPosition(ped, getPosInFrontOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
			freezePlayer = true;
			break;

		case VRR_ANIMMOVE_BACK:
			setElementCollisionsEnabled(ped, false);
			setElementPosition(ped, getPosBehindPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
			freezePlayer = true;
			break;

		case VRR_ANIMMOVE_LEFT:
			setElementCollisionsEnabled(ped, false);
			setElementPosition(ped, getPosToLeftOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
			freezePlayer = true;
			break;

		case VRR_ANIMMOVE_RIGHT:
			setElementCollisionsEnabled(ped, false);
			setElementPosition(ped, getPosToRightOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
			freezePlayer = true;
			break;

		default:
			break;
	}

	if(getGame() < VRR_GAME_GTA_IV) {
		if(animationData.animType == VRR_ANIMTYPE_NORMAL || animationData.animType == VRR_ANIMTYPE_SURRENDER) {
			if(getGame() == VRR_GAME_GTA_VC || getGame() == VRR_GAME_GTA_SA) {
				getElementFromId(pedId).clearAnimations();
			} else {
				getElementFromId(pedId).clearObjective();
			}
			getElementFromId(pedId).addAnimation(animationData.groupId, animationData.animId);

			if(getElementFromId(pedId) == localPlayer && freezePlayer == true) {
				inAnimation = true;
				setLocalPlayerControlState(false, false);
				localPlayer.collisionsEnabled = false;
			}
		} else if(animationData.animType == VRR_ANIMTYPE_BLEND) {
			getElementFromId(pedId).position = getElementFromId(pedId).position;
			getElementFromId(pedId).blendAnimation(animationData.groupId, animationData.animId, animationData.animSpeed);
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(getElementFromId(pedId), animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function forcePedAnimation(pedId, animSlot) {
	let animationData = getAnimationData(animSlot);

	if(getGame() < VRR_GAME_GTA_IV) {
		getElementFromId(pedId).position = getElementFromId(pedId).position;
		getElementFromId(pedId).addAnimation(animationData.groupId, animationData.animId);

		if(getElementFromId(pedId) == localPlayer) {
			inAnimation = true;
			setLocalPlayerControlState(false, false);
			localPlayer.collisionsEnabled = false;
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(getElementFromId(pedId), animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function makePedStopAnimation(pedId) {
	if(getElementFromId(pedId) == null) {
		return false;
	}

	if(getGame() != VRR_GAME_GTA_IV) {
		if(getGame() == VRR_GAME_GTA_VC || getGame() == VRR_GAME_GTA_SA) {
			getElementFromId(pedId).clearAnimations();
		} else {
			getElementFromId(pedId).clearObjective();
		}
	}

	if(getElementFromId(pedId) == localPlayer) {
		if(getGame() != VRR_GAME_GTA_IV) {
			localPlayer.collisionsEnabled = true;
		}
		setLocalPlayerControlState(true, false);
	}
}

// ===========================================================================

/**
 * @param {number} animationSlot - The slot index of the animation
 * @return {Array} The animation's data (array)
 */
 function getAnimationData(animationSlot, gameId = getGame()) {
	return getGameConfig().animations[gameId][animationSlot];
}

// ===========================================================================