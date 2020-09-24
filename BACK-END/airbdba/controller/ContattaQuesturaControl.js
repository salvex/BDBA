var transporter = require("../utils/mailSender");
const contattaQuestura_get = (req, res) => {
  // pagina contatta questura
};

const contattaQuestura_post = async (req, res) => {
  const data_arrivo = req.body.data_arrivo;
  const data_partenza = req.body.data_partenza;
  const ospiti = req.body.ospiti;

  let bodyMail = {
    from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
    to: "questura@gmail.com",
    subject: "Comunicazione presenza ospiti",
    text: "Comunicazione relativa alla presenza di ospiti presso una struttura",
    html: "<b>RIEPILOGO PLACEHOLDER</b>",
  };

  await transporter.sendMail(bodyMail, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Messaggio inviato: %s", info.messageId);
  });
};

module.exports = { contattaQuestura_get, contattaQuestura_post };
