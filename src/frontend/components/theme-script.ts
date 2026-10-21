export const themeStorageKey = "rooty-theme";

// Inlined in <head>: runs before paint so a saved theme never flashes the
// wrong colours. Kept out of the client module so the server can import it.
// Dark is the default; only a saved "light" changes it. data-motion turns on
// scroll reveals (see globals.css) unless the visitor asked for less motion.
export const themeInitScript = `(function(d){try{if(localStorage.getItem("${themeStorageKey}")==="light")d.dataset.theme="light"}catch(e){}if(window.IntersectionObserver&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.motion=""})(document.documentElement)`;
