$(document).ready(() => {
  /* LETs & CONSTs */
  /* --------------------------------------------------------- */

  /* ON REFRESH */
  // Modifico la navbar modificando l'opzione profilo,
  // ridondante in quanto riporta alla stessa pagina
  // e la trasformo nell'opzione "Home"
  $("#profile-nav").attr("href", "/").text("Home");
  /* --------------------------------------------------------- */
});
