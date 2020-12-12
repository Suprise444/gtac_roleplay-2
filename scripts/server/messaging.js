// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2020 Asshat-Gaming (https://asshatgaming.com)
// ---------------------------------------------------------------------------
// FILE: messaging.js
// DESC: Provides messaging functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ---------------------------------------------------------------------------

function messageAdminAction(messageText) {
    message(`⚠️ ${messageText}`, getColourByName("orange"));
    messageDiscord(`:warning: ${messageText}`);
}

// ---------------------------------------------------------------------------

function messageClientNormal(client, messageText, colour = COLOUR_WHITE) {
    if(client.console) {
        console.log(`[Asshat.Messaging] ${messageText}`);
        return true;
    }

    if(client instanceof Client) {
        messageClient(`${messageText}`, client, colour);
    } else {
        messageDiscordUser(client, `${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientError(client, messageText) {
    if(client.console) {
        console.log(`[Asshat.Messaging] ERROR:  ${messageText}`);
        return true;
    }

    if(client instanceof Client) {
        messageClientNormal(client, `🚫 ${messageText}`, getColourByType("errorMessage"));
    } else {
        messageDiscordUser(client, `:no_entry_sign: ${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientSyntax(client, messageText) {
    if(client.console) {
        console.log(`[Asshat.Messaging] USAGE:  ${messageText}`);
        return true;
    }

    if(client instanceof Client) {
        messageClientNormal(client, `⌨️ USAGE: [#FFFFFF] ${messageText}`, getColourByType("syntaxMessage"));
    } else {
        messageDiscordUser(client, `:keyboard: ${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientAlert(client, messageText) {
    if(client.console) {
        console.log(`[Asshat.Messaging] ALERT: ${messageText}`);
        return true;
    }

    if(client instanceof Client) {
        messageClientNormal(client, `⚠️ [#FFFFFF] ${messageText}`, getColourByType("alertMessage"));
    } else {
        messageDiscordUser(client, `:warning: ${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientSuccess(client, messageText) {
    if(client.console) {
        console.log(`[Asshat.Messaging] SUCCESS: ${messageText}`);
        return true;
    }

    if(client instanceof Client) {
        messageClientNormal(client, `👍 [#FFFFFF] ${messageText}`, getColourByType("successMessage"));
    } else {
        messageDiscordUser(client, `:thumbsup: ${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientInfo(client, messageText) {
    if(client.console) {
        console.log(`[INFO] ${messageText}`);
        return true;
    }
        
    if(client instanceof Client) {
        messageClientNormal(client, `ℹ️ [#FFFFFF] ${messageText}`, getColourByType("successMessage"));
    } else {
        messageDiscordUser(client, `:information_source: ${messageText}`);
    }
}

// ---------------------------------------------------------------------------

function messageClientTalk(client, talkingClient, messageText) {
    messageClientNormal(client, `${getClientSubAccountName(talkingClient)} says: ${messageText}`, getColourByType("talkMessage"));
}

// ---------------------------------------------------------------------------

function messageClientWhisper(client, whisperingClient, messageText) {
    messageClientNormal(client, `${getClientSubAccountName(whisperingClient)} whispers: ${messageText}`, getColourByType("whisperMessage"));
}

// ---------------------------------------------------------------------------

function messageClientShout(client, shoutingClient, messageText) {
    messageClientNormal(client, `${getClientSubAccountName(shoutingClient)} shouts: ${messageText}!`, getColourByType("shoutMessage"));
}

// ---------------------------------------------------------------------------

function messageClientDoAction(client, doingActionClient, messageText) {
    if(client instanceof Client) {
        messageClientNormal(client, `${messageText} * (${getClientSubAccountName(doingActionClient)})`, getColourByType("doActionMessage"));
    }
}

// ---------------------------------------------------------------------------

function messageClientMeAction(client, doingActionClient, messageText) {
    messageClientNormal(client, `${getClientSubAccountName(doingActionClient)} ${messageText}`, getColourByType("meActionMessage"));
}

// ---------------------------------------------------------------------------

function messageClientClanChat(client, clanChattingClient, messageText) {
    messageClientNormal(client, `(${getClientSubAccountClanRank(clanChattingClient)}) ${getClientSubAccountName(clanChattingClient)} says (clan): ${messageText}`, getColourByType("clanChatMessage"));
}

// ---------------------------------------------------------------------------