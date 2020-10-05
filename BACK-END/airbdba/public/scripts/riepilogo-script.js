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
  $(".pren").append("&#8614; " + params.get("nospiti") + " ospiti");

  $("#confirm-btn").on("click", () => {
    // Default export is a4 paper, portrait, using millimeters for units
    var element = document.getElementById("invoice");
    let worker = html2pdf().set(opt).from(element).outputPdf();
    worker.save();
  });
});
