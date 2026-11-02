/* ============================================================
   COUNTRY EXPLORER — script.js
   ------------------------------------------------------------
   THE PATTERN (this is the whole lab):
     1. Get user input
     2. Fetch data from an API
     3. Convert the response to JSON
     4. Pull the piece of data you need off the response
     5. Drop it into the page with .textContent / .src
   Steps 1-6 below are built together as an instructor demo.
   Steps 7-10 are your team's mission — they reuse the exact
   same pattern shown in Step 6, just with different data.
   ============================================================ */
// --- Element references (grab everything once, up front) -----
const searchBtn = document.getElementById("searchBtn");
const countryInput = document.getElementById("countryInput");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("errorMessage");
const resultCard = document.getElementById("resultCard");
const flagImg = document.getElementById("flagImg");
const countryNameEl = document.getElementById("countryName");
const capitalEl = document.getElementById("capitalValue");
const regionEl = document.getElementById("regionValue");
const populationEl = document.getElementById("populationValue");
const languagesEl = document.getElementById("languagesValue");
/* ------------------------------------------------------------
   STEP 1: Connect the button's click event.
   ------------------------------------------------------------ */
searchBtn.addEventListener("click", fetchCountry);

/* ------------------------------------------------------------
   STEP 2: Create fetchCountry()
   ------------------------------------------------------------ */
async function fetchCountry() {
  const countryName = countryInput.value.trim();
  if (!countryName) return; // nothing typed, nothing to do

  showLoading();

  try {
    /* ------------------------------------------------------------
       STEP 4: Build the fetch request
       ------------------------------------------------------------
       The old v3.1 API is retired. v5 requires an API key sent as
       an Authorization header, and (for browser requests) your
       API key must allow-list your origin (127.0.0.1 / localhost/ or your live preview url without the HTTPS)
       on the API Keys page at restcountries.com.
       ------------------------------------------------------------ */
    const API_KEY = "rc_live_0f14adc894734c1f81880304d925aa96";
    const url =
      `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}` +
      `&response_fields=names.common,capitals,region,population,languages,flag.url_png,flag.description`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!response.ok) {
      throw new Error("Country not found");
    }

    /* ------------------------------------------------------------
       STEP 5: Convert response -> JSON
       ------------------------------------------------------------
       v5 wraps results in { data: { objects: [...] } }
       ------------------------------------------------------------ */
    const data = await response.json();
    const objects = data.data?.objects || data;

    if (!objects || objects.length === 0) {
      throw new Error("Country not found");
    }

    const country = objects[0];

    /* ------------------------------------------------------------
       STEP 6: Display Country Name.
       ------------------------------------------------------------ */
    countryNameEl.textContent =
      country.names?.common || country.name?.common || "Unknown";

    hideLoading();
    resultCard.classList.remove("hidden");
    errorEl.classList.add("hidden");
  } catch (error) {
    hideLoading();
    resultCard.classList.add("hidden");
    errorEl.textContent = `We couldn't find "${countryName}". Check the spelling and try again.`;
    errorEl.classList.remove("hidden");
    console.error(error);
  }
}
/* ------------------------------------------------------------
       STEP 7: Display the Flag
       ------------------------------------------------------------ */
const flagUrl =
  country.flag?.url_png || country.flags?.png || country.flags?.svg || "";
flagImg.src = flagUrl;
flagImg.alt =
  country.flag?.description || `Flag of ${countryNameEl.textContent}`;

/* ------------------------------------------------------------
       STEP 8: Display Capital, Region, Population
       ------------------------------------------------------------ */
const capital = Array.isArray(country.capitals)
  ? country.capitals[0]
  : Array.isArray(country.capital)
    ? country.capital[0]
    : "N/A";
capitalEl.textContent = capital || "N/A";
regionEl.textContent = country.region || "N/A";
populationEl.textContent = Number(country.population || 0).toLocaleString();

/* ------------------------------------------------------------
       STEP 9: Display Languages
       ------------------------------------------------------------ */
const languages = country.languages
  ? Object.values(country.languages).join(", ")
  : "N/A";
languagesEl.textContent = languages;

/* ------------------------------------------------------------
       STEP 10a: Improve the experience — clean up on SUCCESS
       ------------------------------------------------------------ */

/* ------------------------------------------------------------
       STEP 10b: Improve the experience — error handling
       ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Helper functions — already built for you.
   ------------------------------------------------------------ */
function showLoading() {
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  resultCard.classList.add("hidden");
}

function hideLoading() {
  loadingEl.classList.add("hidden");
}
