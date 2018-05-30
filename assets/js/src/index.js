import bar from "./bar.js"; // Default export

import { Multiply } from "./bar.js"; // Named exports
import { Count as barCount } from "./bar.js"; // Named exports

// загрузка стилей в js , подключит в <head>
/*
<style type="text/css">h1{
    background-color: red;
}
</style>
 */

import "../../css/src/styles.css";
import img from "../../image/src/001.jpg";

// переменные среды
if (NODE_ENV == "development") {
	console.log("bar default=", bar());
	console.log("Multiply=", Multiply(1, 2));
	console.log("barCount=", barCount);
}
console.log("LANG=", LANG);

window.onload = function() {
	//проверка загрузки стилей
	$(document.body).append("<h1>CSS</h1>" + '<img src="' + img + '"/>');

	//Динамическая подгрузка подуля
	document.getElementById("login").addEventListener("click", function(e) {
		require.ensure(
			["./route/login"],
			function(require) {
				let login = require("./route/login");
				login();
			},
			"dinamic"
		);

		// для динамического выражения  есть  require.context когда require('./' + var)
		/*let moduleName = 'login';
        let context = require.context('./route',false,/\.js$/);
        context.keys().forEach(function(path){
            let module = context(path);
            module();
        });
        let route ;
        route = context('./'+moduleName);
        route();*/
	});
};

// для доступа из html
export default {
	Multiply: Multiply,
	barCount: barCount,
	bar: bar
};
