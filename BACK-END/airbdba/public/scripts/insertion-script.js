$(document).ready(() => {
  /* LETs & CONSTs */
  // Creo un URL che contenga i miei parametri
  const params = new URLSearchParams(window.location.search);
  const search = window.location.search;
  let prezzoBase,
    nospiti,
    checkin,
    checkout,
    checkinDate,
    checkoutDate,
    nights,
    prezzoPerNotte,
    prezzoNotteServizio,
    prezzoTotale;
  /* --------------------------------------------------------- */

  /* ON REFRESH */
  // Inserisco nel form di dx i dati relativi alla ricerca attuale
  $("#check-in").val(params.get("checkin"));
  $("#check-out").val(params.get("checkout"));
  $("#guestNum").val(params.get("nospiti"));

  checkin = params.get("checkin");
  checkout = params.get("checkout");

  if (checkin && checkout) {
    checkinDate = new Date(checkin);
    checkoutDate = new Date(checkout);

    // Se prenoto per un giorno pagherò l'intera giornata
    // come se pernottassi
    if (checkin === checkout) {
      nights = 1;
    } else {
      nights = (checkoutDate - checkinDate) / (1000 * 3600 * 24);
    }
  } else {
    nights = 0;
  }

  /* --------------------------------------------------------- */

  /* MODAL */
  $("#exampleModal").on("hide.bs.modal", () => {
    $("#left").css("overflow", "scroll");
  });

  $("#mapModal").on("hide.bs.modal", () => {
    $("#left").css("overflow", "scroll");
    $("#map").prepend("<div id='overlay'></div>");
    $("#modal-map").attr("src", $("#map > iframe").attr("src"));
    $("#overlay").on("click", () => {
      $("#mapModal").modal("show");
      $("#overlay").remove();
    });
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

        // Aggiorno il contenuto del riquadro di sx
        $("#showcase").css({
          "flex-direction": "row",
        });
        $("#carousel-container").css({
          width: "60%",
        });
        $("#description").css({
          width: "40%",
          "padding-left": "30px",
          margin: "0",
        });

        // Aggiungo un overlay alla mappa
        if ($("#overlay").length === 0) {
          $("#map").prepend("<div id='overlay'></div>");
          $("#modal-map").attr("src", $("#map > iframe").attr("src"));
          $("#overlay").on("click", () => {
            $("#mapModal").modal("show");
            $("#overlay").remove();
          });
        }
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

        // Aggiorno il contenuto del riquadro di sx
        $("#showcase").css({
          "flex-direction": "row",
        });
        $("#carousel-container").css({
          width: "60%",
        });
        $("#description").css({
          width: "40%",
          "padding-left": "30px",
          margin: "0",
        });

        // Aggiungo un overlay alla mappa
        if ($("#overlay").length === 0) {
          $("#map").prepend("<div id='overlay'></div>");
          $("#modal-map").attr("src", $("#map > iframe").attr("src"));
          $("#overlay").on("click", () => {
            $("#mapModal").modal("show");
            $("#overlay").remove();
          });
        }
      } else if ($(window).width() > "576") {
        $("#right").css({
          display: "none",
          width: "50%",
        });
        $("#left").css({
          display: "flex",
          width: "100%",
        });

        // Aggiorno il contenuto del riquadro di sx
        $("#showcase").css({
          "flex-direction": "column",
        });
        $("#carousel-container").css({
          width: "100%",
        });
        $("#description").css({
          width: "100%",
          padding: "0",
          "margin-top": "30px",
        });

        // Rimuovo l'overlay
        if ($("#overlay").length > 0) {
          $("#overlay").remove();
        }
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

  /* INSERTION DETAIL SCREEN (LEFT) */
  $(window).resize(() => {
    if ($("#shocase").width() <= "768") {
      alert("ciao");
    }
  });
  /* --------------------------------------------------------- */

  /* MODIFICO CHECKIN/OUT E NOSPITI */
  // Se l'utente desidera può modificare le date di checkin e checkout
  // e il numero degli ospiti, tramite un apposito form.
  // CHECKIN
  $("#check-in").on("change", () => {
    checkin = $("#check-in").val();
    checkout = $("#check-out").val();

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
    nospiti = $("#guestNum").val();
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

  /* RIEPILOGO/RECAP */
  $("input").each((index, element) => {
    $(element).on("focusout change input", () => {
      if ($(element).attr("id") === "check-in") {
        checkin = $("#check-in").val();
      } else if ($(element).attr("id") === "check-out") {
        checkout = $("#check-out").val();
      } else {
        nospiti = $("#guestNum").val();
      }

      $("#total").html(`
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      `);

      setTimeout(() => {
        if (checkin && checkout) {
          checkinDate = new Date(checkin);
          checkoutDate = new Date(checkout);

          // Se prenoto per un giorno pagherò l'intera giornata
          // come se pernottassi
          if (checkin === checkout) {
            nights = 1;
          } else {
            nights = (checkoutDate - checkinDate) / (1000 * 3600 * 24);
          }
          $("#nights").html(nights);
          $("#check-in-value").html(checkin);
          $("#check-out-value").html(checkout);

          prezzoPerNotte = nights * prezzoBase;
          prezzoNotteServizio = prezzoPerNotte + prezzoPerNotte * 0.07;
          prezzoTotale = prezzoNotteServizio + prezzoNotteServizio * 0.1;

          $("#total").html(prezzoTotale.toPrecision(4) + " &euro;");
        } else {
          $("#total").html("0 &euro;");
        }
      }, 1000);
    });
  });

  $("input").on("focusout change input", () => {});

  /* ON REFRESH */
  $("#check-in-value").html(checkin);
  $("#check-out-value").html(checkout);
  $("#nights").html(nights);
  $("#servizio").html("7%");
  $("#iva").html("10%");
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  // Fetch informazioni generali dell'inserzione
  fetch(`/inserzione/res${window.location.search}`)
    .then(async (res) => {
      const response = await res.json();

      /* checkin = $("#check-in").val();
      checkout = $("#check-out").val();
      nospiti = $("#guestNum").val(); */
      checkin = params.get("checkin");
      checkout = params.get("checkout");
      nospiti = params.get("nospiti");
      prezzoBase = response.show.prezzo_base;

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

      // Imposto il valore massimo dell'ìnput ospiti
      $("#guestNum").attr("max", response.show.n_ospiti);

      // Inserisco le date disabilitate, ossia quelle relative
      // a giorni già prenotati da altri
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

      // Per rendere le cose graficamente mugliori
      // inserisco uno spinner al posto del prezzo
      // per simulare un caricamento
      $("#total").html(`
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      `);

      // Aggiungo un overlay alla mappa
      if ($("#overlay").length === 0) {
        $("#map").prepend("<div id='overlay'></div>");
        $("#modal-map").attr("src", $("#map > iframe").attr("src"));
        $("#overlay").on("click", () => {
          $("#mapModal").modal("show");
          $("#overlay").remove();
        });
      }

      // Calcolo il prezzo totale in base ai giorni (-1)
      // cioè calcolo il numero di notti. Tutto moltiplicato
      // per il numero di ospiti. Lospinner viene rimosso
      // da uno dei due metodi html
      setTimeout(() => {
        if (checkin && checkout) {
          checkinDate = new Date(checkin);
          checkoutDate = new Date(checkout);

          // Se prenoto per un giorno pagherò l'intera giornata
          // come se pernottassi
          if (checkin === checkout) {
            nights = 1;
          } else {
            nights = (checkoutDate - checkinDate) / (1000 * 3600 * 24);
          }

          prezzoPerNotte = nights * prezzoBase;
          prezzoNotteServizio = prezzoPerNotte + prezzoPerNotte * 0.07;
          prezzoTotale = prezzoNotteServizio + prezzoNotteServizio * 0.1;

          $("#total").html(prezzoTotale.toPrecision(4) + " &euro;");
        } else {
          $("#total").html("0 &euro;");
        }
      }, Math.floor(Math.random() * 2000) + 1);
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

    fetch(`/inserzione/prenota?id=${params.get("id")}`, {
      method: "GET",
      redirect: "follow",
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.success) {
          window.location.href = `/inserzione/prenota/pagamento${window.location.search}&notti=${nights}&prezzo=${prezzoTotale}`;
        } else {
          $("#exampleModal").modal("show");
          $("#left").css("overflow", "hidden");
        }
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  });
  /* --------------------------------------------------------- */
});
