//Obtenemos la referencia a los elementos del DOM

const formulario = document.getElementById("formulario");

const seleccionados = document.getElementById("seleccionados");

const delegado = document.getElementById("delegado");
const subdelegado = document.getElementById("subDelegado");
const numVotos = document.getElementById("numVotos");

const guardad = document.getElementById("Guardad");
const elimenar = document.getElementById("Elimenar");

//Este objeto controlará todo

const control = {
  listaVotados: [],
  votosEmitidos: 0,

  aumentaVoto(id) {
    this.listaVotados[id].votos++;
    //this.votosEmitidos++;
    numVotos.textContent = (parseInt(numVotos.textContent) + 1).toString(); // 
},
  insertaVotado(nombre, vt = 0) { 
    this.listaVotados.push({
      nombre: nombre,
      votos: vt, // si vt etsa null o undifinde coge valor 0
    });
    const id = this.listaVotados.length - 1;

    const elementoListaSeleccionados = document.createElement("div");
    elementoListaSeleccionados.innerHTML = `    <p>${nombre}</p>
                           <input type="button" class="boton-modificado" value="${this.listaVotados[id].votos}" id="C${id}" data-counter>`; //cojer el numero de votos disponible

    //añadimos el elemento a la lista de elementosdom
    elementoListaSeleccionados.id = nombre;

    seleccionados.append(elementoListaSeleccionados);

    //Asignamos los eventos a los botones
    document.getElementById(`C${id}`).addEventListener("click", (event) => {
      if (event.target.dataset.counter != undefined) {
        this.aumentaVoto(id);
        event.target.value++;
        this.dameDelegado();
        formulario["nombre"].focus();
      }
    });
  },
  reseteaFormulario() {
    formulario["nombre"].value = "";
    formulario["nombre"].focus();
  },
  dameDelegado() {
    const nombreDelegado = [...this.listaVotados].sort(
      (ele1, ele2) => ele2.votos - ele1.votos
    );
    delegado.textContent = `Delegado: ${nombreDelegado[0].nombre}`;
    const divDelegado = document.getElementById(`${nombreDelegado[0].nombre}`);
    seleccionados.insertAdjacentElement("beforeend", divDelegado);
    if (nombreDelegado.length > 1) {
      subdelegado.textContent = `SubDelegado: ${nombreDelegado[1].nombre}`;
      const divSubDelegado = document.getElementById(
        `${nombreDelegado[1].nombre}`
      );
      divDelegado.insertAdjacentElement("beforebegin", divSubDelegado);
    }
  },
};
//El submit
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  if (formulario["nombre"].value !== "") {
    control.insertaVotado(formulario["nombre"].value);
    control.reseteaFormulario();
  }
});

// guardar la lista votados en local Strorage

guardad.addEventListener("click", (e) => {
  const text = JSON.stringify(control.listaVotados);
  console.log(text)
  localStorage.setItem("lista", text);
});

// limpiar local Strorage

elimenar.addEventListener("click", (e) => {
  localStorage.clear();
});

// imprimir los datos gurdados


if (localStorage.getItem("lista") === null) {
  console.log("nada");
} else {
  // recuperar la lista guardada
  const listaGuardada = JSON.parse(localStorage.getItem("lista"));
  console.log(listaGuardada)


  //imprimir los datos a la pantalla 

  for (let i = 0; i < listaGuardada.length; i++) {

    control.insertaVotado(listaGuardada[i].nombre,listaGuardada[i].votos)
    control.dameDelegado()
  }

  const totalvotos = listaGuardada.reduce((acc, el) => acc + el.votos, 0);
  numVotos.textContent = totalvotos;

}
