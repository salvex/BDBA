$("document").ready(() => {
  /* LETs & CONSTs */
  const params = new URLSearchParams(window.location.search);
  /* --------------------------------------------------------- */

  /* ON RELOAD */
  $("#location").val(params.get("citta"));
  $("#check-in").val(params.get("checkin"));
  $("#check-out").val(params.get("checkout"));
  $("#guestNum").val(params.get("nospiti"));

  /* TOOLTIP */
  $("#location").tooltip("disable");
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

  // Datepicker focus
  $("#check-in").on("change", () => {
    $("#check-out").focus();
  });
  /* --------------------------------------------------------- */

  /* CONTROLLI */
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
        $("#check-out").val(checkin);
      }

      if ($("#guestNum").val() === "") {
        $("#guestNum").focus().val("1");
      } else {
        $("#guestNum").focus();
      }
    }
  });

  // Controllo campi form ricerca
  $("#location").on("focusout input", () => {
    if ($("#location").val() === "") {
      $("#location").addClass("is-invalid");
      $("#location").tooltip("enable").tooltip("show");
    } else {
      $("#location").removeClass("is-invalid");
      $("#location").tooltip("disable");
    }
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  fetch(`/search/res${window.location.search}`)
    .then(async (res) => {
      const response = await res.json();

      if (response.search_list.length === 0) {
        // Se non ci sono stati risultati con la ricerca
        // Stampo un messaggio di errore.
        $("#content").append(
          `<h2 class="text-danger" style="text-align:center">OPS... Nessuna inserzione per la destinazione scelta!</h2>`
        );
      } else {
        // Salvo la lista nella variabile
        response_list = response.search_list;

        // Itero la lista e per ogni inserzione creo una card
        response_list.forEach((element, index) => {
          // Creo una card generica che mantiene le informazioni
          // per ogni record nell'array. I record corrispondono
          // alle tuple risultato della della query eseguita sul
          // database.
          const card = `
            <div class="card">
                <div class="card-body-container">
                    <div class="img-container">
                        <img
                            class="card-img-top"
                            src="${element.galleryPath}"
                            alt="Card image cap"
                        />
                    </div>
                    <div class="card-body">
                    <div class="title">
                        <h2>
                        <strong> ${element.nome_inserzione} </strong>
                        </h2>
                    </div>
                    <div class="citta">
                        <h4>
                        <i> ${element.citta} </i>
                        </h4>
                    </div>
                    <div class="descrizione">
                        <p>${element.descrizione}</p>
                    </div>
                    </div>
                </div>
                <div class="card-footer text-success">
                    <div class="btn-container">
                    <button id="${element.id_inserzione}" class="btn btn-primary">
                        Visita inserzione
                    </button>
                    </div>
                    <div class="price">
                    <i>${element.prezzo_base} &euro;</i>
                    </div>
                </div>
                </div>`;

          // Inserisco la card nel contenitore
          $("#content").append(card);
          // Ad ogni card inserita nel DOM lego una funzione
          // Ogni funzione è indipendente dalle altre in quanto legata
          // ad un bottone con id unico.
          $(`#${element.id_inserzione}`).on("click", () => {
            window.location.href = `/inserzione${window.location.search}&id=${element.id_inserzione}`;
          });
        });
      }
    })
    .catch((err) => console.log(err));

  /* -------- */
  /* -------- */

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

      if (!flag) {
        return;
      }
      /* -------- */

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
