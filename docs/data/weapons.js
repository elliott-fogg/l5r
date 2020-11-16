// Bows: The bow adds the minimum of (Bow Strength, Character Strength) to the 
// Damage Roll of the arrows they are using.
// Bows can be fired up to twice the listed range, but suffer a -1k0 penalty to 
// the Attack Roll for each extra 50 feet.
// Bows fired against opponents in Melee range suffer a 10 flat penalty to the 
// Attack Roll.

// Melee and Thrown Weapons Damage Roll has the Character's Strength added to 
// them.

const bows_and_arrows = {
	"Arrows": {
		"Armor Piercing": {dr: "1k1", cost: "2bu", special: "Ignores Armor TN bonus"},
		"Flesh Cutter": {dr: "2k3", cost: "5bu", special: "Doubles Armor TN bonus; Half Range"},
		"Humming Bulb": {dr: "0k1", cost: "5bu", special: "Loud whistling noise"},
		"Rope Cutter": {dr: "1k1", cost: "3bu", special: "2 Free Raises for Called Shots against df objects; Half Range"},
		"Armor Piercing": {dr: "2k2", cost: "1bu"},
	}
	"Bows": {
		"Dai-kyu": {dr: "4k0", keywords: "Large", range: 500, cost: "25koku", requirements: "Strength_3", special: "TN of attack rolls +10 if on foot"},
		"Han-kyu": {dr: "1k0", keywords: "Small", range: 100, cost: "6koku", special: "TN of attack rolls +10 if on horseback"},
		"Yumi": {dr: "3k0", keywords: "Large", range: 250, cost: "20koku", special: "TN of attack rolls +10 if on horseback"},
	},
	"Ninjutsu Weapons": {
		"Blowgun": {dr: "1", keywords: "Medium", cost: "8zeni", range: 50, special: "Triple opponent's Armor TN Bonus. Reloading is free action. Damage increase from Ninjutsu skill."},
		"Shuriken": {dr: "1k1", keywords: "Small", cost: "2bu", range: 25},
		"Tsubute": {dr: "1k1", keywords: "Small", cost: "1bu", range: 30, special: "Do not add Strength. Damage dice don't explode."},
	},
}

const melee_weapons = {
	"Chain Weapons": {
		"Kusarigama": {dr: "0k2", keywords: "Large", cost: "5koku"},
		"Kyoketsu-shogi": {dr: "0k1", keywords: "Large", cost: "9bu", special: "Double opponents Armor TN bonus"},
		"Manrikikusari": {dr: "1k1", keywords: "Large", cost: "3koku"},
	},
	"Heavy Weapons": {
		"Dai Tsuchi": {dr: "5k2", keywords: "Large", cost: "15koku"},
		"Masakari": {dr: "2k3", keywords: "Medium", cost: "8koku"},
		"Ono": {dr: "0k4", keywords: "Large", cost: "20koku"},
		"Tetsubo": {dr: "3k3", keywords: "Large", cost: "20koku"},
	},
	"Knives": {
		"Aiguchi": {dr: "1k1", keywords: "Small", cost: "1koku"},
		"Tanto": {dr: "1k1", keywords: "Small", cost: "1koku"},
		"Jitte": {dr: "1k1", keywords: "Small", cost: "5bu"},
		"Sai": {dr: "1k1", keywords: "Small", cost: "5bu"},
		"Kama": {dr: "0k2", keywords: "Small Peasant", cost: "5bu"},

	},
	"Polearms": {
		"Bisento": {dr: "3k3", keywords: "Large", cost: "12koku"},
		"Nagamaki": {dr: "2k3", keywords: "Large", cost: "8koku"},
		"Naginata": {dr: "3k2", keywords: "Large Samurai", cost: "10koku"},
		"Sasumata": {dr: "0k2", keywords: "Large", cost: "6koku", special: "May be used to initiate and mantain a grapple."},
		"Sodegarami": {dr: "1k1", keywords: "Large", cost: "6koku", special: "May be used to initiate and mantain a grapple."},
	},
	"Spears": {
		"Kumade": {dr: "1k1", keywords: "Large Peasant", cost: "3bu", special: "If it inflicts more than 25 wounds in one attack, it breaks."},
		"Mai Chong": {dr: "0k3", keywords: "Large", cost: "20koku", range: 25},
		"Lance": {dr: "3k4", keywords: "Large", cost: "20koku", special: "If not on Horseback, or not immediately following a Move action, DR=1k2. Shatters if inflicts more than 30 wounds. If not after move action, increase attack TN by +5 on horseback, +10 on foot."},
		"Nage-yari": {dr: "1k2", keywords: "Medium", cost: "3koku", range: 50},
		"Yari": {dr: "2k2", keywords: "Large", cost: "5koku", range: 30, special: "DR=1k2 if thrown"},
	},
	"Staves": {
		"Bo": {dr: "1k2", keywords: "Large", cost: "2bu"},
		"Jo": {dr: "0k2", keywords: "Medium", cost: "1bu"},
		"Machi-kanshisha": {dr: "0k2", keywords: "Medium", cost: "20koku"},
		"Nunchaku": {dr: "1k2", keywords: "Small Peasant", cost: "3bu"},
		"Sang Kauw: Crescent Blade": {dr: "1k2", keywords: "Medium", cost: "10koku"},
		"Sang Kauw: Shield": {dr: "2k1", keywords: "Medium", cost: "10koku"},
		"Tonfa": {dr: "0k3", keywords: "Medium Peasant", cost: "5bu"},
	},
	"Swords": {
		"Katana": {dr: "3k2", keywords: "Medium Samurai", cost: null, special: "Can spend one void point to increase DR by 1k1"},
		"Ninja-to": {dr: "2k2", keywords: "Medium Ninja", cost: "5koku", special: "Considered small weapons for concealment purposes. Breaks if more than 40 wounds."},
		"No-dachi": {dr: "3k3", keywords: "Large", cost: "30koku"},
		"Parapangu": {dr: "2k2", keywords: "Medium Peasant", cost: "10bu", special: "Breaks if inflicts more than 30 wounds."},
		"Scimitar": {dr: "2k3", keywords: "Medium", cost: "20koku"},
		"Wakizashi": {dr: "2k2", keywords: "Medium Samurai", cost: "15koku", range: 20},
	},
	"War Fans": {
		"War Fan": {dr: "0k1", keywords: "Small", cost: "5koku"},
	}
}