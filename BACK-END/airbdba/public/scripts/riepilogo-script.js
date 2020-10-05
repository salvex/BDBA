$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  $(".pren").append("&#8614; " + params.get("nospiti") + " ospiti");
});
