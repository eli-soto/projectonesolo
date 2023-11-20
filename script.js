const Restaraunts_API_KEY =
  "4772b61e07msh6a7fab5d8269c26p136d02jsn1ad3d28df93a";

const RAPID_API_KEY = "cca843b0a3msh3bae8af4ca13636p1832e0jsnf296ec4e2a77";

// Set initial values in localStorage
localStorage.setItem("restaurantName", "");
localStorage.setItem("restaurantUrl", "");
localStorage.setItem("movieName", "");
localStorage.setItem("movieUrl", "");

function generate() {
  let movieSelect = document.getElementById("movie-select");
  let restaurantSelect = document.getElementById("restaurant-select");
  movieSelect.style.backgroundColor = "rgb(169, 169, 169)";
  restaurantSelect.style.backgroundColor = "rgb(169, 169, 169)";

  let selectedCuisine = document.getElementById("restaurant-drp-dwn").value;
  let selectedGenre = document.getElementById("movie-drp-dwn").value;

  if (selectedGenre === "none") {
    movieSelect.style.backgroundColor = "rgb(255, 0, 0, .3)";
  }

  if (selectedCuisine === "none") {
    restaurantSelect.style.backgroundColor = "rgb(255, 0, 0, .3)";
  } else {
    fetchRestaurant(selectedCuisine);
    fetchMovie();

    let preHeader = document.getElementById("pre-header");
    preHeader.style.display = "none";

    let elements = document.getElementsByClassName("results-cards");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "flex";
    }

    let images = document.getElementsByClassName("result-image");
    for (let i = 0; i < images.length; i++) {
      images[i].style.visibility = "visible";
    }
    updateElementContent("pre-movie", "movie");
    updateElementContent("pre-restaurant", "restaurant");
  }
}

async function fetchRestaurant() {
  let url =
    "https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/state/MI/city/West%20Bloomfield/0";
  const options = {
    method: "GET",
    headers: {
      "Accept-Language": "en",
      "X-RapidAPI-Key": Restaraunts_API_KEY,
      "X-RapidAPI-Host": "restaurants-near-me-usa.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    let listRestaurants = result.restaurants;
    let selectedRestaurant = getRandomElement(listRestaurants);

    updateRestaurantDetails(selectedRestaurant);
  } catch (error) {
    console.error(error);
  }
}

async function fetchMovie() {
  let selectedGenre = document.getElementById("movie-drp-dwn").value;
  const url = `https://moviesminidatabase.p.rapidapi.com/movie/byGen/${selectedGenre}/`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    let movies = result.results;
    let selectedMovie = getRandomElement(movies);

    const imdbURL = `https://moviesminidatabase.p.rapidapi.com/movie/id/${selectedMovie.imdb_id}/`;
    const imdbOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
      },
    };

    try {
      const imdbResponse = await fetch(imdbURL, imdbOptions);
      const imdbResult = await imdbResponse.json();

      let movieResult = imdbResult.results;
      updateMovieDetails(movieResult);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

function updateElementContent(elementId, type) {
  let preElement = document.getElementById(elementId);
  preElement.innerHTML = localStorage.getItem(`${type}Name`);
  preElement.setAttribute("href", localStorage.getItem(`${type}Url`));
}

function getRandomElement(array) {
  let randomIndex = Math.floor(Math.random() * (array.length - 1));
  return array[randomIndex];
}

function updateRestaurantDetails(selectedRestaurant) {
  let restaurantImage = document.getElementById("restaurant-image");
  let restaurantLabel = document.getElementById("label");
  let restaurantPhone = document.getElementById("phone");
  let restaurantAddress = document.getElementById("address");
  let restaurantLink = document.getElementById("restaurant-link");

  restaurantImage.setAttribute("src", "./foodPic.avif");
  restaurantLabel.innerHTML = selectedRestaurant.restaurantName;
  restaurantPhone.innerHTML = `Phone: ${selectedRestaurant.phone}`;
  restaurantAddress.innerHTML = `address: ${selectedRestaurant.address} `;
  restaurantLink.setAttribute("href", selectedRestaurant.website);

  localStorage.setItem("restaurantName", selectedRestaurant.restaurantName);
  localStorage.setItem("restaurantUrl", selectedRestaurant.website);
}

function updateMovieDetails(movieResult) {
  // Update movie details in the DOM
  // ...

  //  let movieResult = imdbResult.results
  let movieImage = document.getElementById("movie-image");
  let movieTitle = document.getElementById("title");
  let movieYear = document.getElementById("year");
  let movieRating = document.getElementById("rating");
  let movieTrailer = document.getElementById("movie-trailer");

  movieImage.setAttribute("src", movieResult.image_url);
  movieTitle.innerHTML = movieResult.title;
  movieYear.innerHTML = movieResult.year;
  movieRating.innerHTML = movieResult.content_rating;
  movieTrailer.setAttribute("href", movieResult.trailer);

  // Update localStorage
  localStorage.setItem("movieName", movieResult.title);
  localStorage.setItem("movieUrl", movieResult.trailer);
}

function toggleVisible() {
  let previous = document.getElementById("previous");
  previous.classList.toggle("previous-visible");
  previous.classList.toggle("previous-hidden");
}



$(document).ready(function () {
  $(".modal").modal();
});

$(document).ready(function () {
  $("select").formSelect();
});
