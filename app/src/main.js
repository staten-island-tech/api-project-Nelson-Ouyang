import "./style.css";
import * as d3 from "d3";
var svg = d3
  .select("#circle")
  .append("svg")
  .attr("width", 250)
  .attr("height", 250);

// Add the path using this helper function
svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("stroke", "black")
  .attr("fill", "#69a3b2");

// Function to get asteroid color based on spectral type and albedo
function getAsteroidColor(asteroid) {
  // Get spectral type (prefer spec_B, fall back to spec)
  const spectralType = asteroid.spec_B || asteroid.spec || "";
  const albedo = parseFloat(asteroid.albedo) || 0.15;

  // Base colors for different spectral types
  const baseColors = {
    // Carbonaceous asteroids (dark)
    C: { r: 90, g: 70, b: 56 }, // Dark brown
    B: { r: 45, g: 36, b: 30 }, // Darker brown/black
    Ch: { r: 74, g: 59, b: 50 }, // Carbonaceous hydrated
    Cb: { r: 85, g: 68, b: 56 }, // Carbonaceous B-type
    Cg: { r: 73, g: 61, b: 51 }, // Carbonaceous G-type

    // Stony/Silicaceous asteroids
    S: { r: 212, g: 167, b: 106 }, // Sandy brown
    Sa: { r: 229, g: 185, b: 122 }, // Lighter sandy
    Sq: { r: 201, g: 154, b: 90 }, // Stony Q-type
    Sk: { r: 188, g: 140, b: 74 }, // Stony K-type
    Sl: { r: 215, g: 173, b: 115 }, // Stony L-type

    // Metallic asteroids
    M: { r: 176, g: 176, b: 176 }, // Metallic gray
    X: { r: 200, g: 200, b: 200 }, // Bright metallic
    Xe: { r: 208, g: 208, b: 208 }, // Enstatite
    Xk: { r: 192, g: 192, b: 192 }, // Metallic with silicates
    Xc: { r: 184, g: 184, b: 184 }, // Carbonaceous metallic

    // Vesta family (basaltic)
    V: { r: 139, g: 69, b: 19 }, // Saddle brown

    // Enstatite asteroids
    E: { r: 245, g: 245, b: 220 }, // Light beige

    // Other types
    G: { r: 125, g: 105, b: 66 }, // Olive brown
    P: { r: 140, g: 120, b: 83 }, // Bronze
    D: { r: 92, g: 64, b: 51 }, // Dark red-brown
    T: { r: 101, g: 67, b: 33 }, // Dark brown (T-type)
    F: { r: 156, g: 138, b: 107 }, // Tan
    Q: { r: 210, g: 180, b: 140 }, // Tan

    // Unknown/fallback
    "": { r: 160, g: 160, b: 160 }, // Gray
  };

  // Get base color or use default
  const baseColor = baseColors[spectralType] || baseColors[""];

  // Adjust brightness based on albedo
  // Albedo ranges from ~0.03 (very dark) to ~0.6 (very bright)
  // Map albedo 0.03-0.6 to brightness 0.3-1.0
  const minAlbedo = 0.03;
  const maxAlbedo = 0.6;
  const normalizedAlbedo = Math.min(Math.max(albedo, minAlbedo), maxAlbedo);
  const brightness =
    0.3 + ((normalizedAlbedo - minAlbedo) / (maxAlbedo - minAlbedo)) * 0.7;

  // Apply brightness to color
  const r = Math.round(baseColor.r * brightness);
  const g = Math.round(baseColor.g * brightness);
  const b = Math.round(baseColor.b * brightness);

  return `rgb(${r}, ${g}, ${b})`;
}

function drawCircle(selector, asteroid) {
  // Find maximum asteroid diameter to scale against
  // Ceres is the largest at 939.4 km in your sample data
  const maxDiameter = 939.4;

  // Calculate scaled radius
  const maxRadius = 90; // Maximum radius in pixels (leaves some margin)
  const scaledRadius = (asteroid.diameter / maxDiameter) * maxRadius;

  // Minimum radius so small asteroids are still visible
  const minRadius = 5;
  const radius = Math.max(scaledRadius, minRadius);

  // Get color based on asteroid properties
  const asteroidColor = getAsteroidColor(asteroid);

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", 250)
    .attr("height", 250);

  // Draw the asteroid circle
  svg
    .append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", radius)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", asteroidColor);

  // Add a label with diameter
  svg
    .append("text")
    .attr("x", 100)
    .attr("y", 100 - radius - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(`${asteroid.diameter} km`);

  // Add spectral type label
  svg
    .append("text")
    .attr("x", 100)
    .attr("y", 100 + radius + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "gray")
    .text(`${asteroid.spec_B || asteroid.spec || "?"}-type`);
}

const earthDiameter = 12742; // km

async function getData() {
  //something CORS problem so we need this i need help whalen https://cors-anywhere.herokuapp.com/corsdemo
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = "http://asterank.com/api/asterank?query={}&limit=100";
  const apiUrl = proxyUrl + targetUrl;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Origin: window.location.origin,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const asteroids = await response.json();
    asteroids.forEach((asteroid) => {
      if (asteroid.price === 0) {
        asteroid.price = "No data available :(";
      }
      const comparison = asteroid.diameter / earthDiameter;
      inject(asteroid, comparison);
    });

    console.log(`Total asteroids: ${asteroids.length}`);
  } catch (error) {
    console.error("Failed to fetch asteroids:");
  }
}

getData();

function inject(asteroid, comparison) {
  document.querySelector("#api-response").insertAdjacentHTML(
    "beforeend",
    `<div class='card w-108 bg-base-100 shadow-xl m-4 p-6'>
      <div class="card-contents">
        <h2 class="card-title" id="${asteroid.pdes}">${asteroid.name}</h2>
        <p><strong>Cost:</strong> ${asteroid.price}</p>
        <p><strong>Diameter:</strong> ${asteroid.diameter} km</p>
        <p><strong>Comparison:</strong> ${(comparison * 100).toFixed(
          2
        )}% of Earth's diameter</p>
        <p><strong>Spectral Type:</strong> ${
          asteroid.spec_B || asteroid.spec || "Unknown"
        }</p>
        <p><strong>Albedo:</strong> ${asteroid.albedo || "Unknown"}</p>
        

      </div>
      <figure>
        <div class="asteroid-vis" id="vis-${asteroid.pdes}"></div>
      </figure>
    </div>`
  );

  drawCircle(`#vis-${asteroid.pdes}`, asteroid);
}
async function filter() {
  //something CORS problem so we need this i need help whalen https://cors-anywhere.herokuapp.com/corsdemo
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = "http://asterank.com/api/asterank?query={}&limit=100";
  const apiUrl = proxyUrl + targetUrl;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Origin: window.location.origin,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const asteroids = await response.json();
    asteroids.forEach((asteroid) => {});

    console.log("mr whalen do actually look at this?");
  } catch (error) {
    console.error("Failed to fetch asteroids:", error);
  }
}
