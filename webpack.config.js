/*
NO FUNCIONA CON LAS ACTUALIZACIONES


----- INSTALAR UNA VERSIÓN DESEADA ----

    npm install css-loader@6.2.0


---- CONFIGURACIÓN DEL WEBPACK ----

    module.exports = {

        mode: 'development',
    }


----- ERROR DEVTOOLS TO LOAD SOURCEMAP FOR WEBPACK ----

Deshabilitar "Habilitar mapas de origen de JavaScript"

----------- ----------- ----------- ----------- -----------



- mode: 'development' --> Sirve para dejar los comentarios.
- module:
    - Aquí comienza la configuración del webpack.
    - Dentro del modulo nosotros podemos definir reglas.
- rules: (rules[{}]) Las reglas sirven para decirle al webpack que hacer con ciertos archivos o que haga lo que tiene que hacer en ciertas ocasiones.
   Por ejemplo, queremos que cuando haga el build, también mueva el archivo index.html a la carpeta de distribución (dist), para
   esto necesitamos importar dos módulos. Uno es el html-loader, y otro es html-webpack-plugin. Este es el comando en terminal:

    npm i -D html-loader html-webpack-plugin

    - i: Install
    - -D: Para que lo haga como una dependencia de desarrollo. (si esto no se especifica, entonces Node lo interpreta como dependencia de producción)
    - html-loader: Permite mover el archivo html a dist
    - html-webpack-plugin: Sirve para incrustar la ruta del bundle (el main.js) en el index.
    - Comprobamos el package.json para ver que se han instalado en el apartado devDependencies

- test: Es la condición que webpack tiene que hacer cuando esté procesando archivo por arhivo, y esta condición se va a ejecutar
  si el archivo la expresión regular.
    - Expresión regular: Permite buscar coincidencias de lo que yo le especifique dentro de un string. También se puede hacer
      de esta manera: test: /\.html$/
    - test: /\.html$/ --> Esto le dice que aplique la regla test, si el archive que procese es un archivo html.
    - use: (use[{}]) Si es un archivo html usa lo siguiente

- Una vez acabada la configuración borramos el dist y ejecutamos nuevamente: npm run build

---- SERVIDOR DE DESARROLLO DE WEBPACK  (Compilación automática) ----

- Escribimos en terminal y estando en el directorio del package.json:

    npm i -D webpack-dev-server

- Una vez instalado nos vamos al package.json y en el apartado de script añadimos: "start": "webpack-dev-server --open"
  webpack-dev-server --open --> Significa, en cuanto se levante el dev-server, ábrelo.

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack",
        "start": "webpack serve --open"
    },

- Seguidamente nos vamos a la terminal y ejecutamos para que se habra atuomáticamente en un navegador:

    npm start

- Para parar el servicio se hace --> tecla Windows + C

---- INSTALAR ESTILOS DINÁMICAMENTE ----

- Intalamos con:

    npm i -D css-loader style-loader

- css-loader:
- style-loader:

- Nos vamos al archivo de js donde queremos importar ese css y lo hacemos con import:

    import '../css/componentes.css'

- Nos vamos a las reglas del webpack.config.js (rules), y escribimos los ajustes:

    rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },

- Borramos la carpetas dist y volvemos a ejecutar:  npm run build

----- ESTILOS GLOBALES -----

- Cuando se coloca el style en la raiz del proyecto junto al index, muchos frameworks lo utilizan para indicar que es el archivo global.
- Lo que queremos hace es que el archivo .css global se introduzca en dist, no queremos que se instale en main.js como lo hicimos
  en el apartado anterior.
- Empezamos instalando el siguiente comando:

   npm i -D mini-css-extract-plugin

- Ahora configuramos el webpack. Siempre que se intale un plugin debemos hacelo mediante una constante.
- Para instalar el plugin que hace falta para que se minimice el css en producción:

    npm i -D css-minimizer-webpack-plugin


----- IMÁGENES -----

- Para que las imágenes las reconozca el html debemos instalar el siguiente paquete:

    npm i -D file-loader


--- SI DA PROBLEMAS LA IMAGEN, ES POR EL MÓDULO HTML-LOADER. INSTALAR UNA VESIÓN ANTERIOR:

    npm install html-loader@0.5.5 --force

*/



const HtmlWebPackPlugin       = require('html-webpack-plugin');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'development',
    optimization: {
        minimizer: [ new OptimizeCssAssetsPlugin() ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /styles\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /styles\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: 'assets/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            ignoreOrder: false
        })
    ],

}

