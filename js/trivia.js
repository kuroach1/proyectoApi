const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');

let score = 0;
let totalQuestions = 10;

async function loadQuestion() {
    // Realiza una solicitud a la API de Rick and Morty para obtener información de personajes
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    // Convierte la respuesta en formato JSON
    const data = await response.json();
    // Extrae la lista de personajes
    const characters = data.results;
    // Selecciona un personaje aleatorio de la lista
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    // Selecciona un atributo aleatorio del personaje como la pregunta
    const questionAttribute = Object.keys(randomCharacter)[Math.floor(Math.random() * Object.keys(randomCharacter).length)];
    const question = `¿Cuál es el ${questionAttribute.replace('_', ' ')} de ${randomCharacter.name}?`;
    // Guarda el valor del atributo seleccionado como respuesta correcta
    let correctAnswer = randomCharacter[questionAttribute];

    // Si el valor de la respuesta correcta es un objeto, intenta obtener un valor de cadena
    if (typeof correctAnswer !== 'string') {
        correctAnswer = Object.values(correctAnswer).find(value => typeof value === 'string');
    }

    const options = [];
    // Llena las opciones de respuesta con valores distintos al seleccionado, para evitar respuestas obvias
    while (options.length < 3) {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        let randomValue = randomCharacter[Object.keys(randomCharacter)[Math.floor(Math.random() * Object.keys(randomCharacter).length)]];
        // Si el valor seleccionado es un objeto, intenta obtener un valor de cadena
        if (typeof randomValue !== 'string') {
            randomValue = Object.values(randomValue).find(value => typeof value === 'string');
        }
        if (!options.includes(randomValue) && randomValue !== correctAnswer) {
            options.push(randomValue);
        }
    }
    options.push(correctAnswer); // Agrega la respuesta correcta a las opciones
    options.sort(() => Math.random() - 0.5); // Mezcla las opciones de respuesta

    return { question, options, correctAnswer }; // Devuelve la pregunta y sus detalles
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



