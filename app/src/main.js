import "./style.css";
import * as d3 from "d3";
var svg = d3
  .select("#circle")
  .append("svg")
  .attr("width", 200)
  .attr("height", 200);

// Add the path using this helper function
svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("stroke", "black")
  .attr("fill", "#69a3b2");

function drawCircle(selector) {
  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);

  svg
    .append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 50)
    .attr("stroke", "black")
    .attr("fill", "#69a3b2");
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
    console.error("Failed to fetch asteroids:", error);
  }
}

getData();

function inject(asteroid, comparison) {
  document.querySelector("#api-response").insertAdjacentHTML(
    "beforeend",
    `<div class='card w-108 bg-base-100 shadow-xl m-4 p-6'>
      <div class="card-contents">
        <h2 class="card-title" id="${asteroid.pdes}">${asteroid.name}</h2>
        <p>cost = ${asteroid.price}</p>
        <p> Compared to the asteriod's diameter of ${
          asteroid.diameter
        }, Earth is ${comparison.toFixed(4)}x its diameter.</p>
      </div>
      <figure>
        <div class="asteroid-vis" id="vis-${asteroid.pdes}"></div>
      </figure>
    </div>`
  );

  drawCircle(`#vis-${asteroid.pdes}`);
}

// img src is the faceholder for d3 making the ball
/* 

ONLY 2D IMAGES, DISREGARD 3D DIMENSIONS
physical features:
diameter = 939.4  # km (average)
dimensions = [964.4, 964.2, 891.8]  # km (x, y, z axes)
# These give you the ellipsoid shape
2. Surface Appearance
python
albedo = 0.09  # How dark/bright (0-1)
color = BV AND UB 
}


this is my planning doc.
We need a scale for size based on diameter, essential divide each diamaeter into PX based on all diameters (cuz we need to make a converter, where max is 200x200)
 */

/* function asteroidColorToRGB(bv, ub, albedo) {
  // Default values if missing
  bv = bv || 0.65; // Default BV for asteroids
  ub = ub || 0.42; // Default UB for asteroids
  albedo = albedo || 0.15; // Default albedo

  // Convert BV and UB to temperature approximation (simplified)
  // This is a rough approximation for asteroids
  const temperature = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));

  // Temperature to RGB conversion (blackbody radiation)
  let r, g, b;

  if (temperature <= 1000) {
    // Very cool - deep red
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else if (temperature <= 2000) {
    // Cool - red
    r = 1.0;
    g = 0.2;
    b = 0.0;
  } else if (temperature <= 3000) {
    // Warm - orange
    r = 1.0;
    g = 0.5;
    b = 0.0;
  } else if (temperature <= 4000) {
    // Moderate - yellow
    r = 1.0;
    g = 0.8;
    b = 0.0;
  } else if (temperature <= 5000) {
    // Solar-type - yellowish white
    r = 1.0;
    g = 1.0;
    b = 0.8;
  } else if (temperature <= 6000) {
    // White
    r = 1.0;
    g = 1.0;
    b = 1.0;
  } else {
    // Hot - bluish white
    r = 0.8;
    g = 0.9;
    b = 1.0;
  }

  // Adjust brightness based on albedo
  const brightness = 0.2 + albedo * 0.6; // Scale albedo to brightness

  // Apply brightness
  r = Math.min(1, r * brightness);
  g = Math.min(1, g * brightness);
  b = Math.min(1, b * brightness);

  // Adjust based on UB index (ultraviolet affects blue)
  if (ub < 0) {
    // More ultraviolet - slightly bluer
    b = Math.min(1, b * 1.2);
  } else if (ub > 0.5) {
    // Less ultraviolet - slightly redder
    r = Math.min(1, r * 1.1);
  }

  // Convert to RGB 0-255 values
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    rgb: `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )})`,
  };
}

// Alternative: Simple spectral type to color mapping (more reliable)
function spectralTypeToColor(spectralType, albedo) {
  const colorMap = {
    // Carbonaceous (dark)
    C: { r: 90, g: 70, b: 56 }, // Dark brown
    B: { r: 45, g: 36, b: 30 }, // Darker brown/black
    Ch: { r: 74, g: 59, b: 50 }, // Carbonaceous hydrated
    Cb: { r: 85, g: 68, b: 56 }, // Carbonaceous B-type
    Cg: { r: 73, g: 61, b: 51 }, // Carbonaceous G-type

    // Stony/Silicaceous
    S: { r: 212, g: 167, b: 106 }, // Sandy brown
    Sa: { r: 229, g: 185, b: 122 }, // Lighter sandy
    Sq: { r: 201, g: 154, b: 90 }, // Stony Q-type
    Sk: { r: 188, g: 140, b: 74 }, // Stony K-type
    Sl: { r: 215, g: 173, b: 115 }, // Stony L-type

    // Metallic
    M: { r: 176, g: 176, b: 176 }, // Metallic gray
    X: { r: 200, g: 200, b: 200 }, // Bright metallic
    Xe: { r: 208, g: 208, b: 208 }, // Enstatite

    // Vesta family (basaltic)
    V: { r: 139, g: 69, b: 19 }, // Saddle brown

    // Enstatite
    E: { r: 245, g: 245, b: 220 }, // Light beige

    // Fallback/default
    "": { r: 160, g: 160, b: 160 }, // Gray
  };

  const baseColor = colorMap[spectralType] || colorMap[""];

  // Adjust brightness based on albedo
  const brightness = 0.5 + albedo * 0.5;

  return {
    r: Math.round(baseColor.r * brightness),
    g: Math.round(baseColor.g * brightness),
    b: Math.round(baseColor.b * brightness),
    rgb: `rgb(${Math.round(baseColor.r * brightness)}, ${Math.round(
      baseColor.g * brightness
    )}, ${Math.round(baseColor.b * brightness)})`,
  };
}

// Combined approach: Use BV/UB if available, otherwise use spectral type
function getAsteroidColor(asteroid) {
  const bv = parseFloat(asteroid.BV);
  const ub = parseFloat(asteroid.UB);
  const albedo = parseFloat(asteroid.albedo) || 0.15;
  const spectralType = asteroid.spec || asteroid.spec_B || "";

  // If we have BV and UB values, use the physics-based conversion
  if (!isNaN(bv) && !isNaN(ub)) {
    return asteroidColorToRGB(bv, ub, albedo);
  }

  // Otherwise use spectral type mapping
  return spectralTypeToColor(spectralType, albedo);
}

// Usage in your drawCircle function:
function drawCircle(selector, asteroid) {
  const color = getAsteroidColor(asteroid);

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);

  svg
    .append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 50)
    .attr("stroke", "black")
    .attr("fill", color.rgb); // Use the calculated color
}
 */
