$(document).ready(() => {
  /* LETs & CONSTs */
  // Creo un URL che contenga i miei parametri
  const params = new URLSearchParams(window.location.search);
  const search = window.location.search;
  /* --------------------------------------------------------- */

  /* ON REFRESH */
  // Inserisco nel form di dx i dati relativi alla ricerca attuale
  $("#check-in").val(params.get("checkin"));
  $("#check-out").val(params.get("checkout"));
  $("#guestNum").val(params.get("nospiti"));

  /* --------------------------------------------------------- */

  /* MODAL */
  $("#exampleModal").on("hide.bs.modal", () => {
    $("#left").css("overflow", "scroll");
  });
  /* --------------------------------------------------------- */

  /* BACK BTN */
  $("#back-btn").on("click", () => {
    window.location.href =
      window.location.protocol +
      "//" +
      window.location.host +
      "/search" +
      search;
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
          display: "block",
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
    const checkin = $("#check-in").val();
    const checkout = $("#check-out").val();

    if (checkout === "") {
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
    } else {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      if (checkinDate > checkoutDate) {
        $("#check-in").datepicker("update", checkout);
        params.set("checkin", $("#check-out").val());
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
      }
    }
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

  /* CONTROLLI */
  $("input").each((index, element) => {
    $(element).on("focusout change input", () => {
      if ($(element).val() === "") {
        $(element).addClass("invalid-field is-invalid");
        $("#book-help > small").text(
          "Completa i campi per effettuare la prenotazione"
        );
      } else {
        $(element).removeClass("invalid-field is-invalid");
        if (
          $("input").hasClass("invalid-field is-invalid") ||
          $("input").val() === ""
        ) {
        } else {
          $("#book-help > small").text("");
        }
      }
    });
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  // Fetch informazioni generali dell'inserzione
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

      $("#guestNum").attr("max", response.show.n_ospiti);

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

  /* -------- */
  /* -------- */

  $(".book-btn").on("click", () => {
    // controllo sui campi vuoti o errati
    // in queste circostanze l'evento submit
    // viene fermato
    let flag = true;

    $("input").each((index, element) => {
      if (
        $(element).attr("class").includes("is-invalid") ||
        $(element).val() === ""
      ) {
        $(element).addClass("invalid-field is-invalid");
        $("#book-help > small").text(
          "Completa i campi per effettuare la prenotazione"
        );
        flag = false;
        return;
      }
    });

    if (!flag) {
      return;
    }
    /* -------- */

    // Aggiorno i form di input
    $("input").removeClass("invalid-field is-invalid");
    $("#book-help > small").text("");

    fetch(`/inserzione/prenota?id=${params.get("id")}`)
      .then(async (res) => {
        const response = await res.json();
        if (response.success) {
          window.location.href = `/inserzione/prenota/identify${window.location.search}&price=`;
        } else {
          $("#exampleModal").modal("show");
          $("#left").css("overflow", "hidden");
        }
      })
      .catch((err) => console.log(err));
  });
  /* --------------------------------------------------------- */
});
