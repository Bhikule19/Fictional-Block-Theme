import "../css/style.scss";

// Our modules / classes
import MobileMenu from "./modules/MobileMenu";
import HeroSlider from "./modules/HeroSlider";
import initializeSearch from "./modules/Search";
import myNotes from "./modules/MyNotes";
import likeFunction from "./modules/Like";

// Instantiate a new object using our modules/classes
const mobileMenu = new MobileMenu();
const heroSlider = new HeroSlider();
initializeSearch(); // Initialize the search overlay functionality
myNotes(); // Initialize the notes functionality
likeFunction(); // Initialize the like button functionality
