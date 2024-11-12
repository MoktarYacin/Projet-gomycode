// Tableau contenant les cartes, chaque carte a un nom et une image associée.
const cards = [
    { name: 'A', img: 'A.png' },
    { name: 'A', img: 'A.png' },
    { name: 'B', img: 'B.png' },
    { name: 'B', img: 'B.png' },
    { name: 'C', img: 'C.png' },
    { name: 'C', img: 'C.png' },
    { name: 'D', img: 'D.png' },
    { name: 'D', img: 'D.png' },
    { name: 'E', img: 'E.png' },
    { name: 'E', img: 'E.png' },
    { name: 'F', img: 'F.png' },
    { name: 'F', img: 'F.png' },
    { name: 'G', img: 'G.png' },
    { name: 'G', img: 'G.png' },
    { name: 'H', img: 'H.png' },
    { name: 'H', img: 'H.png' },
];

// Variables pour gérer l'état du jeu
let movements = 0; // Compteur de mouvements effectués
let timer; // Variable pour le chronomètre
let timeElapsed = 0; // Temps écoulé
let isTimerRunning = false; // Indicateur pour savoir si le chronomètre est en cours
let cardsFlipped = 0; // Compteur pour le nombre de cartes retournées
let card1, card2; // Référence aux deux cartes retournées lors d'une interaction
let lockBoard = false; // Verrouillage du tableau pour éviter des actions pendant l'animation

// Lorsque le DOM est chargé, on initialise le jeu
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board'); // Plateau de jeu
    const scoreDisplay = document.getElementById('score'); // Affichage du score
    const timerDisplay = document.getElementById('timer'); // Affichage du temps écoulé
    const restartButton = document.getElementById('restart'); // Bouton de redémarrage
    const congratulationsMessage = document.getElementById('congratulations'); // Message de félicitations
    const newGameButton = document.getElementById('new-game'); // Bouton pour démarrer une nouvelle partie

    // Fonction pour mélanger les cartes de manière aléatoire
    function shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]; // Échange des cartes
        }
        return cards;
    }

    // Fonction pour créer le plateau de jeu
    function createBoard() {
        const shuffledCards = shuffle(cards); // Mélange des cartes
        shuffledCards.forEach(card => {
            // Création d'un élément de carte et ajout d'une image cachée
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = card.name; // Ajout du nom de la carte en tant qu'attribut data
            cardElement.innerHTML = `<img src="${card.img}" alt="${card.name}" style="width: 100%; height: 100%; visibility: hidden;">`;
            cardElement.addEventListener('click', flipCard); // Ajout de l'événement de clic pour retourner la carte
            board.appendChild(cardElement); // Ajout de la carte au plateau
        });
    }

    // Fonction pour démarrer le chronomètre
    function startTimer() {
        isTimerRunning = true;
        timer = setInterval(() => {
            timeElapsed++; // Incrémenter le temps écoulé
            timerDisplay.textContent = `Temps: ${timeElapsed}s`; // Mettre à jour l'affichage du temps
        }, 1000);
    }

    // Fonction pour arrêter le chronomètre
    function stopTimer() {
        clearInterval(timer); // Arrêter l'intervalle du chronomètre
        isTimerRunning = false;
    }

    // Fonction pour retourner une carte
    function flipCard() {
        if (lockBoard || this === card1) return; // Si le tableau est verrouillé ou si la carte est déjà retournée, ne rien faire

        if (!isTimerRunning) startTimer(); // Démarrer le chronomètre au premier mouvement

        const card = this;
        card.querySelector('img').style.visibility = 'visible'; // Afficher l'image de la carte retournée

        if (!card1) {
            card1 = card; // Si aucune carte n'est retournée, c'est la première carte
            return;
        }

        card2 = card; // La deuxième carte
        movements++; // Incrémenter le nombre de mouvements
        scoreDisplay.textContent = `Mouvements: ${movements}`; // Mettre à jour le score
        lockBoard = true; // Verrouiller le plateau pour éviter des actions simultanées

        checkForMatch(); // Vérifier si les deux cartes retournées sont identiques
    }

    // Fonction pour vérifier si les deux cartes retournées sont identiques
    function checkForMatch() {
        if (card1.dataset.name === card2.dataset.name) {
            // Si les cartes sont identiques
            cardsFlipped += 2; // Incrémenter le nombre de cartes retournées
            resetBoard(); // Réinitialiser l'état du tableau

            if (cardsFlipped === cards.length) {
                stopTimer(); // Arrêter le chronomètre une fois que toutes les cartes sont trouvées
                showCongratulations(); // Afficher le message de félicitations
            }
        } else {
            // Si les cartes ne sont pas identiques, les cacher après un délai
            setTimeout(() => {
                card1.querySelector('img').style.visibility = 'hidden';
                card2.querySelector('img').style.visibility = 'hidden';
                resetBoard(); // Réinitialiser l'état du tableau
            }, 1000);
        }
    }

    // Fonction pour réinitialiser l'état du tableau après une vérification de correspondance
    function resetBoard() {
        [card1, card2, lockBoard] = [null, null, false]; // Réinitialiser les cartes et le verrouillage du tableau
    }

    // Fonction pour afficher le message de félicitations
    function showCongratulations() {
        let memoryLevelMessage = '';

        // Déterminer le niveau de mémoire en fonction du temps écoulé
        if (timeElapsed <= 30) {
            memoryLevelMessage = 'Votre niveau de mémoire est excellent !';
        } else if (timeElapsed <= 45) {
            memoryLevelMessage = 'Votre niveau de mémoire est moyen.';
        } else {
            memoryLevelMessage = 'Vous pouvez faire mieux !';
        }

        // Affichage du message de félicitations
        congratulationsMessage.textContent = `Félicitations ! Vous avez gagné en ${timeElapsed} secondes avec ${movements} mouvements. ${memoryLevelMessage}`;
        congratulationsMessage.classList.remove('hidden'); // Afficher le message
        restartButton.style.display = 'none'; // Masquer le bouton "Recommencer"
        newGameButton.style.display = 'block'; // Afficher le bouton "Nouvelle Partie"
    }

    // Fonction pour démarrer une nouvelle partie
    newGameButton.addEventListener('click', () => {
        movements = 0;
        timeElapsed = 0;
        isTimerRunning = false;
        scoreDisplay.textContent = `Mouvements: ${movements}`;
        timerDisplay.textContent = `Temps: ${timeElapsed}s`;
        congratulationsMessage.classList.add('hidden');
        newGameButton.style.display = 'none'; // Masquer le bouton "Nouvelle Partie"
        board.innerHTML = ''; // Réinitialiser le plateau de jeu
        cardsFlipped = 0;
        card1 = null;
        card2 = null;
        lockBoard = false;
        clearInterval(timer); // Réinitialiser le chronomètre
        createBoard(); // Créer un nouveau plateau
        startTimer(); // Démarrer le chronomètre pour la nouvelle partie
    });

    // Fonction pour recommencer le jeu
    restartButton.addEventListener('click', () => {
        movements = 0;
        timeElapsed = 0;
        isTimerRunning = false;
        scoreDisplay.textContent = `Mouvements: ${movements}`;
        timerDisplay.textContent = `Temps: ${timeElapsed}s`;
        congratulationsMessage.classList.add('hidden');
        restartButton.style.display = 'none';
        board.innerHTML = ''; // Réinitialiser le plateau
        cardsFlipped = 0;
        card1 = null;
        card2 = null;
        lockBoard = false;
        clearInterval(timer); // Réinitialiser le chronomètre
        createBoard(); // Créer un nouveau plateau
    });

    createBoard(); // Créer le plateau initial
});
