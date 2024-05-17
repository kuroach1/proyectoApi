const scoreElement = document.getElementById('score'); // Elemento en el HTML donde se mostrará la puntuación
const questionElement = document.getElementById('question'); // Elemento en el HTML donde se mostrará la pregunta
const optionsElement = document.getElementById('options'); // Elemento en el HTML donde se mostrarán las opciones de respuesta

let score = 0; // Inicialización del puntaje
let totalQuestions = 10; // Número total de preguntas

async function loadQuestion() {
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    const data = await response.json();
    const characters = data.results;
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    // Selecciona una propiedad aleatoria del personaje para la pregunta
    const properties = [
        { question: `¿Cuál es la especie de ${randomCharacter.name}?`, answer: randomCharacter.species },
        { question: `¿Cuál es el género de ${randomCharacter.name}?`, answer: randomCharacter.gender },
        { question: `¿Cuál es el estado de vida de ${randomCharacter.name}?`, answer: randomCharacter.status },
        { question: `¿Cuál es el origen de ${randomCharacter.name}?`, answer: randomCharacter.origin.name }
    ];
    const randomProperty = properties[Math.floor(Math.random() * properties.length)];

    const question = randomProperty.question;
    const correctAnswer = randomProperty.answer;

    const options = [];
    while (options.length < 3) {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        const option = randomCharacter[randomProperty.answer.toLowerCase()];
        if (option && option !== correctAnswer && !options.includes(option)) {
            options.push(option);
        }
    }
    options.push(correctAnswer);
    options.sort(() => Math.random() - 0.5);

    return { question, options, correctAnswer };
}

async function renderQuestion() {
    if (totalQuestions === 0) {
        alert(`Fin del juego. Adivinaste ${score} preguntas de 10. Tu puntaje es: ${score}`);
        score = 0;
        scoreElement.innerText = `Puntuación: ${score}`;
        return;
    }

    const { question, options, correctAnswer } = await loadQuestion();

    questionElement.textContent = question;
    optionsElement.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => {
            if (option === correctAnswer) {
                alert('¡Respuesta correcta!');
                score++;
            } else {
                alert(`Respuesta incorrecta. La respuesta correcta es: ${correctAnswer}`);
            }
            totalQuestions--;
            scoreElement.innerText = `Puntuación: ${score}`;
            renderQuestion();
        });
        optionsElement.appendChild(button);
    });
}

renderQuestion();


