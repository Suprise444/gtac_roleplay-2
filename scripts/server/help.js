// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2020 Asshat-Gaming (https://asshatgaming.com)
// ---------------------------------------------------------------------------
// FILE: help.js
// DESC: Provides update info, help commands, and documentation
// TYPE: Server (JavaScript)
// ===========================================================================

// ----------------------------------------------------------------------------

let randomTips = [
    `[#FFFFFF]Press [#0066FF]E [#FFFFFF]near a taxi if you need a ride.`,
    `[#FFFFFF]Press [#0066FF]G [#FFFFFF]to enter a vehicle as passenger.`,
    `[#FFFFFF]Banks can provide loans. Use [#AAAAAA]/help loans [#FFFFFF] for more details.`,
    `[#FFFFFF]Want to make a clan? Use [#AAAAAA]/help clans [#FFFFFF] for details.`,
    `[#FFFFFF]Weapons can be legally purchased at ammunation, if you have a weapon license.`,
    `[#FFFFFF]Look for yellow dots on your map for job locations.`,
    `[#FFFFFF]You can set custom key binds. Use [#AAAAAA]/help keys [#FFFFFF] for details.`,
    `[#FFFFFF]Tax is based on your total wealth. This includes money, vehicles, businesses and more.`,
    `[#FFFFFF]Don't go broke because of a hospital bill! Get insured today by visiting an insurance agency!`,
    `[#FFFFFF]Don't go broke because your car was destroyed. Visit an insurance agency today!`,
    `[#FFFFFF]You can find most businesses and locations by using [#AAAAAA]/gps`,
];

// ----------------------------------------------------------------------------

function helpCommand(command, params, client) {
	if(areParamsEmpty(params)) {
        showMainHelpMessage(client);
        return false;
    }

    switch(toLowerCase(params)) {
        case "account":
            showAccountHelpMessage(client);
            break;

        case "vehicle":
            showVehicleHelpMessage(client);
            break; 

        case "dealership":
            showVehicleDealershipHelpMessage(client);
            break;    
            
        case "job":
            showJobHelpMessage(client);
            break;             
            
        case "chat":
            showChatHelpMessage(client);
            break; 

        case "rules":
            showRulesHelpMessage(client);
            break; 
                
        case "website":
            showWebsiteHelpMessage(client);
            break;
            
        case "discord":
            showDiscordHelpMessage(client);
            break;
            
        case "anim":
        case "animation":
            showAnimationHelpMessage(client);
            break;
            
        case "ammunation":
        case "ammu":
            showAmmunationHelpMessage(client);
            break;

        case "skins":
        case "clothes":
            showClothesHelpMessage(client);
            break;
        
        case "key":            
        case "keys":
        case "keybinds":
        case "bindkey":
        case "bindkeys":
            showBindKeysHelpMessage(client);
            break;

        default:
            showMainHelpMessage(client);
            break;
    }
}

// == Account Help =============================
// == Vehicle Help =============================
// == Vehicle Dealerships ======================
// == Job Help =================================
// == Chat Help ================================
// == Server Rules =============================
// == Website ==================================
// == Discord ==================================
// == Animations ===============================
// == Pay And Spray ============================
// == Ammunation ===============================
// == Vehicle Tuneup ===========================
// == Bindable Keys ============================
// == Clothes ==================================

// ----------------------------------------------------------------------------

function showMainHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Help [#FF9900]=================================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Use /help <category> for commands and info. Example: [#AAAAAA]/help vehicle");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Help Categories: [#A9A9A9]account, command, vehicle, job, chat, rules, website, anim");
    messageClientNormal(client, "[#FF9900]• [#A9A9A9]ammunation, skins, mechanic, dealership, discord, colours, keys");
}

// ----------------------------------------------------------------------------

function showAccountHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Account Help [#FF9900]=============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Do not share your password with anybody else.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Use [#AAAAAA]/changepass[#FFFFFF] to change your password.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Some settings you can use: [#AAAAAA]/gui, /logo, /iplogin, /autolastchar, /2fa, /loginalert");
}

// ----------------------------------------------------------------------------

function showVehicleHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Vehicle Help [#FF9900]=============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Visit dealerships to buy new vehicles (Use [#AAAAAA]/help dealership [#FFFFFF]for more info.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Some commands: [#AAAAAA]/lock, /engine, /lights, /trunk, /rentveh, /buyveh, /rentprice, /buyprice");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Your personal vehicles will save wherever you or somebody else leaves them!");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Visit a mechanic garage to repair, colour, and tune up your car! [#AAAAAA]/help mechanic [#FFFFFF] for info");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Don't forget to register and insure your vehicle! Use [#AAAAAA]/gps [#FFFFFF]to find a DMV for this.");
}

// ----------------------------------------------------------------------------

function showVehicleDealershipHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Vehicle Dealerships [#FF9900]======================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Visit a vehicle dealer to buy new vehicles. Use [#AAAAAA]/gps [#FFFFFF]to find one.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]At the dealer, simply enter a car you want to buy, and the price will be shown to you");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]If you want to buy the vehicle and have enough money, use [#AAAAAA]/buyveh [#FFFFFF]and you will be given keys");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]A new car for sale will appear when you drive away from the dealer.");
}

// ----------------------------------------------------------------------------

function showJobHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Job Help [#FF9900]=================================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Visit job locations get a job and earn money. Look for yellow spots on the map");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]At a job location, use [#AAAAAA]/takejob [#FFFFFF]to get the job. Use [#AAAAAA]/quitjob [#FFFFFF]to quit your job");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Use [#AAAAAA]/startwork [#FFFFFF]to begin working. You can also get a job [#AAAAAA]/uniform and [#AAAAAA]/equipment");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Most job vehicles are locked. Use [#AAAAAA]/lock [#FFFFFF]near one to enter it.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]When entering a job vehicle, information on how to do the job will be shown to you.");
}

// ----------------------------------------------------------------------------

function showChatHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Chat Help [#FF9900]================================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]There are two main types of chat: out-of-character (OOC) and in-character (IC)");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Mixing these two types is not proper roleplay. See [#AAAAAA]/rules [#FFFFFF]for info.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Some chat commands: [#AAAAAA]/dm /whisper /talk /shout /me.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Some have shorter names available ([#AAAAAA]/t [#FFFFFF]for talk, [#AAAAAA]/s [#FFFFFF]for shout, etc)");
}

// ----------------------------------------------------------------------------

function showRulesHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Server Rules [#FF9900]=============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Unrealistic actions (powergaming) are not allowed. You aren't superman.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]No terrorist or terrorism roleplay is allowed.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Always follow instructions given by moderators and admins.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Do not mix the chats (metagaming). You can't use info in IC that was received OOC");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Keep English in main chats. If you aren't good at English, use [#AAAAAA]/help [#FFFFFF]language");
}

// ----------------------------------------------------------------------------

function showWebsiteHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Website [#FF9900]=============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]The website is [#AAAAAA]https://asshatgaming.com");
}

// ----------------------------------------------------------------------------

function showDiscordHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Discord [#FF9900]=============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Join our discord! [#AAAAAA]https://discord.gg/4TQ3TGB529");
}

// ----------------------------------------------------------------------------

function showAnimationHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Animations [#FF9900]===============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Animations are not yet available.");
}

// ----------------------------------------------------------------------------

function showAmmunationHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Ammunation [#FF9900]===============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Visit an ammunation to buy weapons. Use [#AAAAAA]/gps [#FFFFFF]to find one.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Buying a weapon requires a weapon license.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Weapon licenses are managed by the police department. Apply there to get one.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Weapons can also be purchased illegally from weapon dealers and clans.");
}

// ----------------------------------------------------------------------------

function showClothesHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Clothes [#FF9900]==================================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]To change your skin, use [#AAAAAA]/gps [#FFFFFF]to find a clothing store");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]At a clothing store, use [#AAAAAA]/buyclothes [#FFFFFF]to choose a skin");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Some skins are restricted to jobs, clans, or for other reasons.");
}

// ----------------------------------------------------------------------------

function showBindKeysHelpMessage(client) {
    messageClientInfo(client, "[#FF9900]== [#FFFF00]Bindable Keys [#FF9900]============================");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]You can set your own keys binds. Use [#AAAAAA]/keybinds [#FFFFFF]to add, remove, or change your keys.");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Default keys are: [#0066FF]K [#FFFFFF]for engine, [#0066FF]I [#FFFFFF]for lights, and [#0066FF]L [#FFFFFF]for lock/unlock");
    messageClientNormal(client, "[#FF9900]• [#FFFFFF]Your keybinds will automatically be usable on all servers");
}

// ----------------------------------------------------------------------------

function showEnteredDriverSeatHasKeysHelpTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.enteredDriverSeat) {
        messageClientInfo(client, `You can press K for engine, I for lights, and L to lock/unlock the car.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.enteredDriverSeat;
    }
}

// ----------------------------------------------------------------------------

function showApproachJobWhileUnemployedTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.approachJobWhileUnemployed) {
        messageClientTip(client, `Approach the icon and use /jobinfo to see details about this job.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.approachJobWhileUnemployed;
    }  
}

// ----------------------------------------------------------------------------

function showTakeNearbyJobTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.takeJobWhileUnemployed) {
        messageClientTip(client, `You are nearby a job location. Look for the spinning icon.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.takeJobWhileUnemployed;
    }  
}

// ----------------------------------------------------------------------------

function showApproachCurrentJobTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.approachCurrentJob) {
        //messageClientTip(client, `Press ${getServerConfig().keybindText.actionKey} to start working, or hold ${getServerConfig().keybindText.actionKey} to quit your job.`);
        messageClientTip(client, `This job location is for your job. You can use /startwork to start working.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.approachCurrentJob;
    }
}

// ----------------------------------------------------------------------------

function showApproachOtherJobTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.approachCurrentJob) {
        //messageClientTip(client, `Press ${getServerConfig().keybindText.actionKey} to start working, or hold ${getServerConfig().keybindText.actionKey} to quit your job.`);
        messageClientTip(client, `This job location belongs to another job. If you want this job, use /quitjob first.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.approachCurrentJob;
    }
}

// ----------------------------------------------------------------------------

function showStartedWorkingTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.startedWorking) {
        //messageClientTip(client, `Press ${getServerConfig().keybindText.actionKey} to change uniform, or hold ${getServerConfig().keybindText.actionKey} to stop working.`);
        messageClientTip(client, `Use /uniform to see job skins and /equip to see available jobs tools and weapons.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.startedWorking;
    }
}

// ----------------------------------------------------------------------------

function showApproachOwnedVehicleTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.approachOwnedVehicle) {
        messageClientTip(client, `This vehicle is owned by you.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.approachOwnedVehicle;
    }
}

// ----------------------------------------------------------------------------

function showApproachClanVehicleTip(client) {
    if(getClientData(client).accountData.shownTips & !shownTipsFlags.approachAnyVehicle) {
        messageClientTip(client, `Your clan owns this vehicle.`);
        getClientData(client).accountData.shownTips = getClientData(client).accountData.shownTips | shownTipsFlags.approachAnyVehicle;
    }
}

// ----------------------------------------------------------------------------