<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
    <h2 id="api-response"></h2>
    <script src="poke.js"></script>
  </body>
</html>

async function getData(poke) {
try {
//get data from API
const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
if (response.status != 200) {
throw new Error(response);
} else {
//convert to json we can use
const data = await response.json();
console.log(data);
document.getElementById("api-response").textContent = data.name;
}
} catch (error) {
console.log(error);
}
}

getData("Squirtle");

//promise said to be settled if its either resolved or rejected
//have to look at data to see what ur refrewnce, ex; data.data, data, or data.results you dont know so u geotta checkk
