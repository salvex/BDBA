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
    // Default export is a4 paper, portrait, using millimeters for units
    var element = document.getElementById("invoice");
    let worker = html2pdf().set(opt).from(element).outputPdf();
    worker.save();
  });
});
