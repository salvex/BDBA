$(document).ready(() => {
  /* LETs & CONSTs */
  /* --------------------------------------------------------- */

  /* ENABLE TOOLTIPS */
  $('[data-toggle="tooltip"]').tooltip();
  /* --------------------------------------------------------- */

  /* FUNCTIONS */
  // Data format function
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  /* --------------------------------------------------------- */

  /* FILTER BTN */
  // Filter button animation
  $("#filter-btn").on("click", () => {
    if ($("#filter-btn > img").hasClass("rotate-right")) {
      $("#filter-btn > img").removeClass("rotate-right");
    } else {
      $("#filter-btn > img").addClass("rotate-right");
    }
  });

  /* NAVBAR */
  $(".profile-circle")
    .css({
      "background-image":
        "url('/uploads/avatarUtente/profile-placeholder.png')",
      "background-size": "cover",
      "background-position": "center",
      width: "50px",
      height: "50px",
      "border-radius": "50%",
      border: "2px solid rgba(0,0,0,.65)",
    })
    .on("click", () => {
      $(".hidden-list").slideToggle();
    });
  $(".profile-circle-mobile").css({
    "background-image": "url('/uploads/avatarUtente/profile-placeholder.png')",
    "background-size": "cover",
    "background-position": "center",
    width: "25px",
    height: "25px",
    "border-radius": "50%",
    border: "2px solid rgba(0,0,0,.65)",
  });
});
