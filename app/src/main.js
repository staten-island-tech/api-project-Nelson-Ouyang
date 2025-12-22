import "./style.css";

async function getData() {
  //something CORS problem so we need this i need help whalen
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = "http://asterank.com/api/asterank?query={}&limit=1000";
  const apiUrl = proxyUrl + targetUrl;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const asteroids = await response.json();

    const asteroidHTML = asteroids
      .map((ast) => {
        const name = ast.name || ast.full_name || ast.prov_des || "Unnamed";
        const price = ast.price || "No price data";
        return `${name}: $${price}`;
      })
      .join("<br>");

    document.getElementById("api-response").innerHTML = asteroidHTML;

    console.log(`Total asteroids: ${asteroids.length}`);
  } catch (error) {
    console.error("Failed to fetch asteroids:", error);
  }
}

getData();
