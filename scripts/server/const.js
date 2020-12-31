// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2020 Asshat-Gaming (https://asshatgaming.com)
// ---------------------------------------------------------------------------
// FILE: const.js
// DESC: Provides constants
// TYPE: Server (JavaScript)
// ===========================================================================

// Prompts (used for client GUI prompt responses)
const AG_PROMPT_CREATEFIRSTCHAR = 1;

// Job Types
const AG_JOB_NONE = 0;
const AG_JOB_POLICE = 1;
const AG_JOB_MEDICAL = 2;
const AG_JOB_FIRE = 3;
const AG_JOB_BUS = 4;
const AG_JOB_TAXI = 5;
const AG_JOB_GARBAGE = 6;
const AG_JOB_WEAPON = 7;
const AG_JOB_DRUG = 8;

// Pickup Owner Types
const AG_PICKUP_NONE = 0;
const AG_PICKUP_JOB = 1;
const AG_PICKUP_BUSINESS_ENTRANCE = 2;
const AG_PICKUP_BUSINESS_EXIT = 3;
const AG_PICKUP_HOUSE_ENTRANCE = 4;
const AG_PICKUP_HOUSE_EXIT = 5;
const AG_PICKUP_EXIT = 5;

// Sphere Types
const AG_SPHERE_NONE = 0;
const AG_SPHERE_JOB = 1;
const AG_SPHERE_BUSINESS = 2;
const AG_SPHERE_HOUSE = 3;

// Vehicle Owner Types
const AG_VEHOWNER_NONE = 0;
const AG_VEHOWNER_PLAYER = 1;
const AG_VEHOWNER_JOB = 2;
const AG_VEHOWNER_CLAN = 3;
const AG_VEHOWNER_FACTION = 4;
const AG_VEHOWNER_PUBLIC = 5;
const AG_VEHOWNER_BIZ = 6;

// Business Owner Types
const AG_BIZOWNER_NONE = 0;
const AG_BIZOWNER_PLAYER = 1;
const AG_BIZOWNER_JOB = 2;
const AG_BIZOWNER_CLAN = 3;
const AG_BIZOWNER_FACTION = 4;
const AG_BIZOWNER_PUBLIC = 5;

// House Owner Types
const AG_HOUSEOWNER_NONE = 0;
const AG_HOUSEOWNER_PLAYER = 1;
const AG_HOUSEOWNER_JOB = 2;
const AG_HOUSEOWNER_CLAN = 3;
const AG_HOUSEOWNER_FACTION = 4;
const AG_HOUSEOWNER_PUBLIC = 5;

// Business Location Types
const AG_BIZLOC_NONE = 0;
const AG_BIZLOC_FUEL = 1;
const AG_BIZLOC_DRIVETHRU = 2;
const AG_BIZLOC_VENDMACHINE = 3;

// Account Contact Types
const AG_CONTACT_NONE = 0;
const AG_CONTACT_NEUTRAL = 1;
const AG_CONTACT_FRIEND = 2;
const AG_CONTACT_BLOCKED = 3;

// Job Work Types (Currently Unused)
const AG_JOBWORKTYPE_NONE = 0;
const AG_JOBWORKTYPE_ROUTE = 1; // Jobs that use routes. Bus, trash collector, mail, etc
const AG_JOBWORKTYPE_SELL = 2; // Jobs that sell items to other players and NPCs. Drugs, guns, etc
const AG_JOBWORKTYPE_SERVICE = 3; // Services to other players and NPCs. Taxi ride, mechanic fix, etc

// Vehicle Seats
const AG_VEHSEAT_DRIVER = 0;
const AG_VEHSEAT_FRONTPASSENGER = 1;
const AG_VEHSEAT_REARLEFTPASSENGER = 2;
const AG_VEHSEAT_REARRIGHTPASSENGER = 3;

// Ban Types
const AG_BANTYPE_NONE = 0;
const AG_BANTYPE_ACCOUNT = 1;
const AG_BANTYPE_SUBACCOUNT = 2;
const AG_BANTYPE_IPADDRESS = 3;
const AG_BANTYPE_SUBNET = 4;

// Blip Owner Types
const AG_BLIP_NONE = 0;
const AG_BLIP_JOB = 1;
const AG_BLIP_BUSINESS_ENTRANCE = 2;
const AG_BLIP_BUSINESS_EXIT = 3;
const AG_BLIP_HOUSE_ENTRANCE = 4;
const AG_BLIP_HOUSE_EXIT = 5;
const AG_BLIP_EXIT = 6;

// Insurance Account Owner Types
const AG_INS_ACCT_OWNER_NONE = 0;
const AG_INS_ACCT_OWNER_PLAYER = 1;
const AG_INS_ACCT_OWNER_BIZ = 2;
const AG_INS_ACCT_OWNER_CLAN = 3;

// Insurance Account Entity Types
const AG_INS_ACCT_ENTITY_NONE = 0;
const AG_INS_ACCT_ENTITY_PLAYER_HEALTH = 1;
const AG_INS_ACCT_ENTITY_PLAYER_LIFE = 2;
const AG_INS_ACCT_ENTITY_VEH = 3;
const AG_INS_ACCT_ENTITY_BIZ = 4;
const AG_INS_ACCT_ENTITY_HOUSE = 5;

// Insurance Account History Types
const AG_INS_ACCT_HISTORY_NONE = 0;
const AG_INS_ACCT_HISTORY_PLAYER_MEDICAL = 1;
const AG_INS_ACCT_HISTORY_PLAYER_DEATH = 2;
const AG_INS_ACCT_HISTORY_VEH_DAMAGE = 3;
const AG_INS_ACCT_HISTORY_VEH_WRECKED = 4;
const AG_INS_ACCT_HISTORY_VEH_THEFT = 5;
const AG_INS_ACCT_HISTORY_BIZ_DAMAGE = 6;
const AG_INS_ACCT_HISTORY_BIZ_THEFT = 7;
const AG_INS_ACCT_HISTORY_HOUSE_DAMAGE = 8;
const AG_INS_ACCT_HISTORY_HOUSE_THEFT = 9;