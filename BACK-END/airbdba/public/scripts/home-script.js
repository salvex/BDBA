// Il metodo ready fa si che lo script venga eseguito solo
// quando il browser ha terminato il parsing della pagina.
$(document).ready(() => {
  /* LETs & CONSTs */
  /* --------------------------------------------------------- */

  /* FUNCTIONS */
  // Data format function
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  /* --------------------------------------------------------- */

  /* ON REFRESH */
  // Pulisci i campi del form al aggiorno della pagina
  $("input").val("");

  // Seleziono un'immagine casuale per lo sfondo
  $("#home-container").css(
    "background-image",
    `url("/assets/images/homePage${Math.floor(Math.random() * 7) + 1}.jpg")`
  );
  /* --------------------------------------------------------- */

  /* JUMBOTRON - INFOBOX */
  // Nascondo l'infobox al caricamento della pagina
  $(".jumbotron").hide(0);

  // Mostro l'infobox con un'animazione di 1s
  $(".jumbotron").slideDown(1000);

  // Se desiderato, l'utente può chiudere l'infobox
  // cliccando sulla croce in alto. Animazione di 1s
  $("button.close").on("click", () => {
    $(".jumbotron").slideUp(1000);
  });
  /* --------------------------------------------------------- */

  /* FILTER BTN */
  // filter button color
  $("#filter-btn > img").attr("src", "assets/icons/add-white.png");

  // Filter button animation
  $("#filter-btn").on("click", () => {
    if ($("#filter-btn > img").hasClass("rotate-right")) {
      $("#filter-btn > img").removeClass("rotate-right");
    } else {
      $("#filter-btn > img").addClass("rotate-right");
    }
  });
  /* --------------------------------------------------------- */

  /* FORM DI RICERCA */
  // Controllo campi form ricerca
  $("#location").on("focusout input", () => {
    if ($("#location").val() === "") {
      $("#location").addClass("is-invalid");
    } else {
      $("#location").removeClass("is-invalid");
    }
  });
  /* --------------------------------------------------------- */

  /* DATEPICKER */
  // Datepicker logic
  $("#check-in").datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    startDate: new Date(),
  });

  $("#check-out").datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    startDate: new Date(),
  });

  // Datepicker date control
  $("#check-out").on("change", () => {
    const checkin = $("#check-in").val();
    const checkout = $("#check-out").val();

    // Controllo se il campo check in è vuoto
    if (checkin === "") {
      $("#check-out").val("");
      $("#check-in").focus();
    } else {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      if (checkoutDate < checkinDate) {
        $("#check-out").datepicker("update", checkin);
      }
    }
  });

  // Datepicker focus
  $("#check-in").on("change", () => {
    $("#check-out").focus();
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  // Metodo di ricerca sul submit del form
  $(".search-form").on("submit", (e) => {
    e.preventDefault();

    try {
      // controllo sui campi vuoti o errati
      // in queste circostanze l'evento submit
      // viene fermato
      let flag = true;

      if (
        $("#location").attr("class").includes("is-invalid") ||
        $("#location").val() === ""
      ) {
        flag = false;
        $("#location").addClass("is-invalid");
        return;
      }

      // Se il flag è false allora ci sono campi invalidi
      // quindi ritorno la funzione prevenendo la fetch
      if (!flag) {
        return;
      }
      /* -------- */

      // Viceversa:
      // Memorizzo i parametri del form in apposite variabili
      const citta = $("#location").val();
      let checkin = $("#check-in").val();
      let checkout = $("#check-out").val();
      const nospiti = $("#guestNum").val();

      if (checkin === "" && $("#check-in").hasClass("isEmpty")) {
        $("#check-in").removeClass("isEmpty");
        $("#check-in").focus();
        return;
      } else if (
        checkin !== "" &&
        checkout === "" &&
        $("#check-out").hasClass("isEmpty")
      ) {
        $("#check-out").removeClass("isEmpty");
        $("#check-out").focus();
        return;
      }

      // Se dopo vari tentativi il checkout rimane vuoto, il
      // suo valore viene impostato a quello del checkin

      if (checkin !== "" && checkout === "") {
        checkout = checkin;
      }

      // Reindirizzo alla pagina di ricerca, passando una query
      // nel URL con tutti i relativi parametri di ricerca
      window.location.href = `/search?citta=${citta}&checkin=${checkin}&checkout=${checkout}&nospiti=${nospiti}`;
    } catch (e) {
      console.log(e);
    }
  });
  /* --------------------------------------------------------- */
});