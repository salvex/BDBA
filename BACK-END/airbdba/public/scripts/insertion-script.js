$(document).ready(() => {
  /* LETs & CONSTs */
  // Creo un URL che contenga i miei parametri
  const params = new URLSearchParams(window.location.search);
  /* --------------------------------------------------------- */

  /* BACK BTN */
  // Uso go(-2) e non back() perché devo andare indietro di
  // due posizioni per tornare alla pagina di ricerca.
  // Questo è causato dal fatto che prima io apro una pagina
  // con le informazioni del db. Poi viene fatta una fetch
  // ai server google per ottenere la minimappa che ricarica la pagina.
  // Quindi andando indietro di 1 pagina oscurerei solo la mappa,
  // senza tornare indietro.
  $("#back-btn").on("click", () => {
    window.history.go(-2);
  });
  /* --------------------------------------------------------- */

  /* BOOK BTN */
  $(window).resize(() => {
    if ($("#book-btn").hasClass("toggled")) {
      $("#book-btn").removeClass("toggled");
      if ($(window).width() > "1090") {
        $("#right").toggle("slide");
      }
    } else {
      if ($(window).width() > "1090") {
        $("#right").css({
          display: "flex",
          width: "25%",
        });
        $("#left").css({
          display: "flex",
          width: "75%",
        });
      } else if ($(window).width() > "576") {
        $("#right").css({
          display: "none",
          width: "50%",
        });
        $("#left").css({
          display: "flex",
          width: "100%",
        });
      } else {
        $("#right").css({
          display: "none",
          width: "100%",
        });
      }
    }
  });

  $("#book-btn").on("click", () => {
    if ($("#book-btn").hasClass("toggled")) {
      $("#book-btn").removeClass("toggled");
      if ($(window).width() <= "576") {
        $("#right").toggle("slide");
        $("#left").css("display", "flex");
      } else if ($(window).width() <= "1090") {
        $("#right").toggle("slide");
        $("#left").css("width", "100%");
      }
    } else {
      $("#book-btn").addClass("toggled");
      if ($(window).width() <= "576") {
        $("#right").toggle("slide");
        $("#left").css("display", "none");
      } else if ($(window).width() <= "1090") {
        $("#right").toggle("slide");
        $("#left").css("width", "50%");
      }
    }
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  // Fetch insertion information
  fetch(`/inserzione/res${window.location.search}`)
    .then(async (res) => {
      const response = await res.json();
      console.log(response);
      // Inserisco tutte le informazioni nei vari campi
      // Heading
      $("#insertion-heading > h1").append(response.show.nome_inserzione);
      // Showcase
      // -- Carousel
      $(".carousel-item > img").each((index, element) => {
        $(element).attr(
          "src",
          `${response.show.galleryPath}homePage${index + 1}.jpg`
        );
      });
      // -- Description
      $("#citta > h3").append(response.show.citta);
      $("#desc > p").append(response.show.descrizione);
      $("#desc-rooms > p")
        .append(`${response.show.n_ospiti} ospiti &#8226; 3 stanze da letto`)
        .addClass("text-muted");
      // -- Map
      $("#map > iframe").attr(
        "src",
        `https://www.google.com/maps/embed/v1/place?key=AIzaSyDS70zwyWHYnuia677DVOj8CRqfAzI00Qo
        &q=${response.show.citta}`
      );
      // Inserisco nel form di dx i dati relativi alla ricerca attuale
      // Inserisco i dati
      $("#check-in").val(params.get("checkin"));
      $("#check-out").val(params.get("checkout"));
      $("#guestNum")
        .val(params.get("nospiti"))
        .attr("max", response.show.n_ospiti);

      // Datepicker logic
      $("#check-in").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        startDate: new Date(),
        datesDisabled: response.date,
      });

      $("#check-out").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        startDate: new Date(),
        datesDisabled: response.date,
      });
    })
    .catch((err) => console.log(err));
  /* --------------------------------------------------------- */
});
