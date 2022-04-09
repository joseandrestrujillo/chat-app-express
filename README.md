# Chat App with sockets


## Node dependencies
This project is build on nodejs, so we will need to have installed nodejs and npm to run the web app. 
First, it is necesary to install the babel dependencies, which utility is to convert modern JavaScript into a more compatible version of JavaScript:
~~~
>> npm i @babel/node @babel/core @babel/preset-env @babel/cli -D
~~~
Then, we will created a ".babelrc" file with the next content:
~~~
{
    "presets": [
        "@babel/preset-env"
    ]
}
~~~
To make the web app rub automatically when any file is modified, we need to install nodemon dependency:
~~~
>> npm i nodemon -D
~~~
Second, in the "package.json" file, we make an script to run the app: 
~~~
"scripts": {
    "start": "nodemon src/index.js --exec babel-node",
    ...
},
~~~
Finally, we need to install express and socket.io dependencies, used to:
- **express**: Develop the backend of our web app.
- **socket.io**: Allows build apps with persistent conexion between client and server.
~~~
>> npm i express socket.io
~~~

~~~
npm install -D typescript@3.3.3
npm install -D tslint@5.12.1
npm install -D @types/express@4.16.1
~~~