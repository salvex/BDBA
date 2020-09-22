/* LETs & CONSTs */
// Espressioni regolari
const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const weakPass = new RegExp("^((?=.*[a-z]).{8,}|(?=.*[a-z])(?=.*[A-Z]).{8,})$");
const mediumPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
const strongPass = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
);
/* --------------------------------------------------------- */

/* ON REFRESH */
// Pulisci i campi del form al aggiorno della pagina
$("input").val("");
/* --------------------------------------------------------- */

/* CONTROLLI */
$("input").each((index, element) => {
  if ($(element).attr("name") === "password") {
    $(element)
      .on("input", (ev) => {
        // Controllo password in imput
        if (strongPass.test($(element).val())) {
          // PASSWORD OTTIMA
          // Rimuovo stati precedenti
          $(element).removeClass("is-invalid");
          $(element).removeClass("weakPass");
          $(element).removeClass("mediumPass");
          $(`#${$(element).attr("name")}Help`).removeClass("text-danger");
          $(`#${$(element).attr("name")}Help`).removeClass("mediumPassHelp");
          // Aggiorno lo stato attuale
          $(element).addClass("strongPass");
          $(`#${$(element).attr("name")}Help`).addClass("strongPassHelp");
          // Modifico il testo dell'etichetta (small[name="password"])
          $(`#${$(element).attr("name")}Help`).text("Ottima password!");
        } else if (mediumPass.test($(element).val())) {
          // PASSWORD MEDIA
          // Rimuovo stati precedenti
          $(element).removeClass("is-invalid");
          $(element).removeClass("weakPass");
          $(element).removeClass("strongPass");
          $(`#${$(element).attr("name")}Help`).removeClass("text-danger");
          $(`#${$(element).attr("name")}Help`).removeClass("strongPassHelp");
          // Aggiorno lo stato attuale
          $(element).addClass("mediumPass");
          $(`#${$(element).attr("name")}Help`).addClass("mediumPassHelp");
          // Modifico il testo dell'etichetta (small[name="password"])
          $(`#${$(element).attr("name")}Help`).text("Buona password");
        } else if (weakPass.test($(element).val())) {
          // PASSWORD DEBOLE
          // Rimuovo stati precedenti
          $(element).removeClass("is-invalid");
          $(element).removeClass("mediumPass");
          $(element).removeClass("strongPass");
          $(`#${$(element).attr("name")}Help`).removeClass("mediumPassHelp");
          $(`#${$(element).attr("name")}Help`).removeClass("strongPassHelp");
          // Aggiorno lo stato attuale
          $(element).addClass("weakPass");
          $(`#${$(element).attr("name")}Help`).addClass("text-danger");
          // Modifico il testo dell'etichetta (small[name="password"])
          $(`#${$(element).attr("name")}Help`).text("Password debole...");
        } else {
          // PASSWORD TROPPO CORTA
          // Rimuovo stati precedenti
          $(element).removeClass("mediumPass");
          $(element).removeClass("strongPass");
          $(`#${$(element).attr("name")}Help`).removeClass("mediumPassHelp");
          $(`#${$(element).attr("name")}Help`).removeClass("strongPassHelp");
          // Aggiorno lo stato attuale
          $(element).addClass("is-invalid");
          $(`#${$(element).attr("name")}Help`).addClass("text-danger");
          // Modifico il testo dell'etichetta (small[name="password"])
          $(`#${$(element).attr("name")}Help`).text(
            "Password troppo corta! Deve essere di almeno 8 caratteri e dovrebbe comprendere un numero e un simbolo"
          );
        }
      })
      .on("focusout", () => {
        if ($(element).val() === "") {
          $(element).removeClass("mediumPass");
          $(element).removeClass("strongPass");
          $(element).removeClass("weakPass");
          $(element).addClass("is-invalid");
          $(`#${$(element).attr("name")}Help`).removeClass("mediumPassHelp");
          $(`#${$(element).attr("name")}Help`).removeClass("strongPassHelp");
          $(`#${$(element).attr("name")}Help`).addClass("text-danger");
          $(`#${$(element).attr("name")}Help`).text("Riempi il campo!");
        }
      });
  } else {
    $(element).on("focusout input", () => {
      if ($(element).val() === "") {
        $(element).removeClass("is-valid");
        $(element).addClass("is-invalid");
        $(`#${$(element).attr("name")}Help`).text("Riempi il campo!");
      } else {
        if ($(element).attr("name") === "confermaPassword") {
          // Controllo campo confermaPassword
          if ($(element).val() !== $("#password").val()) {
            $(element).removeClass("is-valid");
            $(element).addClass("is-invalid");
            $(`#${$(element).attr("name")}Help`).text("I campi non coincidono");
          } else {
            $(element).removeClass("is-invalid");
            $(element).addClass("is-valid");
            $(`#${$(element).attr("name")}Help`).text("");
          }
        } else if ($(element).attr("name") === "email") {
          if (emailRe.test($("#email").val())) {
            $("#email").removeClass("is-invalid");
            $("#email").addClass("is-valid");
            $("#emailHelp").text("");
          } else {
            $("#email").removeClass("is-valid");
            $("#email").addClass("is-invalid");
            $("#emailHelp").text("Formato email errata");
          }
        } else {
          $(element).removeClass("is-invalid");
          $(element).addClass("is-valid");
          $(`#${$(element).attr("name")}Help`).text("");
        }
      }
    });
  }
});
/* --------------------------------------------------------- */

/* OPERAZIONE DI FETCH */
$("form").on("submit", (e) => {
  e.preventDefault();

  // Controllo sui campi vuoti o errati
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

  // Salvo i valori inseriti
  const nome = $("#nome").val();
  const cognome = $("#cognome").val();
  const email = $("#email").val();
  const password = $("#password").val();

  // Metto a schermo uno spinner per tutta la durata del
  // caricamento della fetch
  $("#signup").append(
    "<div class='spinner-container'><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div></div>"
  );

  // Eseguo una POST
  fetch("/signup", {
    method: "POST",
    body: JSON.stringify({ nome, cognome, email, password }),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      const response = await res.json();
      if (response.errors) {
        $(".spinner-container").remove();
        $("#emailHelp").text("L'email inserita è già registrata!");
      } else {
        location.assign("/");
      }
    })
    .catch((err) => {
      console.log("Errore: ", err);
    });
});
/* --------------------------------------------------------- */
