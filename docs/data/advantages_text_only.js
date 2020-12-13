const advantages = {

	"Absolute Direction": {
		"type": "Mental",
		"cost": 1,
		"discount": "",
		"text": "You possess an almost supernatural sense of direction, and you always know what direction is north, no matter the circumstances. This ability does not function if you are more than one day’s travel inside the Shadowlands.",
	},

	"Allies": {
		"type": "Social",
		"cost": [2, 3, 4, 5, 6, 8],
		"discount": "clan_Crane",
		"text": "You have carefully nurtured social connections. Some of those in your web of connections would go to great lengths to protect you, while others have considerable resources. And some precious few are both.",
		"player_input": true,
		"player_input_text": "Ally: ",
		"player_selection": [
			["Influence", "minor_1", "moderate_2", "major_4"],
			["Devotion", "not-honor_1", "secret_2", "anything_4"]
		]
	},

	"Balance": {
		"type": "Mental",
		"cost": 2,
		"discount": "",
		"text": "You possess an inherent calm and serenity that others have difficulty overcoming when attempting to antagonize or taunt you, and that strengthens you when your honor is tested. When adding your Honor Rank to the total of any roll made to resist Intimidation or Temptation, you add an additional +1k0 to the roll as well.",
	},

	"Blackmail": {
		"type": "Social",
		"cost": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		"discount": "clan_Scorpion",
		"text": "You possess knowledge and proof of a dark secret held by another, and can use that secret to elicit their cooperation in a number of ways. Using this Advantage too frequently or making grandiose demands on the person in question may result in them deciding your death is worth the risk of exposing their secret, no matter what the consequences might be.",
		"player_input": true,
		"player_input_text": "Blackmail: ",
	},

	"Bland": {
		"type": "Physical",
		"cost": 2,
		"discount": "",
		"text": "You are extremely unremarkable in every regard, and others have a difficult time recognizing you unless you deliberately draw attention to your identity or affiliations. Whenever someone is making a Lore: Bushido / Awareness roll to determine your Honor Rank, or a Lore: Heraldry / Intelligence roll to determine your identity (based on your Glory Rank), you may voluntarily choose to increase the TN of that roll by 10.",
	},

	"Blissful Betrothal": {
		"type": "Social",
		"cost": 3,
		"discount": "",
		"text": "Your marriage has been arranged and, much to your delight, you have come to truly love your intended spouse. The social connections you have established as part of your enthusiastic marriage preparations allows you to purchase the following Advantages for two points less each (to a minimum of 1 point): Gentry, Kharmic Tie (with your betrothed only), Social Position, and Wealth.",
		"player_input": true,
		"player_input_text": "Betrothed: ",
	},

	"Blood of Osano-Wo": {
		"type": "Spiritual",
		"cost": 4,
		"discount": "clan_Crab, clan_Mantis",
		"text": "You are descended from a bloodline of Hida Osano-Wo, the Fortune of Fire and Thunder, and his resilience lives on in you. You are immune to any penalties or damage from natural weather conditions, such as winter cold, summer heat, etc. If you suffer damage from a spell that employs natural forces (such as the mighty storm created by Hurricane, or the lightning bolt summoned by Fury of Osano-Wo), reduce the amount of damage you suffer by 1k1.",
	},

	"Chosen By The Oracles": {
		"type": "Spiritual",
		"cost": 6,
		"discount": "",
		"text": "For reasons beyond your understanding, you have caught the notice of one of the Oracles, humans suffused with the divine power of the Elemental Dragons. You must select one Ring when you take this Advantage. You gain a bonus of +1k1 to the total of all Ring Rolls using that Ring.",
		"player_input": true,
		"player_input_text": "Ring: ",
	},

	"Clear Thinker": {
		"type": "Mental",
		"cost": 3,
		"discount": "clan_Dragon",
		"text": "You possess a sharp mind and keen powers of perception, making it very difficult for others to deceive you. Whenever you make a Contested Roll against someone who is attempting to confuse or manipulate you in any way, you gain a bonus of +1k0 to the total of your roll.",
	},

	"Crab Hands": {
		"type": "Physical",
		"cost": 3,
		"discount": "clan_Crab, class_Bushi",
		"text": "You possess a natural affinity for weapons of all kinds, and can take up even an unfamiliar blade without difficulty in times of stress. Any time that you would be forced to make an Unskilled Roll when using a Weapon Skill, you are instead considered to have 1 rank in that Weapon Skill.",
	},

	"Craft": {
		"type": "Mental",
		"cost": 3,
		"discount": "clan_Scorpion, clan_Spider, class_Ninja",
		"text": "You have a knack for instinctively knowing how to do things that most people prefer to avoid at all costs. Whenever you are in a situation where you would be forced to make an Unskilled Roll using a Low Skill, you are considered to have 1 rank in the Skill instead.",
	},

	"Dangerous Beauty": {
		"type": "Physical",
		"cost": 3,
		"discount": "clan_Scorpion",
		"text": "You possess a certain quality that makes you all but irresistible to members of the opposite sex, and they succumb easily to your manipulations. You gain a bonus of +1k0 to the total of all Temptation Skill Rolls made with members of the opposite sex.",
	},

	"Daredevil": {
		"type": "Mental",
		"cost": 3,
		"discount": "clan_Mantis",
		"text": "You have a natural flair for athleticism and a complete lack of self-preservation when it comes to physical danger. Whenever you spend a Void Point to enhance an Athletics Skill Roll, you gain a bonus of +3k1 to the total of the roll instead of the normal +1k1.",
	},

	"Dark Paragon": {
		"type": "Mental",
		"cost": 5,
		"discount": "clan_Spider",
		"text": "You have mastered one of the precepts of Shourido, the dark code that forms an antithesis of Bushido. Once per session, you may voluntarily sacrifice 5 points of Honor as a Free Action in order to affact a particular type of roll as indicated below, and gain a ponus of +5 to the total of that roll. If you do not have 5 points of Honor to spend in this manner, you may spend a Void Point instead.",
		"player_selection": [
			"Control: Re-roll any Social Skill Roll.",
			"Determination: Negate all TN/Wound penalties on One Skill or Spell Casting roll (no +5 bonus is applied to the roll).",
			"Insight: Re-roll any roll that used the Awareness Trait.",
			"Knowledge: Re-roll any roll that used the Intelligence Trait.",
			"Perfection: Spending the Honor causes any one die of your choice on a Skill Roll to explode (no +5 bonus added).",
			"Strength: Re-roll any Damage Roll.",
			"Will: Spending the Honor negates 10 Wounds at the moment they are suffered."
		]
	},

	"Darling of the Court": {
		"type": "Social",
		"cost": 2,
		"discount": "class_Courtier",
		"text": "During a recent court session, you did something that gained the notice of the host, resulting in an instant increase in your importance with all those in attendance. Select one court, such as the court of Kyuden Bayushi, the court of the Okura District in Toshi Rambo, etc. WHen in attendance at this court, your Status is effectively one rank higher, but only while court is in session.",
		"player_input": true,
		"player_input_text": "Court: ",
		"allow_multiple": true,
		"added_effect": true // Can potentially toggle on and off to increase Status while toggled on (i.e. "in court").
	},

	"Different School": {
		"type": "Social",
		"cost": 5,
		"discount": "",
		"text": "Your family sacrificed considerable resources and favors in order to sponsor your entrance into the School of another Clan. When creating your character, you may select a School of a different Clan to attend. You are still a member of your own Clan, however, creating a potential conflict between your loayalty to tyour sensei and your loyalty to your lord and family.",
		"added_effect": true, // Allow schools from any clan on school selection (instead of button?)
	},

	"Elemental Blessing": {
		"type": "Spiritual",
		"cost": 4,
		"discount": "clan_Phoenix",
		"text": "You are much beloved by the kami of a particular element, although you know not why that might be. As a result, the cost of increasing the Traits associated with one particular Ring, chosen when this Advantage is purchased, is decreased by 1. For example, if you choose Earth when you purchase this Advantage, the cost of increasing Stamina and Willpower is reduced by 1 Experience Point every time you increase them. Void may not be chosen for this Advantage.",
		"added_effect": true, // Modify Trait Increase cost IMPORTANT
	},

	"Enlightened": {
		"type": "Spiritual",
		"cost": 6,
		"discount": "clan_Dragon, class_Monk",
		"text": "Your spiritual journey toward complete harmony with the universe as a whole has begun to reach its destination. In addition to whatever storyline effects your GM may choose to bestow upon you, you also find it easier to enhance your connection to the Void. When you are using Experience Points to increase your Void Ring, the total cost is decreased by 2 points each time.",
		"added_effect": true, // Modify Trait Increase cost for Void IMPORTANT
	},

	"Fame": {
		"type": "Social",
		"cost": 3,
		"discount": "",
		"text": "As a result of your actions, there are many in the Empire who know your name. You gain +1 Glory Rank.",
		"added_effect": true // Increase Glory by 1
	},

	"Forbidden Knowledge": {
		"type": "Mental",
		"cost": 5,
		"discount": "",
		"text": "PLACEHOLDER TEXT",
		"added_effect": true // Unique added effect for each specific knowledge. May need to be adapted later. Will require custom skill input
	},

	"Friendly Kami": {
		"type": "Spiritual",
		"cost": 5,
		"discount": "",
		"restrict": "class_Shugenja",
		"text": "A particular kami has befriended you, and stays in your vicinity at all times. Choose one element when this Advantage is purchased. You gain a bonus of +1k1 to the total of all Spell Casting Rolls made to cast Sense, Commune, or Summon with regard to that Element only. You may not select this Advantage for an Element in which you are Deficient.",		
	},

	"Friend of the Brotherhood": {
		"type": "Spiritual",
		"cost": 5,
		"discount": "Dragon",
		"restrict": "class_Monk, class_Shugenja, -school_Brotherhood",
		"text": "You have studied among your allies at the Brotherhood of Shinsei, and as a result you understand your place in the universe slightly better than most. You may purchase Kiho as though you are a Monk of the Brotherhood of Shinsei, instead of payin a higher cost. You must still meet all other normal restrictions on learning Kiho.",
	},

	"Friend of the Elements": {
		"type": "Spiritual",
		"cost": 4,
		"discount": "class_Shugenja",
		"text": "The spirits of a certain Element swirl about you at all times, lending their aid whn possible even though you are likel unaware of their presence. Choose a Ring when this Advantage is purchased. Whenever you make a Trait Roll with either Trait associated with that Ring, you gain a Free Raise.",
	},

	"Gaijin Gear": {
		"type": "Material",
		"cost": 5,
		"discount": "clan_Mantis, clan_Unicorn",
		"text": "You possess a single piece of equipment that is gaijin in origin, constructed somewhere beyond the boundaries of the Emerald Empire. It may be a weapon from one of the many warrior cultures around Rokugan, such as the Senpet Empire, the overseas kingdoms of Merenae and Thrane, the barbarian Yobanjin tribes to the north, or even the distant Yodotai Empire far to the northwest. In this case simply establish a comparable weapon from Rokugan and use its mechanics, but the item will require its own unique Weapon Skill to utilize it. Non-weapon options include such bizarre objects as compasses, spyglasses, magnifying glasses, scissors, etc.",
	},

	"Gentry": {
		"type": "Material",
		"cost": [8, 15, 18, 20, 25, 30],
		"discount": "skill_Blissful Betrothal_2"
	}

}