/** @format */

const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const enteredValue = prompt("Maximum life you and the monster . '100'");

let chosenMaxLife = parseInt(enteredValue);
let hasBonusLife = true;
let currentmonsterHealth = chosenMaxLife;
let currentplayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function rest() {
	currentmonsterHealth = chosenMaxLife;
	currentplayerHealth = chosenMaxLife;
	resetGame(chosenMaxLife);
}

function endRound() {
	const intitalPlayerHealth = currentplayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentplayerHealth -= playerDamage;

	if (currentmonsterHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();

		currentmonsterHealth = intitalPlayerHealth;
		setPlayerHealth(intitalPlayerHealth);
		alert("you would be dead but the bonus life saved you");
	}
	if (currentmonsterHealth <= 0 && currentplayerHealth > 0) {
		alert("You won!");
	} else if (currentplayerHealth <= 0 && currentmonsterHealth > 0) {
		alert("You lost...");
	} else if (currentplayerHealth <= 0 && currentmonsterHealth <= 0) {
		alert("You have a drow!");
	}

	if (currentmonsterHealth <= 0 || currentplayerHealth <= 0) {
		rest();
	}
}

function attackMonster(mode) {
	let maxDamage;
	if (mode === "ATTACK") {
		maxDamage = ATTACK_VALUE;
	} else if (mode === "STRONG_ATTACK") {
		maxDamage = STRONG_ATTACK_VALUE;
	}

	const damage = dealMonsterDamage(maxDamage);
	currentmonsterHealth -= damage;
	endRound();
}

function attackHandler() {
	attackMonster("ATTACK");
}

function strongAttackHandler() {
	attackMonster("STRONG_ATTACK");
}

function healPlayerHandler() {
	let healValue;
	if (currentplayerHealth >= chosenMaxLife - HEAL_VALUE) {
		alert(`You can't heal to more than your max intial health`);
		healValue = chosenMaxLife - currentplayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}

	increasePlayerHealth(HEAL_VALUE);
	currentplayerHealth += HEAL_VALUE;
	endRound();
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
