$(document).ready(() => {
  /* LETs & CONSTs */
  const params = new URLSearchParams(window.location.search);
  /* --------------------------------------------------------- */

  /* TOOLTIP */
  $('[data-toggle="tooltip"]').tooltip();
  /* --------------------------------------------------------- */

  /* OPERAZIONE DI FETCH */
  $("button").on("click", () => {
    // controllo sui campi vuoti o errati
    // in queste circostanze l'evento submit
    // viene fermato
    let flag = true;

    $("input[type=text]").each((index, element) => {
      if (
        $(element).prop("class").includes("is-invalid") ||
        $(element).val() === ""
      ) {
        $(element).addClass("is-invalid");
        flag = false;
        return;
      }
    });

    $("div[id^='gender']").each((index, element) => {
      if ($(`input[name="gender-${index}"]:checked`).length === 0) {
        $("div[id^='gender'] > small").text("Hai dimenticato questo campo");
        flag = false;
        return;
      }
    });

    if (!flag) {
      return;
    }
    /* -------- */
    $("div[id^='gender'] > small").text("");

    // Generazione array di oggetti
    let ospiti = [];

    for (let i = 0; i < params.get("nospiti"); i += 1) {
      let ospite = {
        nome: $(`#name-${i}`).val(),
        cognome: $(`#surname-${i}`).val(),
        sesso: $(`input[name=gender-${i}]:checked`).val(),
        isEsente: $(`#es-${i}`).prop("checked") ? 1 : 0,
        ref_prenotazione_u: "",
      };
      ospiti.push(ospite);
    }

    console.log(ospiti);

    fetch(`/inserzione/prenota/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ospiti }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.success) {
          window.location.href = `/inserzione/prenota/pagamento${window.location.search}`;
        }
      })
      .catch((err) => console.log(err));
  });
});
