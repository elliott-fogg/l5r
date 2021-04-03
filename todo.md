# To Do

## Current To-Dos
* Skill Selection buttons are not appearing in-line with each other.
* Convert necessary text inputs to textbox inputs in Adv/Disadv
* Add filter to Advantages / Disadvantages to remove invalid / already selected.
* Add in method of computing values for Dis/Advantages from Player class 
(e.g. the bonus of the Blackmailed Disadvantage).
* Create a system that allows for effects (e.g. Ronin, effects that reduce trait
cost, etc.)
* Update Class info to include proper information for Shugenjas
* Add ability to select equipment, potentially entering information manually
* Add ability to select School Skills / Techniques, likely entering manually
* Change colour scheme to match original L5R page

## Next To-Dos (once completed Character Creation Page)
* Create an interactive display for Status, Glory, Honor, etc.
* Remodel Character Page to use DataHandler object instead of /data files, then
 delete all the /data files.

## Save System
* Add in local save system so that the user can save their character in 
LocalStorage. Probably only worth doing once the entire character can be 
created.
* Add system that allows people to save their characters to the server.
* Add in system that allows James to look at everyone's character.
* Add in a more generalised system that allows someone to create an Admin 
account, and other users to hook up to that Admin account so the Admin can view
their characters.

## Notes:
* Disadvantages can only be taken up to a combined 10 experience points worth.
* No starting character may begin play with Trait or Skill above Rank 4.
* Status and Glory both start at 1.0 (excluding Advantages).
* TN to be hit is normally 5 * Reflexes + 5

* Make the current character exist in the localStorage, instead of in a custom
object. This is probably going to be fast enough to work.

---

## General ToDo

* Skill Mastery Abilities
* Have quantities like Insight, Exp Spend, etc. automatically calculated
* Save data to file, load data from file (optional)
* Allow creation of custom skills (build of Macro-skills like Games)
* CSV - Family and School starting attributes
* CSV - Weapon Attributes
* Allow creation of custom weapons/items
* CSV - School Skills
* Integrate school skills into gameplay so they actually do something