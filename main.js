"use strict";

// Tableau contenant les cartes du jeu
const cardsSet = [
	{
		src: "img/img_1.jpg",
		alt: "Image_1",
		dataAttribute: "image_1"
	},
	{
		src: "img/img_2.jpg",
		alt: "Image_2",
		dataAttribute: "image_2"
	},
	{
		src: "img/img_3.jpg",
		alt: "Image_3",
		dataAttribute: "image_3"
	},
	{
		src: "img/img_4.jpg",
		alt: "Image_4",
		dataAttribute: "image_4"
	},
	{
		src: "img/img_5.jpg",
		alt: "Image_5",
		dataAttribute: "image_5"
	},
	{
		src: "img/img_6.jpg",
		alt: "Image_6",
		dataAttribute: "image_6"
	}
];
// Tableau contenant les cartes qui ont été retournées
let flippedCards = [];
// Indicateur de blocage du jeu
let lockGame = false;
// Compteur pour le nombre d'essais
let nbrEssais = 0;

// Déterminer l'ordre des paires de carte à afficher de manière aléatoire
function randomOrder(max) {
	let cardsOrder = [];
	for (let i = 0; i < max; i++) {
		// Génération d'un nombre aléatoire entre 1 et max
		let randomPos = Math.floor(Math.random() * max) + 1;
		//console.log('Random number = '+randomPos);
		if (cardsOrder.indexOf(randomPos) === -1) {
			// On ajoute le nombre aléatoire dans le tableau
			cardsOrder[i] = randomPos;
		}
		else {
			// Sinon on décrémente le i pour récupérer la place
			i--;
		}
	}
	//console.log(cardsOrder);
	// Parcourir le tableau pour retrancher max/2 à toutes les valeurs supérieures à max/2. En fin de boucle, il ne reste que des couples de valeurs de 1 à max/2
	for (let i = 0; i < cardsOrder.length; i++) {
		// Si la valeur est supérieure à max/2 alors, on lui retranche max/2
		if (cardsOrder[i] > (max / 2)) {
			cardsOrder[i] = cardsOrder[i] - (max / 2);
		}
	}
	//console.log(cardsOrder);
	return cardsOrder;
}

// Traitement effectué lors du clic sur une carte
function flipCard() {
	console.log(this);
	// Si le jeu est bloqué, on sort de la fonction
	if (lockGame) {
		return;
	}
	// Ajouter la classe flip sur la carte
	this.classList.add('flip');
	// Ajouter la carte dans le tableau des cartes retournées
	flippedCards.push(this);
	console.log(flippedCards);
	// Si le tableau des cartes retournées contient plus d'une carte
	if (flippedCards.length > 1) {
		// On verouille le jeu, pour ne pas permettre de retourner d'autres cartes tant que la comparaison n'est pas terminée
		lockGame = true;
		// Incrémentation du nombre d'essais
		nbrEssais++;
		// Comparer si les 2 cartes sont de la même famille
		if (flippedCards[0].dataset.group === flippedCards[1].dataset.group) {
			console.log('Les 2 cartes sont les mêmes');
			// Supprimer les écouteurs d'événement
			flippedCards[0].removeEventListener('click', flipCard);
			flippedCards[1].removeEventListener('click', flipCard);
			// Réinitialiser le tableau avec les cartes retournées
			flippedCards = [];
			// Débloquer le jeu
			lockGame = false;
		}
		else {
			console.log('Les 2 cartes sont différentes');
			// Recacher les 2 cartes après 1.5 secondes
			setTimeout(() => {
				flippedCards[0].classList.remove("flip");
				flippedCards[1].classList.remove("flip");
				// Réinitialiser le tableau avec les cartes retournées
				flippedCards = [];
				// Débloquer le jeu
				lockGame = false;
			}, 1500);
		}
		// Afficher le nombre d'essais
		document.querySelector("#score span").textContent = nbrEssais;
	}
	// Compter le nombre de cartes qui ont été retournées au total
	const cartesRetournees = document.querySelectorAll('.flip');
	// Si toutes les cartes ont été retournées, le jeu est terminé
	if (cartesRetournees.length === (cardsSet.length * 2)) {
		setTimeout(() => {
			alert("Félicitations, vous avez terminé");
		}, 3000);
	}
}

// INITIALISATION DU JEU
function gameInit() {
	let game = document.getElementById("game");
	game.innerHTML = '';
	const cardsOrder = randomOrder(cardsSet.length * 2);
	const imax = cardsOrder.length;
	//console.log(imax);
	for (let i = 0; i < imax; i++) {
		const index = cardsOrder[i] - 1;
		//console.log(index);
		//console.log(cardsSet[index]);
		// Création de la div qui va contenir la carte
		let carte = document.createElement("div");
		game.appendChild(carte);
		carte.classList.add("memory-card");
		carte.setAttribute("data-group", cardsSet[index].dataAttribute);
		// Ajout de l'image front
		let imgFront = document.createElement("img");
		imgFront.setAttribute("src", cardsSet[index].src);
		imgFront.setAttribute("alt", cardsSet[index].alt);
		imgFront.setAttribute("height", "300");
		imgFront.setAttribute("width", "200");
		carte.appendChild(imgFront);
		imgFront.classList.add("front-face");
		// Ajout de l'image back
		let imgBack = document.createElement("img");
		imgBack.setAttribute("src", "img/front.jpg");
		imgBack.setAttribute("alt", "Retourner pour voir l'image");
		imgBack.setAttribute("height", "300");
		imgBack.setAttribute("width", "200");
		carte.appendChild(imgBack);
		imgBack.classList.add("back-face");
	}
}

// LE JEU
function gamePlay() {
	// Sélectionner toutes les cartes
	const memoryCards = document.querySelectorAll('.memory-card');
	// Ajout d'un écouteur d'événement sur chaque carte
	memoryCards.forEach(card => card.addEventListener('click', flipCard));
}

// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", function () {
	gameInit();
	gamePlay();
});