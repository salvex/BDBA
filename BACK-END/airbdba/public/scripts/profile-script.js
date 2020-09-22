$(document).ready(() => {
  // LO SCRIPT È CONDIVISO TRA LE ROTTE "PROFILE" E "MODIFICAPASSWORD"

  /* ON REFRESH */
  // Modifico la navbar modificando l'opzione profilo,
  // ridondante in quanto riporta alla stessa pagina
  // e la trasformo nell'opzione "Home"
  $("#profile-nav").attr("href", "/").text("Home");
  /* --------------------------------------------------------- */

  /* MODIFICAPASSWORD */
  /* LETs & CONSTs */
  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const weakPass = new RegExp(
    "^((?=.*[a-z]).{8,}|(?=.*[a-z])(?=.*[A-Z]).{8,})$"
  );
  const mediumPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$");
  const strongPass = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
  );
  /* --------------------------------------------------------- */

  /* BACK-BTN */
  $("#back-btn").on("click", () => {
    window.history.back();
  });
  /* --------------------------------------------------------- */

  /* CONTROLLO */
  // controllo campi
  const $input = $("input");
  $input.each((index, element) => {
    if ($(element).attr("id") === "newPass") {
      $(element)
        .on("input", (ev) => {
          // controllo password in imput
          if (strongPass.test($(element).val())) {
            // PASSWORD OTTIMA
            // rimuovo stati precedenti
            $(element).removeClass("is-invalid");
            $(element).removeClass("weakPass");
            $(element).removeClass("mediumPass");
            $(`.${$(element).attr("id")}Help`).removeClass("text-danger");
            $(`.${$(element).attr("id")}Help`).removeClass("mediumPassHelp");
            // aggiorno lo stato attuale
            $(element).addClass("strongPass");
            $(`.${$(element).attr("id")}Help`).addClass("strongPassHelp");
            // modifico il testo dell'etichetta (small[id="password"])
            $(`.${$(element).attr("id")}Help`).text("Ottima password!");
          } else if (mediumPass.test($(element).val())) {
            // PASSWORD MEDIA
            // rimuovo stati precedenti
            $(element).removeClass("is-invalid");
            $(element).removeClass("weakPass");
            $(element).removeClass("strongPass");
            $(`.${$(element).attr("id")}Help`).removeClass("text-danger");
            $(`.${$(element).attr("id")}Help`).removeClass("strongPassHelp");
            // aggiorno lo stato attuale
            $(element).addClass("mediumPass");
            $(`.${$(element).attr("id")}Help`).addClass("mediumPassHelp");
            // modifico il testo dell'etichetta (small[id="password"])
            $(`.${$(element).attr("id")}Help`).text("Buona password");
          } else if (weakPass.test($(element).val())) {
            // PASSWORD DEBOLE
            // rimuovo stati precedenti
            $(element).removeClass("is-invalid");
            $(element).removeClass("mediumPass");
            $(element).removeClass("strongPass");
            $(`.${$(element).attr("id")}Help`).removeClass("mediumPassHelp");
            $(`.${$(element).attr("id")}Help`).removeClass("strongPassHelp");
            // aggiorno lo stato attuale
            $(element).addClass("weakPass");
            $(`.${$(element).attr("id")}Help`).addClass("text-danger");
            // modifico il testo dell'etichetta (small[id="password"])
            $(`.${$(element).attr("id")}Help`).text("Password debole...");
          } else {
            // PASSWORD TROPPO CORTA
            // rimuovo stati precedenti
            $(element).removeClass("mediumPass");
            $(element).removeClass("strongPass");
            $(`.${$(element).attr("id")}Help`).removeClass("mediumPassHelp");
            $(`.${$(element).attr("id")}Help`).removeClass("strongPassHelp");
            // aggiorno lo stato attuale
            $(element).addClass("is-invalid");
            $(`.${$(element).attr("id")}Help`).addClass("text-danger");
            // modifico il testo dell'etichetta (small[id="password"])
            $(`.${$(element).attr("id")}Help`).text(
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
            $(`.${$(element).attr("id")}Help`).removeClass("mediumPassHelp");
            $(`.${$(element).attr("id")}Help`).removeClass("strongPassHelp");
            $(`.${$(element).attr("id")}Help`).addClass("text-danger");
            $(`.${$(element).attr("id")}Help`).text("Riempi il campo!");
          }
        });
    } else {
      $(element).on("focusout input", () => {
        if ($(element).val() === "") {
          $(element).removeClass("is-valid");
          $(element).addClass("is-invalid");
          $(`.${$(element).attr("id")}Help`).text("Riempi il campo!");
        } else {
          if ($(element).attr("id") === "newPassVerify") {
            // verifica campo newPassVerify
            if ($(element).val() !== $("#newPass").val()) {
              $(element).removeClass("is-valid");
              $(element).addClass("is-invalid");
              $(`.${$(element).attr("id")}Help`).text("I campi non coincidono");
            } else {
              $(element).removeClass("is-invalid");
              $(element).addClass("is-valid");
              $(`.${$(element).attr("id")}Help`).text("");
            }
          } else if ($(element).attr("id") === "email") {
            if ($("#email").val() !== "<%= user.email %>") {
              $("#email").removeClass("is-valid");
              $("#email").addClass("is-invalid");
              $(".emailHelp").text("L'email non combacia");
            } else {
              $("#email").removeClass("is-invalid");
              $("#email").addClass("is-valid");
              $(".emailHelp").text("");
            }
          } else {
            $(element).removeClass("is-invalid");
            $(element).addClass("is-valid");
            $(`.${$(element).attr("id")}Help`).text("");
          }
        }
      });
    }
  });
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  // Invio dei dati di registrazione
  $("form").on("submit", (e) => {
    e.preventDefault();

    // controllo sui campi vuoti o errati
    // in queste circostanze l'evento submit
    // viene fermato
    let flag = true;

    $input.each((index, element) => {
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

    // salvo i valori inseriti
    const email = $("#email").val();
    const vecchiaPsw = $("#oldPass").val();
    const nuovaPsw = $("#newPass").val();

    // simulo un caricamento mediante uno spinner
    const $profile = $("#profile-wrapper");
    $profile.append(
      "<div class='spinner-container'><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div></div>"
    );
    // eseguo una POST
    fetch("/user/profilo/modifica-password", {
      method: "POST",
      body: JSON.stringify({ email, vecchiaPsw, nuovaPsw }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const response = await res.json();
        if (res.error) {
          $(".spinner-container").remove();
          $(".oldPassHelp").text("La password non combacia");
        } else {
          location.assign("/user");
        }
      })
      .catch((err) => console.log("Error: ", err));

    $(".spinner-container").remove();
  });
});
