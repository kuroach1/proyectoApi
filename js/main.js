// trae la primera página de personajes al cargar nuestra pagina 
document.addEventListener('DOMContentLoaded', async () => {
    const id = 1; 
    await getPage(id); // Llama a la función para obtener la primera página de personajes
  });
  
  // crea y agrega las opciones automaticamente al select de páginas
  const selectPage = document.getElementById('select');
  for (let i = 1; i < 43; i++) { // Recorre las 42 páginas de personajes
    const option = document.createElement('option'); // Crea un elemento de opción
    option.value = i; // Asigna el valor de la página a la opción
    option.text = i; // Asigna el texto de la página a la opción
    option.className = 'page-link'; // Añade una clase a la opción
    selectPage.appendChild(option); // Agrega la opción al select
  }
  
  // crea y agrega las opciones automáticamente al select de búsqueda por ID
  const selectCharacter = document.getElementById('select_one_character');
  for (let i = 1; i < 827; i++) { // Recorre los IDs de los personajes
    const option = document.createElement('option'); // Crea un elemento de opción
    option.value = i; // Asigna el valor del ID a la opción
    option.text = i; // Asigna el texto del ID a la opción
    option.className = 'page-link'; // Añade una clase a la opción
    selectCharacter.appendChild(option); // Agrega la opción al select
  }
  
  // función asincrónica para traer las páginas que el usuario desee
  selectPage.addEventListener('click', async () => {
    const value = selectPage.value; // Obtiene el valor seleccionado
    const page = value; // Establece la página a obtener
    await getPage(page); // Llama a la función para obtener la página seleccionada
  });
  
  // función asincrónica para traer el personaje que desee
  selectCharacter.addEventListener('click', async () => {
    const value = selectCharacter.value; // Obtiene el valor seleccionado
    const page = value; // Establece el ID del personaje a obtener
    await getOneCharacter(page); // Llama a la función para obtener el personaje seleccionado
  });
  
  // Función para obtener y mostrar una página de personajes
  const getPage = async (id) => {
    const container = document.querySelector('.container'); // Selecciona el contenedor donde se mostrarán los personajes
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${id}`); // Obtiene los datos de la página de la API
      const data = await response.json(); // Convierte la respuesta en formato JSON
  
      let html = ''; // Inicializa una variable para almacenar el HTML de las tarjetas de personajes
  
      data.results.forEach(card => { // Recorre los personajes obtenidos
        // Crea HTML para la tarjeta de cada personaje
        html += `
          <div class="container-card">
            <img src="${card.image}" alt="image of character" class="image">
            <div class="container-text">
              <h3>${card.name}</h3>
              <p>${card.status} - ${card.species}</p>
              <div class="container3">
                <div class="container-info">
                  <p><span>GENDER:</span> ${card.gender}</p>
                  <p><span>ORIGIN:</span> ${card.origin.name}</p>
                  <p><span>LOCATION:</span> <a href="${card.location.url}" target="_blank">${card.location.name}</a></p>
                </div>
              </div>
              <div class="container-type">
                <p>${card.type}</p>
              </div>
            </div>
          </div>
        `;
      });
  
      container.innerHTML = html; // Actualiza el contenido del contenedor con las tarjetas generadas
  
    } catch (err) {
      console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
  };
  
  // Función para obtener y mostrar información de un personaje específico
  const getOneCharacter = async (id) => {
    const container = document.querySelector('.container'); // Selecciona el contenedor donde se mostrará el personaje
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`); // Obtiene los datos del personaje de la API
      const data = await response.json(); // Convierte la respuesta en formato JSON
  
      let html = ''; // Inicializa una variable para almacenar el HTML del personaje
  
      // Crea HTML para la tarjeta del personaje
      html += `
        <div class="container-card">
          <img src="${data.image}" alt="image of character" class="image">
          <div class="container-text">
            <h3>${data.name}</h3>
            <p>${data.status} - ${data.species}</p>
            <div class="container3">
              <div class="container-info">
                <p><span>GENDER:</span> ${data.gender}</p>
                <p><span>ORIGIN:</span> ${data.origin.name}</p>
                <p><span>LOCATION:</span> <a href="${data.location.url}" target="_blank">${data.location.name}</a></p>
              </div>
            </div>
            <div class="container-type">
              <p>${data.type}</p>
            </div>
          </div>
        </div>
      `;
  
      container.innerHTML = html; // Actualiza el contenido del contenedor con la tarjeta generada
  
    } catch (err) {
      console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
  };
  
  // Filtrar personajes por nombre
  const inputFilter = document.querySelector('.filter'); // Selecciona el campo de filtro por nombre
  inputFilter.addEventListener('input', () => {
    const filterValue = inputFilter.value; // Obtiene el valor del campo de filtro
    filterCharactersByName(filterValue); // Llama a la función para filtrar personajes por nombre
  });
  
  // Función para filtrar personajes por nombre
  const filterCharactersByName = async (name) => {
    const container = document.querySelector('.container'); // Selecciona el contenedor donde se mostrarán los personajes
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`); // Obtiene los datos de la API filtrados por nombre
      const data = await response.json(); // Convierte la respuesta en formato JSON
  
      if (data.error) { // Si hay un error en los datos
        container.innerHTML = `<p>No se encontraron personajes con ese nombre.</p>`; // Muestra un mensaje de error en el contenedor
        return;
      }
  
      const characterCards = data.results.map(card => generateCharacterCard(card)).join(''); // Genera HTML para las tarjetas de personajes
      container.innerHTML = characterCards; // Actualiza el contenido del contenedor con las tarjetas generadas
  
    } catch (err) {
      console.error(err); // Maneja cualquier error y lo muestra en la consola
      container.innerHTML = `<p>Error al cargar los personajes.</p>`; // Muestra un mensaje de error en el contenedor
    }
  };
  
  // Función para generar HTML de la tarjeta de un personaje
  const generateCharacterCard = (card) => {
    return `
      <div class="container-card">
        <img src="${card.image}" alt="image of character" class="image">
        <div class="container-text">
          <h3>${card.name}</h3>
          <p>${card.status} - ${card.species}</p>
          <div class="container3">
            <div class="container-info">
              <p><span>GENDER:</span> ${card.gender}</p>
              <p><span>ORIGIN:</span> ${card.origin.name}</p>
              <p><span>LOCATION:</span> <a href="${card.location.url}" target="_blank">${card.location.name}</a></p>
            </div>
          </div>
          <div class="container-type">
            <p>${card.type}</p>
          </div>
        </div>
      </div>
    `;
  };
  