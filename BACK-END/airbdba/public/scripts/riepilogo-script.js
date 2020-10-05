$(document).ready(function () {
  const opt = {
    filename:
      "Prenotazione " +
      new Date().getFullYear() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getDay() +
      ".pdf",
    enableLinks: false,
  };
  const params = new URLSearchParams(window.location.search);
  $(".pren").prepend(() => {
    return params.get("nospiti") == 1
      ? "&#8614; " + params.get("nospiti") + " ospite"
      : "&#8614; " + params.get("nospiti") + " ospiti";
  });
  $("#notti").append(params.get("notti"));
  $("#tot").append(params.get("prezzo"));

  $("#confirm-btn").on("click", () => {
    fetch(`/inserzione/prenota/riepilogo${window.location.search}`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.success) {
          window.location.href = `/inserzione/prenota/riepilogo${window.location.search}`;
        }
      })
      .catch((err) => console.log(err));
  });
});
