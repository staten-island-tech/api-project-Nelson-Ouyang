import "./style.css";
/* import * as d3 from "d3"; */

async function getData() {
  //something CORS problem so we need this i need help whalen https://cors-anywhere.herokuapp.com/corsdemo
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = "http://asterank.com/api/asterank?query={}&limit=100";
  const apiUrl = proxyUrl + targetUrl;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const asteroids = await response.json();
    asteroids.forEach((asteroid) => {
      if (asteroid.price === 0) {
        asteroid.price = "No data available :(";
      }
      inject(asteroid);
    });

    console.log(`Total asteroids: ${asteroids.length}`);
  } catch (error) {
    console.error("Failed to fetch asteroids:", error);
  }
}

getData();

function inject(asteroid) {
  document.querySelector("#api-response").insertAdjacentHTML(
    "beforeend",
    `<div class='card w-96 bg-base-100 shadow-xl m-4'>
  <div class="card-contents">
    <h2 class="card-title" id = ${asteroid.pdes}>${asteroid.name}</h2>
    <p>cost = ${asteroid.price}</p>
  </div>
  <figure>
  <img src="https://nypost.com/wp-content/uploads/sites/2/2023/01/asteroid-earth.jpg" alt="Shoes" />
  </figure>
</div>`
  );
}

/* 

ONLY 2D IMAGES, DISREGARD 3D DIMENSIONS
physical features:
diameter = 939.4  # km (average)
dimensions = [964.4, 964.2, 891.8]  # km (x, y, z axes)
# These give you the ellipsoid shape
2. Surface Appearance
python
albedo = 0.09  # How dark/bright (0-1)
color = {
    'B': 0.713,  # Blue filter brightness
    'V': 0.713,  # Visual brightness  
    'U': 0.426   # Ultraviolet brightness
}
 */
