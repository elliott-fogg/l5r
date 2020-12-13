const clan_info = {
	"Crab": {
		"families": {
			"Hida": "Strength",
			"Hiruma": "Agility",
			"Kaiu": "Intelligence",
			"Kuni": "Intelligence",
			"Toritaka": "Perception",
			"Yasuki": "Awareness"
		},
		"schools": {
			"Hida Bushi School": {
				"class": "Bushi",
				"attribute": "Stamina",
				"skills": ["Athletics", "Defense", "Heavy Weapons_(Tetsubo)", "Intimidation", "Kenjutsu", "Lore: Shadowlands"],
				"skill_choices": ["Bugei"],
				"honor": 3.5,
				"money": "3koku",
				"outfit": [["light_armor", "heavy_armor"], "sturdy_clothing", "daisho", ["choice_heavy_weapon", "choice_polearm"], "traveling_pack"],
				"techniques": [
					{
						"rank": 1,
						"name": "The Way Of The Crab",
						"text": "The Hida Bushi is the epitome of 'heavy infantry', able to endure harsh blows and deliver crushing attacks in return. You may ignore TN penalties for wearing heavy armor for all skills except Stealth. When using a Heavy Weapon, you gain a bonus of +1k0 to the total of all damage rolls."
					},
					{
						"rank": 2,
						"name": "The Mountain Does Not Move",
						"text": "The Hida bushi is famous for extraordinary tenacity, weathering wounds that would kill normal men. You gain Reduction equal to your Earth Ring."
					},
					{
						"rank": 3,
						"name": "Two Pincers, One Mind",
						"text": "A Hida bushi is relentless. You may make attacks as a Simple Action instead of a Complex Action while using Heavy Weapons or weapons with the Samurai keyword."
					},
					{
						"rank": 4,
						"name": "Devastating Blow",
						"text": "A Hida stops at nothing to destroy his enemies once his anger is aroused. Once per encounter, when wielding a Heavy Weapon you may make a calculated strike against the enemy. Lower the enemy's Reduction by 4 for this attack. If this attack succeeds, you Daze the target. The target may recover from this Conditional Effect by making a successful Earth Ring Roll versus a TN equal to your damage roll during the Reaction Stage of each Round. The TN decreases by 5 each time the target fails the roll."
					},
					{
						"rank": 5,
						"name": "The Mountain Does Not Fall",
						"text": "Nothing can stop a Hida warrior from fulfilling his duty, not even the threat of death. You may spend a Void Point during the Reactions Stage. During your next Turn, you may take actions as if you were in the Healthy Wound Rank. You ignore the Dazed, Fatigued, and Stunned Conditional Effects. The benefits of this Technique last until the next Reactions Stage."
					}
				]
			},

			"Kuni Shugenja School": {
				"class": "Shugenja",
				"attribute": "Willpower",
				"skills": ["Calligraphy_(Cipher)", "Defense", "Lore: Shadowlands_2", "Lore: Theology", "Spellcraft"],
				"skill_choices": ["Weapons"],
				"honor": 2.5,
				"money": "3koku",
				"outfit": ["robes", "Wakizashi", "choice_knife", "scroll_satchel", "traveling_pack"],
				"affinity": "Earth",
				"deficiency": "Air",
				"spells": ["Sense", "Commune", "Summon", "choice_Earth_3", "choice_Fire_2", "choice_Water_1"],
				"techniques": [
					{
						"rank": 1,
						"name": "Gaze Into Shadow",
						"text": "The Kuni have carefully studied many of the most sinister opponents imaginable, and have learned how to combat them. You gain a bonus of +1k0 to the total of all Spell Casting Rolls when the target is any non-human creature, and any spell that inflicts damage inflicts an additional +1k1 damage when used against a target who possesses the Shadowlands Taint. You also gain a Free Raise on any spell with the Jade keyword."
					}
				]
			},

			"Yasuki Courtier School": {
				"class": "Courtier",
				"attribute": "Perception",
				"skills": ["Commerce_(Appraisal)", "Courtier", "Defense", "Etiquette", "Intimidation", "Sincerity_(Deceit)"],
				"skill_choices": ["Merchant"],
				"honor": 2.5,
				"money": "5koku",
				"outfit": ["traditional_clothing", "Wakizashi", "choice_knife", "calligraphy_set", "traveling_pack"],
				"techniques": [
					{
						"rank": 1,
						"name": "The Way Of The Carp",
						"text": "The Yasuki are masters of commerce and practice it far more openly than other samurai families; they do not consider it to be a breach of etiquette to engage in open commerce. You gain a Free Raise when using the Commerce skill, and you do not lose Honor or Glory for using the Commerce skill even in public. Also, Yasuki are taught from youth to be adept at sizing up their potential customers. When speaking with someone you may make a Contested Roll of your Commerce/Perception against their Etiquette/Awareness to discern some material object or service they want or desire."
					},
					{
						"rank": 2,
						"name": "Do As We Say",
						"text": "The flip side of Yasuki commerce is Yasuki pushiness. The Yasuki are renowned for both their glib tongues and their high-pressure sales tactics, pressuring and deceiving their customers and allies into doing what they want. A number of times per session equal to your School Rank, you may re-roll a failed Sincerity or Intimidation Skill roll. You must keep the results of the second roll."
					},
					{
						"rank": 3,
						"name": "Treasures Of The Carp",
						"text": "Your contacts in the merchant and commercial circles of Rokugan make it possible for you to acquire almost anything you might need to satisfy a customer. You may roll Commerce/Awareness at TN 20 to locate a rare or useful item, subject to GM discretion, for someone else. You may track down higher-quality or rarer items by calling Raises."
					},
					{
						"rank": 4,
						"name": "Wiles Of The Carp",
						"text": "As ruthless merchants, the Yasuki are also skilled at seeing through the deceptions and blandishments of others. Anyone making a Social Skill Roll for the purpose of lying to you or deceiving you has their TN increased by an amount equal to 5 times your School Rank."
					},
					{
						"rank": 5,
						"name": "What Is Yours Is Mine",
						"text": "The ultimate skill of the Yasuki is to influence others by offering them what they want the most. If you know of a material item someone needs, and arrange for them to get it, you gain a bonus of +5k0 to any Contested Social Rolls you make against that person for the next 24 hours."
					},
				]
			},

			"Hiruma Bushi School": {
				"class": "Bushi",
				"attribute": "Willpower",
				"skills": ["Athletics", "Hunting", "Kenjutsu_(Katana)", "Kyujutsu", "Lore: Shadowlands", "Stealth"],
				"skill_choices": ["Any"],
				"honor": 4.5,
				"money": "3koku",
				"outfit": [["ashigaru", "light_armor"], "sturdy_clothing", "Daisho", ["choice_bow+choice_arrow_20", "choice_knife"], "traveling_pack"],
				"techniques": [
					{
						"rank": 1,
						"name": "Torch's Flame Flickers",
						"text": "The Hiruma learns to focus his strikes even while protecting himself, perfecting the penetrating quality of his blow without sacrificing his defense. While you assume the Attack Stance, you gain a bonus of +1k0 to the total of all attack rolls. You are skilled at survival and can make all food, water, and jade rations last twice as long for a number of people equal to your Hunting Skill Rank."
					},
					{
						"rank": 2,
						"name": "Wolf's Little Lesson",
						"text": "Hiruma learn to dash in and out in a single motion. While you assume the Attack Stance, you add 5 to your Armor TN every time you hit with a melee weapon. This bonus may stack a number of times equal to your School Rank and lasts until the end of the current Skirmish."
					},
					{
						"rank": 3,
						"name": "Hummingbird Wings",
						"text": "The Hiruma know how the hummingbird can move in any direction and apply this truism to battle. Once per Round you may activate this Technique when an opponent targets you with an attack. You gain a bonus of double your School Rank to your Amor TN for that attack. This stacks with any other Armor TN bonuses you gain from other means (such as spending a Void Point)."
					},
					{
						"rank": 4,
						"name": "Shark Smells Blood",
						"text": "Against a weakened opponent, a Hiruma is a terrible foe indeed. You may make attacks as a Simple Action instead of a Complex Action when using a weapon with the Samurai keyword."
					},
					{
						"rank": 5,
						"name": "Daylight Wastes No Movement",
						"text": "The Hiruma learns to use no more energy than is precisely needed to kill his opponent. If you deliver more Wounds than necessary to kill your target, you may apply the excess Wounds to the next target you hit. This Technique does not activate two attacks in a row. The carry-over effect does not last beyond the end of the current skirmish."
					},
				]
			}
		}
	},

	"Crane": {
		"families": {
			"Asahina": "Intelligence",
			"Daidoji": "Stamina",
			"Doji": "Awareness",
			"Kakita": "Agility"
		},

		"schools": {
			"Kakita Bushi School": {
				"class": "Bushi",
				"attribute": "Reflexes",
				"skills": ["Etiquette", "Iaijutsu_(Focus)", "Kenjutsu", "Kyujutsu", "Sincerity", "Tea Ceremony"],
				"skill_choices": ["Bugei/High"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Asahina Shugenja School": {
				"class": "Shugenja",
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Etiquette", "Lore: Theology", "Meditation", "Spellcraft"],
				"skill_choices": ["Artisan", "High"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Doji Courtier School": {
				"class": "Courtier",
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Courtier_(Manipulation)", "Etiquette_(Courtesy)", "Perform: Storytelling", "Sincerity", "Tea Ceremony"],
				"skill_choices": ["Artisan/Perform"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Daidoji Iron Warrior": {
				"class": "Bushi",
				"attribute": "Agility",
				"skills": ["Battle", "Defense_2", "Iaijutsu", "Kenjutsu_(Katana)", "Kyujutsu"],
				"skill_choices": ["Any"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		},
	},

	"Dragon": {
		"families": {
			"Kitsuki": "Awareness",
			"Mirumoto": "Agility",
			"Tamori": "Willpower",
			"Togashi": "Reflexes"
		},

		"schools": {
			"Mirumoto Bushi School": {
				"class": "Bushi",
				"attribute": "Stamina",
				"skills": ["Defense", "Iaijutsu", "Kenjutsu_(Katana)", "Lore: Shugenja", "Meditation", "Lore: Theology"],
				"skill_choices": ["Bugei/High"],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Tamori Shugenja School": {
				"class": "Shugenja",
				"attribute": "Stamina",
				"skills": ["Athletics", "Calligraphy_(Cipher)", "Defense", "Divination", "Lore: Theology", "Medicine", "Spellcraft"],
				"skill_choices": [],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Kitsuki Investigator School": {
				"class": "Courtier",
				"attribute": "Perception",
				"skills": ["Courtier", "Etiquette_(Courtesy)", "Investigation_(Interrogation)", "Kenjutsu", "Meditation", "Sincerity"],
				"skill_choices": ["Lore"],
				"honor": 5.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Togashi Tattooed Order": {
				"class": "Monk",
				"attribute": "Void",
				"skills": ["Athletics", "Defense", "Tattooing", "Jiujutsu", "Meditation"],
				"skill_choices": ["Lore", "!Low"],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Lion": {
		"families": {
			"Akodo": "Agility",
			"Ikoma": "Awareness",
			"Kitsu": "Intelligence",
			"Matsu": "Strength"
		},

		"schools": {
			"Akodo Bushi School": {
				"class": "Bushi",
				"attribute": "Perception",
				"skills": ["Battle_(Mass Combat)", "Defense", "Kenjutsu", "Kyujutsu", "Lore: History", "Sincerity"],
				"skill_choices": ["Bugei/High"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Kitsu Shugenja School": {
				"class": "Shugenja",
				"attribute": "Perception",
				"skills": ["Battle", "Calligraphy_(Cipher)", "Etiquette", "Lore: History", "Lore: Theology", "Spellcraft"],
				"skill_choices": ["High/Bugei"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Ikoma Bard School": {
				"class": "Courtier",
				"attribute": "Intelligence",
				"skills": ["Courtier", "Etiquette", "Lore: History_(Lion Clan)", "Perform: Storytelling", "Sincerity_(Honesty)"],
				"skill_choices": ["High", "Bugei"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Matsu Berserker School": {
				"class": "Berserker",
				"attribute": "Strength",
				"skills": ["Battle", "Jiujutsu", "Kenjutsu_(Katana)", "Kyujutsu", "Lore: History"],
				"skill_choices": ["Bugei", "Bugei"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Mantis": {
		"families": {
			"Kitsune": "Awareness",
			"Moshi": "Intelligence",
			"Tsuruchi": "Perception",
			"Yoritomo": "Stamina"
		},

		"schools": {
			"Yoritomo Bushi School": {
				"class": "Bushi",
				"attribute": "Strength",
				"skills": ["Commerce", "Defense", "Jiujutsu_(Improvised Weapons)", "Kenjutsu", "Knives_(Kama)", "Sailing"],
				"skill_choices": ["Any"],
				"honor": 3.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Moshi Shugenja School": {
				"class": "Shugenja",
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Divination", "Lore: Theology", "Meditation", "Spellcraft"],
				"skill_choices": ["High/Bugei", "High/Bugei"],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Yoritomo Courtier School": {
				"class": "Courtier",
				"attribute": "Willpower",
				"skills": ["Commerce_(Appraisal)", "Courtier", "Defense", "Etiquette", "Intimidation_(Control)", "Sincerity"],
				"skill_choices": ["Merchant/Lore"],
				"honor": 2.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Tsuruchi Archer School": {
				"attribute": "Reflexes",
				"skills": ["Athletics", "Defense", "Hunting", "Investigation", "Kyujutsu_(Yumi)_2"],
				"skill_choices": ["Bugei/High"],
				"honor": 3.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Phoenix": {
		"families": {
			"Agasha": "Perception",
			"Asako": "Awareness",
			"Isawa": "Willpower",
			"Shiba": "Perception"
		},

		"schools": {
			"Shiba Bushi School": {
				"attribute": "Agility",
				"skills": ["Defense", "Kenjutsu", "Kyujutsu", "Meditation_(Void Recovery)", "Spears", "Lore: Theology"],
				"skill_choices": ["Bugei/High"],
				"honor": 5.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Isawa Shugenja School": {
				"attribute": "Intelligence",
				"skills": ["Calligraphy_(Cipher)", "Lore: Theology", "Medicine", "Meditation", "Spellcraft"],
				"skill_choices": ["Lore", "High"],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Asako Loremaster School": {
				"attribute": "Intelligence",
				"skills": ["Courtier", "Etiquette_(Courtesy)", "Lore: History", "Lore: Theology_(Fortunes)", "Meditation", "Sincerity"],
				"skill_choices": ["Lore"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Agasha Shugenja School": {
				"attribute": "Intelligence",
				"skills": ["Calligraphy_(Cipher)", "Defense", "Etiquette", "Lore: Theology", "Spellcraft"],
				"skill_choices": ["Craft", "High/Bugei"],
				"honor": 4.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Scorpion": {
		"families": {
			"Bayushi": "Agility",
			"Shosuro": "Awareness",
			"Soshi": "Intelligence",
			"Yogo": "Willpower"
		},

		"schools": {
			"Bayushi Bushi School": {
				"attribute": "Intelligence",
				"skills": ["Courtier_(Manipulation)", "Defense", "Etiquette", "Iaijutsu", "Kenjutsu", "Sincerity"],
				"skill_choices": ["Any"],
				"honor": 2.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Soshi Shugenja School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy_(Cipher)", "Courtier", "Etiquette", "Lore: Theology", "Spellcraft", "Stealth"],
				"skill_choices": ["Any"],
				"honor": 2.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Bayushi Courtier School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Courtier_(Gossip)", "Etiquette", "Investigation", "Sincerity_(Deceit)", "Temptation"],
				"skill_choices": ["High"],
				"honor": 2.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Shosuro Infiltrator School": {
				"attribute": "Reflexes",
				"skills": ["Acting", "Athletics", "Ninjutsu", "Sincerity", "Stealth_(Sneaking)_2"],
				"skill_choices": ["Any"],
				"honor": 1.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Unicorn": {
		"families": {
			"Horiuchi": "Willpower",
			"Ide": "Perception",
			"Iuchi": "Intelligence",
			"Moto": "Agility",
			"Shinjo": "Reflexes",
			"Utaku": "Stamina"
		},

		"schools": {
			"Moto Bushi School": {
				"attribute": "Strength",
				"skills": ["Athletics", "Defense", "Horsemanship", "Hunting", "Kenjutsu_(Scimitar)"],
				"skill_choices": ["Bugei", "Any"],
				"honor": 3.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Iuchi Shugenja School": {
				"attribute": "Perception",
				"skills": ["Battle", "Calligraphy_(Cipher)", "Horsemanship", "Lore: Theology", "Meditation", "Spellcraft"],
				"skill_choices": ["High/Bugei"],
				"honor": 5.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Ide Emissary School": {
				"attribute": "Awareness",
				"skills": ["Calligraphy", "Commerce", "Courtier", "Etiquette_(Conversation)", "Horsemanship", "Sincerity_(Honesty)"],
				"skill_choices": ["High/Perform"],
				"honor": 5.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			},

			"Utaku Battle Maiden": {
				"attribute": "Reflexes",
				"skills": ["Battle", "Defense", "Horsemanship_2", "Kenjutsu", "Sincerity"],
				"skill_choices": ["High/Bugei"],
				"honor": 6.5,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	},

	"Placeholder": {
		"families": {
			"Dummy": "Awareness Reflexes"
		},
		"schools": {

		}
	},

	"No Families": {
		"families": {

		},
		"schools": {
			"Orphaned Dummy School": {
				"attribute": "Reflexes",
				"skills": [],
				"skill_choices": ["Any", "Any", "Any"],
				"honor": 1.0,
				"techniques": [
					{
						"rank": 1,
						"name": "School Technique 1",
						"text": "This is the first School Technique."
					},
					{
						"rank": 2,
						"name": "School Technique 2",
						"text": "This is the second School Technique."
					},
					{
						"rank": 3,
						"name": "School Technique 3",
						"text": "This is the third School Technique."
					},
					{
						"rank": 4,
						"name": "School Technique 4",
						"text": "This is the fourth School Technique."
					},
					{
						"rank": 5,
						"name": "School Technique 5",
						"text": "This is the fifth School Technique."
					}
				]
			}
		}
	}
}

function get_school_info(school_id) {
	var school_info = {};
	let [clan, school] = school_id.split("_");
	Object.assign(school_info, clan_info[clan]["schools"][school]);
	school_info["attribute"] = get_attribute_changes(school_info["attribute"]);

	var starting_skills = {};
	for (let skill_string of school_info["skills"]) {
		starting_skills = Object.assign({}, starting_skills, 
		              extract_skill_info(skill_string));
	}
	school_info["skills"] = starting_skills;

	return school_info;
}

function get_family_traits(family_id) {
	let [clan, family] = family_id.split("_");
	return get_attribute_changes(clan_info[clan]["families"][family]);
}

// Return Information Lists ////////////////////////////////////////////////////

function get_clans() {
	return Object.keys(clan_info);
}

function get_clan_families(chosen_clan=null) {
	if (chosen_clan) {
		if (chosen_clan in clan_info) {
			return Object.keys(clan_info[chosen_clan]["families"]);
		} else {console.log(`Clan '${chosen_clan}' not found.`)}
	}
	
	// No clan specified, return families of all clans
	family_dict = {};
	for (let clan in clan_info) {
		family_dict[clan] = Object.keys(clan_info[clan]["families"])
	}
	return family_dict;
}

function get_clan_schools(chosen_clan=null) {
	if (chosen_clan) {
		var clan_name = chosen_clan.split("_")[0];
		if (clan_name in clan_info) {
			return Object.keys(clan_info[clan_name]["schools"]);
		} else {console.log(`Clan '${clan_name}' not found.`)}
	}

	// No clan specified, return schools of all clans in dict;
	school_dict = {};
	for (let clan in clan_info) {
		school_dict[clan] = Object.keys(clan_info[clan]["schools"]);
	}
	return family_dict;
}
// Translate Storage Formats ///////////////////////////////////////////////////

function get_attribute_changes(attribute_str) {
	var attr_iterator = attribute_str.matchAll(/([a-zA-Z]+(?:_[-\d]+)?)/g);
	var attribute_changes = {};

	for (let group of attr_iterator) {
		var attr_string = group[1];
		var attr_name, attr_change;

		if (attr_string.includes("_")) {
			[attr_name, attr_change] = attr_string.split("_");
		} else {
			attr_name = attr_string;
			attr_change = 1;
		};

		attribute_changes[attr_name] = parseInt(attr_change);
	}
	return attribute_changes;
}

function extract_skill_info(skill_string) {
	
	var skill_match = skill_string.match(/^([a-zA-Z: ]+)_?/);
  	var skill_name = (skill_match !== null) ? skill_match[1] : null;
  
  	var emphases_match = skill_string.match(/\(([\w\s,]+)\)/);
  	var emphases = (emphases_match !== null) ? emphases_match[1].split(",") : [];
  
  	var rank_match = skill_string.match(/_(\d+)$/);
  	var rank = (rank_match !== null) ? parseInt(rank_match[1]) : 1;
  

  	var skill_info = get_skill_info(skill_name);

  	var output = {};
  	output[skill_name] = {
  			"rank": rank,
  			"emphases": emphases,
  			"class": skill_info["class"],
  			"trait": skill_info["trait"]
  	}
  	return output;
}

function skill_display_name(skill_id) {
	var skill_match = skill_id.match(/^([\w\s]+)\[([\w\s]+)\]$/);

	if (skill_match == null) {
		return skill_id;
	} else {
		var skill_type = skill_match[1];
		var skill_name = skill_match[2];

		if (skill_type == "Lore") {
			return `Lore: ${skill_name}`;
		} else {
			return skill_name;
		}
	}
}

// Tests ///////////////////////////////////////////////////////////////////////

function test_starting_skills() {

	update_all_skills();

	for (let clan in clan_info) {
		for (let school in clan_info[clan]["schools"]) {
			let skill_list = clan_info[clan]["schools"][school].skills;
			skill_list.forEach(skill_str => {

				var extracted = extract_skill_info(skill_str);
				var skill_name, skill_info;
				for (skill_name in extracted) {
					skill_info = extracted[skill_name];
				}

				if (!(skill_name in all_skills)) {
					console.log(`ERROR - test_starting_skills: ` + 
					            `Skill '${skill_name}' not found. ` +
					            `Clan: ${clan}, School: ${school}.`)
					return;
				}

				var emphases = skill_info["emphases"];
				emphases.forEach(emphasis => {
					if (!(all_skills[skill_name]["emphases"].includes(emphasis))) {
						console.log(`ERROR - test_starting_skills: ` + 
						        `Emphasis '${emphasis}' for skill `+
						        `'${skill_name}' not found. ` +
						        `Clan: ${clan}, School: ${school}.`)
						return;
					}
				});

				if (!(1 <= skill_info["rank"] <= 10)) {
					console.log(`ERROR - test_starting_skills: ` + 
					            `Invalid rank ${skill_info["rank"]} for skill `+
					            `${skill_name}. Clan: ${clan}, School: ${school}.`)
					return;
	}})}}
	console.log("Completed test_starting_skills");
}

function test_starting_attributes() {
	var trait_names = get_trait_names();

	for (let clan in clan_info) {
		for (let family in clan_info[clan]["families"]) {
			var changes = get_attribute_changes(clan_info[clan]["families"][family]);
			for (let c in changes) {
				if (!(trait_names.includes(c))) {
					console.log(`False Attribute: ${c}, ${family}, ${clan}`);
	}}}}

	for (let clan in clan_info) {
		for (let school in clan_info[clan]["schools"]) {
			var changes = get_attribute_changes(clan_info[clan]["schools"][school]["attribute"]);
			for (let c in changes) {
				if (!(trait_names.includes(c))) {
					console.log(`False Attribute: ${c}, ${school}, ${clan}`);
	}}}}
	console.log("Completed test_starting_attributes")
}