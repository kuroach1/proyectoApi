const scoreElement = document.getElementById('score'); // Elemento en el HTML donde se mostrará la puntuación
const questionElement = document.getElementById('question'); // Elemento en el HTML donde se mostrará la pregunta
const optionsElement = document.getElementById('options'); // Elemento en el HTML donde se mostrarán las opciones de respuesta

let score = 0; // Inicialización del puntaje
let totalQuestions = 10; // Número total de preguntas

async function loadQuestion() {
    // Realiza una solicitud a la API de Rick and Morty para obtener información de personajes
    const response = await fetch('https://rickandmortyapi.com/api/character/');
    // Convierte la respuesta en formato JSON
    const data = await response.json();
    // Extrae la lista de personajes
    const characters = data.results;
    // Selecciona un personaje aleatorio de la lista
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    // Construye la pregunta utilizando el nombre del personaje seleccionado
    const question = `¿Cuál es el nombre del personaje ${randomCharacter.name}?`;
    const correctAnswer = randomCharacter.name; // Guarda el nombre correcto del personaje

    const options = [];
    // Llena las opciones de respuesta con nombres de personajes distintos al seleccionado, para evitar respuestas obvias
    while (options.length < 3) {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        if (!options.includes(randomCharacter.name)) {
            options.push(randomCharacter.name);
        }
    }
    options.push(correctAnswer); // Agrega la respuesta correcta a las opciones
    options.sort(() => Math.random() - 0.5); // Mezcla las opciones de respuesta

    return { question, options, correctAnswer }; // Devuelve la pregunta y sus detalles
}

async function renderQuestion() {
    if (totalQuestions === 0) { // Verifica si se han mostrado todas las preguntas
        alert(`Fin del juego. Adivinaste ${score} preguntas de 10. Tu puntaje es: ${score}`);
        score = 0; // Reinicia el puntaje a cero
        scoreElement.innerText = `Puntuación: ${score}`; // Actualiza el elemento de puntuación en la interfaz
        return;
    }

    const { question, options, correctAnswer } = await loadQuestion(); // Carga una nueva pregunta

    questionElement.textContent = question; // Muestra la pregunta en la interfaz
    optionsElement.innerHTML = ''; // Limpia las opciones anteriores

    options.forEach(option => {
        const button = document.createElement('button'); // Crea un botón para cada opción de respuesta
        button.innerText = option; // Establece el texto del botón como la opción de respuesta
        button.addEventListener('click', () => { // Agrega un evento de clic al botón
            if (option === correctAnswer) { // Verifica si la opción seleccionada es la respuesta correcta
                alert('¡Respuesta correcta!'); // Muestra una alerta de respuesta correcta
                score++; // Incrementa el puntaje
            } else {
                alert(`Respuesta incorrecta. La respuesta correcta es: ${correctAnswer}`); // Muestra una alerta de respuesta incorrecta
            }
            totalQuestions--; // Reduce el número de preguntas restantes
            scoreElement.innerText = `Puntuación: ${score}`; // Actualiza el elemento de puntuación en la interfaz
            renderQuestion(); // Muestra la siguiente pregunta
        });
        optionsElement.appendChild(button); // Agrega el botón de opción a la interfaz
    });
}

renderQuestion(); // Inicia el juego mostrando la primera pregunta

