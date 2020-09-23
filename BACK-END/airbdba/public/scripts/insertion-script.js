$(document).ready(() => {
  /* LETs & CONSTs */
  // Creo un URL che contenga i miei parametri
  const params = new URLSearchParams(window.location.search);
  /* --------------------------------------------------------- */

  /* BACK BTN */
  $("#back-btn").on("click", () => {
    window.history.go(-2);
  });
  /* --------------------------------------------------------- */

  /* BOOK BTN */
  $(window).resize(() => {
    if ($("#book-menu").hasClass("toggled")) {
      $("#book-menu").removeClass("toggled");
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

  $("#book-menu").on("click", () => {
    if ($("#book-menu").hasClass("toggled")) {
      $("#book-menu").removeClass("toggled");
      if ($(window).width() <= "576") {
        $("#right").toggle("slide");
        $("#left").css("display", "flex");
      } else if ($(window).width() <= "1090") {
        $("#right").toggle("slide");
        $("#left").css("width", "100%");
      }
    } else {
      $("#book-menu").addClass("toggled");
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

  /* MODIFICO CHECKIN/OUT E NOSPITI */
  // Se l'utente desidera può modificare le date di checkin e checkout
  // e il numero degli ospiti, tramite un apposito form.
  // CHECKIN
  $("#check-in").on("change", () => {
    params.set("checkin", $("#check-in").val());
    window.history.pushState(
      "",
      "",
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        params.toString()
    );
  });
  // CHECKOUT
  $("#check-out").on("change", () => {
    // controllo sul campo di checkout
    const checkin = $("#check-in").val();
    const checkout = $("#check-out").val();

    // Controllo se il campo check in è vuoto
    // oppure se viene inserito un checkout
    // inferiore al checkin
    if (checkin === "") {
      $("#check-out").val("");
      $("#check-in").focus();
    } else {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      if (checkoutDate < checkinDate) {
        $("#check-out").datepicker("update", checkin);
        params.set("checkout", $("#check-out").val());
        window.history.pushState(
          "",
          "",
          window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            params.toString()
        );
      } else {
        params.set("checkout", $("#check-out").val());
        window.history.pushState(
          "",
          "",
          window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            params.toString()
        );
      }
    }

    window.history.pushState(
      "",
      "",
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        params.toString()
    );
  });
  // N_OSPITI
  $("#guestNum").on("change", () => {
    params.set("nospiti", $("#guestNum").val());
    window.history.pushState(
      "",
      "",
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        params.toString()
    );
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
