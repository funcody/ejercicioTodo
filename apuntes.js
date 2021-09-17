/*
Resumen:

0. Archivo index.js en la raíz
1. Archivo con la clase constructora para realizar tudus (Todos).
    - LLeva una propiedad dinámica y otras automáticas.

2. Archivo en donde creamos otra clase que guarde los tudus en un constructor mediante un constructor (TodosList).
3. Archivo index.js unificador de clases dentro de la carpeta classes donde están todos los archivos js relacionados con clases.
4. Archivo index.js en la raíz del proyecto.
     4.1 Desde aquí se crea una intancia del array de tudus (TodosList) que va albergar todos los tudus (todoList).

5. Archivo componentes.js. Dentro ser irán añadiendo los scripts desde donde se llamarán a las clases.
 5.1 Función que cuando se pulse Enter, se añada un tudu:
    5.1.1 Al pulsar pasa lo siguiente:
        - Crea una instancia de tudu.
        - Introduce este tudu en el array que almacena todos los tudus.
        - Llama a una función que reciba un tudu y genere el html de este incorporando los valores recogidos del array que almacena los tudus.

 5.2 Función para un marcar tudu como completado:
 5.3 Función para eliminar un tudu:
 5.4 Función para borrar los todos los tudus completados:
 5.5 Preparar el localStorage. Guardar y recuperar tudus.
 5.6 Recuperar instancias de tudus.
 5.7 Aplicar filtros
 5.8 Añadir marcador de tudus pendientes
*/




// -----------  0. Archivo index.js en la raíz
// -----------  1. Archivo con la clase constructora para realizar tudus.



import {crearTodoHtml, insertarNumeroTodosPendientes, insertarTodo} from "./src/js/componentes";

export class Todo {

    constructor(tarea) {

        this._tarea = tarea;
        this._id = new Date().getTime();
        this._completado = false;
        this._creado = new Date();
    }
}




// -----------  2. Archivo en donde creamos otra clase que guarde los tudus en un constructor mediante un constructor.




export class TodoList {

    constructor() {
        this._todos = [];
    }

    // ----- Funciones -----

    nuevoTodo(todo) {
        this._todos.push(todo)
    }

    eliminarTodo(id) {
        this._todos = this._todos.filter(todo => todo._id !== id);
    }

    marcarCompletado(id) {
        const todoCompletado = this._todos.find(idRecibido => idRecibido._id === id);
        todoCompletado._completado = !todoCompletado._completado;
    }

    eliminarCompletados() {
        this._todos = this._todos.filter(todo => !todo._completado); // Si es diferente de true
    }
}


// -----------  3. Archivo index.js. Todas los archivos .js relacionados con clases van dentro de una carpeta llamada classes con un index.js que unifica las clases.


import {Todo} from './todo.class';
import {TodoList} from './todo.list-class';

export {
    Todo,
    TodoList
}

// -----------  4. Archivo index.js en la raíz del proyecto.




// Desde aquí se crea una intancia del array de tudus (TodosList) que va albergar todos los tudus (todoList).

export const todoList = new TodoList();

// 5. Archivo componentes.js. Dentro ser irán añadiendo los scripts desde donde se llamarán a las clases.
// 5.1.1 Creamos un evento al pulsar Enter que ejecuta:
//  - Una función que inserta un tudu con el texto  del input:
//  - Introduce el tudu en el array de tudus. Función de la instancia todoList proveniente de la clase TodoList
//  - Crea el código html con el tudu integrado en el array.

txtInput.addEventListener("keyup", (event) => {

    if (event.keyCode === 13 && txtInput.value.length > 0) {

        const tarea = insertarTodo(txtInput.value);
        todoList.nuevoTodo(tarea);
        crearTodoHtml(tarea);
        txtInput.value = '';
    }
});

// - Esta es la función que crea el tudu, ejecutado desde el evento Enter.

export const insertarTodo = (texto) => {
    const tarea = new Todo(`${texto}`);
    return tarea;
}

// - Llama a una función que reciba un tudu y genere el html de este incorporando los valores recogidos del array que almacena los tudus.

export const crearTodoHtml = (todo) => {

    const htmlTodo = `<li class="${(todo._completado) ? 'completed' : ''}" data-id="${todo._id}">
                            <div class="view">
                                <input class="toggle" type="checkbox" ${(todo._completado) ? 'checked' : ''}>
                                <label>${todo._tarea}</label>
                                <button class="destroy"></button>
                            </div>
                            <input class="edit" value="Create a TodoMVC template">
                       </li>`;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;
    divTodoList.append(div.firstElementChild);

    return div.firstElementChild;
}



// -----------  5.2 - 5.3 Función para un marcar tudu como completado y función para eliminar un tudu:




divTodoList.addEventListener('click', (event) => {
    const nombreElemento = event.target.localName; // input, label, button... puede ser cualquier cosa donde hagamos click. Servirá para obligar que pinchen en el check
    // Busca el elemento padre que esté por encima de donde se hace click. Buscamos el li, por eso lo hemos puesto dos veces seguidas (hasta encontrarlo).
    const todoElemento = event.target.parentElement.parentElement;
    //console.log(todoElemento); // Nos indica en consola el código html, donde se muestra el id del elemento
    // Extraer el id del elemento. Se hace con getAttribute (''), donde podemos extraer el atributo que nos interese del código html.
    // Puede ser la clase, el id, el data-id, el value...
    const todoId = parseInt(todoElemento.getAttribute('data-id'));
    // Enviamos el id para marcarlo como completado:

    if (nombreElemento.includes('input')) { // Quiere decir que hizo click en el check. Si lo hacen en el input o en el botón no funciona
        todoList.marcarCompletado(todoId);
        // Para hacer referencia a todas las clases se utiliza el classList. Si queremos altener entre añadir y quitar una sola clase se hace con classList.toggle('')
        todoElemento.classList.toggle('completed');
    }

// --------- ELIMINAR UN TUDU  ---------

    else if (nombreElemento.includes('button')) { // Hay que borrar el tudu

        // Eliminamos el html
        // Cogemos la etiqueta padre, donde dentro borraremos lo que queramos.
        // Le decimos con removeChild() que hijo queremos borrar. Le añadimos todoElemento que hace referencia al <li></li> que estamos pulsando.
        divTodoList.removeChild(todoElemento);

        // Eliminamos del array
        todoList.eliminarTodo(todoId);
    }

    // Mostramos el número de todos pendientes
    insertarNumeroTodosPendientes();

});




// 5.4 -----------  Función para borrar los todos los tudus completados:



const borrarCompletados = document.querySelector('.clear-completed'); // Es un botón

borrarCompletados.addEventListener('click', () => {

    // Borra los tudus del array
    if (divTodoList.children.length > 0) {
        todoList.eliminarCompletados();
    }

    // Borra los tudus del HTML. Se hace un bucle a la inversa para no descolocar el orden cuando se vayan eliminando.
    for (let i = divTodoList.children.length - 1; i >= 0; i--) {

        const elementoLi = divTodoList.children[i];

        if (elementoLi.classList.contains('completed')) {
            divTodoList.removeChild(elementoLi);
        }
    }
});



// ----------- 5.5 Preparar el localStorage. Guardar y recuperar tudus. -----------



// Se introduce dentro de la clase TodoList:

class TodoList {
    constructor() {
    }

    guardarLocalStorage() {
        // Aquí vamos a poder almacenar información que necesite nuestra aplicación. En este caso todos en el array
        // de todos los tudus en formato JSON.
        // JSON.stringify(): Sirve para enviar un objeto en un json perfecto.
        localStorage.setItem('todo', JSON.stringify(this._todos));
    }

    cargarLocalStorage() {

        // localStorage.getItem --> Devuelve el valor de la clave cuyo nombre se le pasa por parámetro.
        // Siempre que trabajemos con localStorage, si hay alguna llave grabada, debemos validar si ese objeto existe.
        // Si this._todos existe entonces los recupero
        // JSON.parse(), sirve convertir un JSON a un objeto
        // En el caso de que no exista, no teníamos nada aún grabado en el localStorage o el usuario había borrado la
        // caché o purgado la caché desde localStorage.
        // Si no existe vamos a decir que this._todos va a ser igual a un array vacío y de esa manera lo inicializo. this._todos = [];
        this._todos = (localStorage.getItem('todo'))
            ? this._todos = JSON.parse( localStorage.getItem('todo'))
            : [];
    }
}

// Se introduce dentro de las funciones necesarias:


// Se inicializa en el index.js de la raíz mediante la creación de la instancia:
import { TodoList, } from './classes';
import { crearTodoHtml, insertarNumeroTodosPendientes } from './js/componentes.js'

export const todoList = new TodoList();



//  ----------- 5.6 Recuperar instancias de tudus.




// Dentro de la clase TodoList añadimos dentro de la función de carga cargarLocalStorage(), el código que nos permita pasarle una
// función a cada objeto, para así convertirlo en instancia.


class TodoList {
    constructor() {
    }


    cargarLocalStorage() {

        // ***** SE LE AÑADE ****

        // Las instancias han dejado de serlo, convirtiéndose en solamente objetos.
        // Para reconstruir estas objetos en instancias, le pasamos una función (que se encuentra en la Clase principal) a cada uno de ellos.
        this._todos = this._todos.map(obj => Todo.fromJson (obj)); // Se utiliza map porque crea un array con la condición dada, que es un objeto nuevo creado instancia.
    }

}

// Función estática que recibe cada objeto y lo convierte en una nueva instancia.

class Todo {

    // ***** SE LE AÑADE ****

    // Función para convertir el objeto resultante de la codificación entre JSON.stringify y JSON.parse a una nueva instancia de la clase pionera.
    // Hay que hacer una función lo más parecida posible al constructor de la clase y devolverla.
    static fromJson({_tarea, _id, _completado, _creado}) { // Realmente recibe un objeto (obj.tarea...) pero al estar los argumentos entre llaves se pueden desestructurar

        const todoTemporal = new Todo(_tarea);

        // En la clase principal, le enviamos la tarea y automáticamente nos coloca los valores dinámicos por defecto
        // Aquí lo que se necesita es clonar valores añadidos que se han añadido a los objetos creados con localStorage (que had dejado de ser instancias).
        // Por eso se les asigna los valores que vienen en los atributos del objeto (anteriormente instancia), para reconstruirlos en instancias,
        // llamando nuevamente al constructor
        todoTemporal._id = _id;
        todoTemporal._completado = _completado;
        todoTemporal._creado = _creado;

        return todoTemporal;
    }
    constructor() {
    }
}

// Creación de los tudus en código html proveniente de localStorage. index.js de la raíz del proyecto añadimos la linea que creará el código html de localStorage:


// Llama todoList._todos, que son todos los tudus que hay el array guardado de esta clase.
// Al llamarlos le estamos pasando a cada elemento una función que le añade código html y posiciona los elementos de las instancias.
// cargarLocalStorage() se está cargando desde el constructor de todoList. Si está vació lo inicializa, si no se ejecuta el localStorage.
// this._todos = (localStorage.getItem('todo'))
//                     ? this._todos = JSON.parse( localStorage.getItem('todo'))
//                     : [];
todoList._todos.forEach(todo => crearTodoHtml(todo));



//   -----------   5.7 Aplicar filtros   -----------


// Se hace añadiendo la clase hidden a los elementos una vez se pulse sobre el botón.


const filtrosUl = document.querySelector('.filters'); // Filtrar mediante el profesor:

filtrosUl.addEventListener('click', (event) => {

    const textoFiltro = event.target.text;
    // Si filtro devuelve undefined (Lo hace si pinchas fuera de la palabra)
    if (!textoFiltro){ return;}

    for (const elemento of divTodoList.children){

        // Borra de todos los elementos la clase hidden.
        elemento.classList.remove('hidden');
        // Guardamos en una variable la clase del elemento analizado.
        const completado = elemento.classList.contains('completed');

        switch (textoFiltro) {
            // Cuando pulsemos 'pendientes', todos los tag que contengan la clase completed, se le pondrá hidden,
            case ('Pendientes'):
                if (completado){
                    elemento.classList.add('hidden');
                }
                break;
            // Cuando pulsemos 'completados', todos los tag que NO contengan la clase completed, se le pondrá hidden,
            case ('Completados'):
                if (!completado){
                    elemento.classList.add('hidden');
                }
                break;

        }
    }
});



//   -----------   5.8 Añadir marcador de tudus pendientes   -----------



// Se hace la clase TodoList una función que devuelva el valor:

class TodoList {
    constructor() {
    }

    // ***** SE LE AÑADE ****

    mostrarNumeroTodosPendientes () {
        let contadorTodosPendientes = 0;
        this._todos.forEach(x => {
            if (x._completado !== true){
                contadorTodosPendientes++;
            }
        });

        return contadorTodosPendientes;
    }
}

// Se crea una función en componentes.js que muestre mediante código html el número recogido.

export const insertarNumeroTodosPendientes = () => {
    const codigoHtml = `<strong>${todoList.mostrarNumeroTodosPendientes()}</strong> pendiente(s)`;
    marcadorPendientes.innerHTML = codigoHtml;
}

// Se llama a la función en todos los lugares donde se realicen cambios:

// En index.js raíz
// En los eventos 'al pulsar Enter', al borrar un tudu y al marcarlo como completado,
insertarNumeroTodosPendientes();



/*

NOTAS:

* Las funciones internas de una clase se utilizan para llamarlas desde las instancias. Estas devuelven datos relacionados con la instancia utilizada.
* Las funciones estáticas, se utilizan para ejecutar datos externos y utilizarlos con


*/