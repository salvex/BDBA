$(document).ready(() => {
  /* LETs & CONSTs */
  // e-mail regex
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* --------------------------------------------------------- */

  /* ON REFRESH */
  // Pulisci i campi del form al aggiorno della pagina
  $("input").val("");
  /* --------------------------------------------------------- */

  /* CONTROLLI */
  // controllo mail
  $("#email").on("focusout input", () => {
    if ($("#email").val() === "") {
      $("#email").removeClass("is-valid");
      $("#email").addClass("is-invalid");
      $("#emailHelp").text("Inserisci una mail!");
    } else {
      if (re.test($("#email").val())) {
        $("#email").removeClass("is-invalid");
        $("#email").addClass("is-valid");
        $("#emailHelp").text("");
      } else {
        $("#email").removeClass("is-valid");
        $("#email").addClass("is-invalid");
        $("#emailHelp").text("Formato email errata");
      }
    }
  });

  // controllo password
  $("#password").on("focusout input", () => {
    if ($("#password").val() === "") {
      $("#password").addClass("is-invalid");
      $("#passwordHelp").text("Inserisci una password!");
    } else {
      $("#password").removeClass("is-invalid");
      $("#passwordHelp").text("");
    }
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  $("form").on("submit", (e) => {
    e.preventDefault();

    // controllo sui campi vuoti o errati
    // in queste circostanze l'evento submit
    // viene fermato
    let flag = true;

    $("input").each((index, element) => {
      if (
        $(element).attr("class").includes("is-invalid") ||
        $(element).val() === ""
      ) {
        flag = false;
        return;
      }
    });

    if (!flag) {
      return;
    }
    /* -------- */

    // Svuoto i small che contrassegnano gli errori
    // dei campi
    $("#emailHelp").text("");
    $("#passwordHelp").text("");

    // Salvo i valori degli input in apposite variabili
    const email = $("#email").val();
    const password = $("#password").val();

    // Metto a schermo uno spinner per tutta la durata del
    // caricamento della fetch
    $("#login").append(`
      <div class="spinner-container">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `);

    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.errors) {
          $(".spinner-container").remove();
          $("#emailHelp").text(response.errors.email);
          $("#passwordHelp").text(response.errors.password);
        }
        if (response.success) {
          location.assign("/");
        }
      })
      .catch((err) => {
        console.log("Errore: ", err);
      });
  });
});
