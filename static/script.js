// Variables a usar
let usuario_nuevo = {};
let recomendaciones = [];

const send_button = document.getElementById('boton-resultados');
const nombre_texto = document.getElementById('nombre-input');
const genero_dropdown_1 = document.getElementById('genero-select-1');
const genero_dropdown_2 = document.getElementById('genero-select-2');

let div_visible = false;
const division_recomendaciones = document.getElementById('div-resultados');
const titulos_recomendados_texto = document.getElementById('titulos-recomendados')

//Funciones
function usuario_valores_actualiza(){

    usuario_nuevo = {
        nombre_usuario: nombre_texto.value,
        genero_usuario_1: genero_dropdown_1.value,
        genero_usuario_2: genero_dropdown_2.value
    }


}


//Servidor
const LOCALHOST = "http://127.0.0.1:5000";

// Post method function
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

//Traer los usuarios de la db
async function bringUser(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData
}

//Funciones de python
// Obtener los datos de una funcion en app.py
async function getFromDB(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
  });
  const jsonData = await response.json();
  return jsonData
}

async function recibirRecomendaciones() {
const recibeRecomendacion = getFromDB("http://127.0.0.1:5000/recommend")
    recibeRecomendacion.then((response) => {

        recomendaciones = response.msg;
        console.log(response);
        console.log(recomendaciones);

        if (recomendaciones != undefined){
            titulos_recomendados_texto.innerHTML = "";

            for (let j = 0; j < 3; j++) {
                if (recomendaciones[0][j] != undefined){
                    titulos_recomendados_texto.innerHTML += `<li> ${recomendaciones[0][j]} </li>`
                }
                if (recomendaciones[1][j] != undefined){
                    titulos_recomendados_texto.innerHTML += `<li> ${recomendaciones[1][j]} </li>`
                }
            };
        }

        if (!div_visible){
            div_visible = true;
            division_recomendaciones.setAttribute('style', 'display: block;');
        }
    })
}

async function actualizaUsuario() {
    usuario_valores_actualiza();

    let value = usuario_nuevo;
    console.log(value);
    
    await postData(LOCALHOST + "/nuevo_usuario", { answer: value }).then((raw) => 
          (raw.response.answer)
      ).then((response) => { 
        console.log("Usuario guardado: " + response);
        recibirRecomendaciones()
     });
}

send_button.addEventListener("click", actualizaUsuario);