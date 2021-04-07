/** @format */

const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 20;
const MONSTER_ATTACK_VALUE = 25;
const HEAL_VALUE = 20;
const MIN_HEALTH_VALUE = 100;
const MAX_HEALTH_VALUE = 500;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

// let enteredValue;

// do {
// 	enteredValue = prompt(
// 		"Maximum life for you and the monster. Must be lower than 500",
// 		MIN_HEALTH_VALUE,
// 	);
// } while (
// 	enteredValue < MIN_HEALTH_VALUE ||
// 	enteredValue > MAX_HEALTH_VALUE ||
// 	isNaN(enteredValue)
// );

function getMaxLifeValue() {
	const enteredValue = prompt(
		"Maximum life for you and the monster. Must be lower than 500",
	);

	const parsedValue = parseInt(enteredValue);
	if (isNaN(parsedValue) || parsedValue <= 0) {
		throw { Message: "Invalid user input , not number" };
	}
	return parsedValue;
}

let chosenMaxLife;

try {
	chosenMaxLife = getMaxLifeValue();
} catch (error) {
	chosenMaxLife = 100;
	console.log(error);
	alert("You entered something wrong , default value of 100 was used");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let hasFullLifeBonus = true;
let battleLog = [];
adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
	let logEntry = {
		event: event,
		value: value,
		finalMonsterHealth: monsterHealth,
		finalPlayerHealth: playerHealth,
	};

	switch (event) {
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.target = "MONSTER";
			break;
		case LOG_EVENT_PLAYER_STRONG_ATTACK:
			logEntry.target = "MONSTER";
			break;
		case LOG_EVENT_MONSTER_ATTACK:
			logEntry.target === "PLAYER";
			break;
		case LOG_EVENT_PLAYER_HEAL:
			logEntry.target === "PLAYER";
	}

	battleLog.push(logEntry);

	// if (event === LOG_EVENT_PLAYER_ATTACK) {
	// 	logEntry.target = "MONSTER";
	// } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
	// 	logEntry.target = "MONSTER";
	// } else if (event === LOG_EVENT_MONSTER_ATTACK) {
	// 	logEntry.target === "PLAYER";
	// } else if (event === LOG_EVENT_PLAYER_HEAL) {
	// 	logEntry.target === "PLAYER";
	// }
}

function endRound() {
	const initialPlayerHealth = currentPlayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;

	writeToLog(
		LOG_EVENT_MONSTER_ATTACK,
		playerDamage,
		currentMonsterHealth,
		currentPlayerHealth,
	);

	// Block last attack bonus
	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		bonusLifeEl.style.display = "none";
		increasePlayerHealth(initialPlayerHealth);
		currentPlayerHealth = initialPlayerHealth;
		alert("You would be dead but the bonus life saved you!");
	}

	// Big Bonus under possibility
	if (currentPlayerHealth <= 0 && hasFullLifeBonus && !hasBonusLife) {
		let possibility = Math.floor(Math.random() * 2) + 1;
		if (possibility === 1) {
			bonusLifeEl.innerHTML = "Extra Life!";
			bonusLifeEl.style.display = "inline";
			hasFullLifeBonus = false;
			increasePlayerHealth(chosenMaxLife);
			currentPlayerHealth = chosenMaxLife;
		}
	}

	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert("You won!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"PLAYER WON",
			currentMonsterHealth,
			currentPlayerHealth,
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert("You lost...");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"MONSTER WON",
			currentMonsterHealth,
			currentPlayerHealth,
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
		alert("You have a draw!");
	}

	if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
		reset();
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"A DRAW",
			currentMonsterHealth,
			currentPlayerHealth,
		);
	}
}

function attackMonster(mode) {
	// let maxDamage;
	// let logEvent;
	// if (mode === MODE_ATTACK) {
	// 	maxDamage = ATTACK_VALUE;
	// 	logEvent = LOG_EVENT_PLAYER_ATTACK;
	// } else if (mode === MODE_STRONG_ATTACK) {
	// 	maxDamage = STRONG_ATTACK_VALUE;
	// 	logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
	// }

	let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
	let logEvent =
		mode === MODE_ATTACK
			? LOG_EVENT_PLAYER_ATTACK
			: LOG_EVENT_PLAYER_STRONG_ATTACK;

	const damage = dealMonsterDamage(maxDamage);
	currentMonsterHealth -= damage;
	writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
	endRound();
}

function attackHandler() {
	attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
	attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
	let healValue;
	if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
		healValue = chosenMaxLife - currentPlayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth,
	);
	endRound();
}

function printLogHandler() {
	for (const obj of battleLog) {
		for (const key in obj) {
			console.log(obj[key]);
		}
		// console.log(obj)
	}
}

function reset() {
	resetGame(chosenMaxLife);
	bonusLifeEl.style.display = "inline";
	bonusLifeEl.innerHTML = "1";
	currentPlayerHealth = currentMonsterHealth = chosenMaxLife;
	hasBonusLife = hasFullLifeBonus = true;
}

// EventListener
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
