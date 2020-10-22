const db = require("../utils/connection.js");
const Utente = require("../model/Utente");
const Inserzione = require("../model/Inserzione");
const Servizi = require("../model/Servizi");
const Ospite = require("../model/Ospite");
require("dotenv").config();
const JwtToken = require("../utils/JwtToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const Prenotazione = require("../model/Prenotazione.js");
var transporter = require("../utils/mailSender");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const PDFDocument = require("pdfkit");

const maxAge = 60 * 60 * 24;

var errorsHandler = (err) => {
  let errors = { email: "", query: "", ins: "" };

  if (err.message === "Utente non aggiornato") {
    errors.email = "L'Utente non è riuscito a diventare host";
  } else if (err.message === "query vuota") {
    errors.query = "L'inserimento non è andato a buon termine";
  } else if (err.message === "Nessuna inserzione") {
    errors.ins = "Nessuna inserzione creata";
  }

  return errors;
};

const become_host_get = async (req, res) => {
  try {
    var host = await Utente.diventaHost(req.session.utente.id); //test
    var token_host = JwtToken.createTokenHost(req.session.utente.id);
    res.cookie("host", token_host, {
      httpOnly: true,
      expiresIn: maxAge * 1000,
    });
    req.session.utente = host;
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const aggiungi_inserzione_post = async (req, res) => {
  try {
    const {
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      tassa,
      servizi,
    } = JSON.parse(req.body.inserzione);

    const id_host = req.session.utente.id;

    let path = "";
    for (let i = 0; i < req.files["gallery"].length - 1; i++) {
      path += req.files["gallery"][i].path.split("fotoInserzione")[1] + ",";
    }
    path += req.files["gallery"][req.files["gallery"].length - 1].path.split(
      "fotoInserzione"
    )[1];
    path = path.replace(/\\/g, "/");

    var inserzione = await Inserzione.aggiungiInserzione(
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      tassa,
      id_host,
      path,
      servizi
    );
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const gestione_host_get = async (req, res, next) => {
  try {
    const id_host = req.session.utente.id;
    var prenotazioni = await Prenotazione.findAll({
      where: { ref_host: id_host },
      include: [
        {
          model: Utente,
          required: true,
          attributes: ["email", "nome", "cognome"],
        },
        {
          model: Inserzione,
          required: true,
        },
        {
          model: Ospite,
          required: false,
          as: "ospiti",
        },
      ],
    });
    var lista = await Inserzione.processaLista(id_host);
    res.locals.inserzioni = JSON.stringify(lista);
    res.locals.prenotazioni = JSON.stringify(prenotazioni);
    next();
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const modifica_inserzione_put = async (req, res) => {
  try {
    const {
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      tassa,
      servizi,
      imgToSave,
      imgToDel,
      id_ins,
    } = JSON.parse(req.body.inserzione);

    const id_host = req.session.utente.id;

    let path;
    if (req.files["gallery"]) {
      if (imgToSave.length > 0) {
        path = imgToSave.reduce((x, y) => x + "," + y) + ",";
      } else {
        path = "";
      }
      for (let i = 0; i < req.files["gallery"].length - 1; i++) {
        path += req.files["gallery"][i].path.split("fotoInserzione")[1] + ",";
      }
      path += req.files["gallery"][req.files["gallery"].length - 1].path.split(
        "fotoInserzione"
      )[1];
    } else {
      if (imgToSave.length > 0) {
        path = imgToSave.reduce((x, y) => x + "," + y);
      } else {
        path = "";
      }
    }
    path = path.replace(/\\/g, "/");

    imgToDel.forEach((img, index) => {
      fs.unlink(`public/uploads/fotoInserzione${img}`, (err) => {
        if (err) throw err;
        console.log(img + " eliminata!");
      });
    });

    let inserzioneM = await Inserzione.findByPk(id_ins);
    inserzioneM.nome_inserzione = nome;
    inserzioneM.citta = citta;
    inserzioneM.inizioDisponibilita = inizioDisp;
    inserzioneM.fineDisponibilita = fineDisp;
    inserzioneM.n_ospiti = nospiti;
    inserzioneM.descrizione = desc;
    inserzioneM.indirizzo = indirizzo;
    inserzioneM.tassa_soggiorno = tassa;
    inserzioneM.prezzo_base = prezzo;
    inserzioneM.galleryPath = path;
    await inserzioneM.save();

    let serviziM = await Servizi.findByPk(id_ins);
    serviziM.wifiFlag = servizi["wifiModal"];
    serviziM.riscaldamentoFlag = servizi["riscaldamentoModal"];
    serviziM.frigoriferoFlag = servizi["frigoriferoModal"];
    serviziM.casaFlag = servizi["casaModal"];
    serviziM.bnbFlag = servizi["bnbModal"];
    serviziM.parcheggioFlag = servizi["parcheggioModal"];
    serviziM.ascensoreFlag = servizi["ascensoreModal"];
    serviziM.cucinaFlag = servizi["cucinaModal"];
    serviziM.essenzialiFlag = servizi["essenzialiModal"];
    serviziM.piscinaFlag = servizi["piscinaModal"];
    await serviziM.save();
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const cancella_inserzione_delete = async (req, res) => {
  try {
    const { id_inserzione } = req.body;
    var deleteIns = await Inserzione.findByPk(id_inserzione);

    let path =
      `public/uploads/fotoInserzione/` +
      req.session.utente.id +
      deleteIns.galleryPath.slice(0, 14);
    //Prendo le email degli utenti associati alle prenotazioni della relativa insserzione // DA INSERIRE
    const mailList = await Prenotazione.getEmailUtentiPren(id_inserzione);
    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
      bcc: mailList,
      subject:
        "Cancellazione Prenotazione presso struttura: " +
        deleteIns.nome_inserzione,
      text: `Le comunichiamo che l'host ha cancellato la sua prenotazione presso la struttura. \n\n Cordiali Saluti, Team AIRBDBA`,
    };

    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });

    //elimino l'inserzione
    await deleteIns.destroy();

    // elimino ricorsivamente le la cartella e i file all'interno
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log(`File eliminati`);
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const accetta_prenotazione_get = async (req, res) => {
  try {
    var acceptPren = await Prenotazione.findByPk(req.params.id_pren);
    acceptPren.stato_prenotazione = 2;
    let user = await Utente.findByPk(acceptPren.ref_utente);
    await acceptPren.save();

    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
      bcc: user.email,
      subject:
        "Comunicazione relativa alla renotazione ID: " +
        acceptPren.id_prenotazione,
      text:
        "Congratulazione! Le comunichiamo che l'host ha accettato la sua richiesta di prenotazione. \n\n Cordiali Saluti, Team AIRBDBA",
    };

    /* await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    }); */

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const rifiuta_prenotazione_get = async (req, res) => {
  try {
    var refusePren = await Prenotazione.findByPk(req.params.id_pren);
    refusePren.stato_prenotazione = 0;
    let user = await Utente.findByPk(refusePren.ref_utente);

    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
      bcc: user.email,
      subject:
        "Comunicazione relativa a Prenotazione ID: " +
        refusePren.id_prenotazione,
      text:
        "Siamo spiacenti. Le comunchiamo che l'host ha rifiutato la sua richiesta di prenotazione. \n\n Cordiali Saluti, Team AIRBDBA",
    };

    /* await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    }); */
    await refusePren.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const cancella_prenotazione_delete = async (req, res) => {
  try {
    await Prenotazione.destroy({
      where: { id_prenotazione: req.params.id_pren },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const contatta_utente_post = async (req, res) => {
  try {
    const { user_email, message, titolo } = req.body;

    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
      to: user_email,
      replyTo: req.session.utente.email,
      subject:
        "Comunicazione dall'Host " +
        req.session.utente.nome +
        " " +
        req.session.utente.cognome,
      text:
        'Comunicazione relativa alla prenotazione "' +
        titolo +
        '"\n\n' +
        message,
    };
    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const contatta_turismo_get = async (req, res) => {
  try {
    var totaleRendiconto = 0;
    var rendiconto = [];
    const prenotazioni = req.body;
    prenotazioni.forEach((prenotazione) => {
      prenotazione.ospiti.forEach((ospite) => {
        if (prenotazione.turismoFlag === 0 && ospite.isEsente === 0) {
          totaleRendiconto +=
            prenotazione.inserzione.tassa_soggiorno *
            moment(prenotazione.check_out).diff(
              moment(prenotazione.check_in),
              "days"
            );
        }
      });
      var value = {
        check_in: prenotazione.check_in,
        check_out: prenotazione.check_out,
        questuraFlag: prenotazione.questuraFlag,
        turismoFlag: prenotazione.turismoFlag,
        ospiti: prenotazione.ospiti,
      };
      rendiconto.push(value);
    });
    res.json({ rendiconto, totaleRendiconto });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const contatta_turismo_post = async (req, res) => {
  let { rendiconto, totaleRendiconto } = JSON.parse(req.fields.rendiconto);
  const newpathfile =
    req.files.ricevuta.path + path.extname(req.files.ricevuta.name);
  console.log(newpathfile);

  fs.rename(req.files.ricevuta.path, newpathfile, () => {
    console.log("File rinominato");
  });

  const doc = new PDFDocument();
  doc
    .text("Rendiconto tasse di soggiorno", {
      width: 400,
      align: "center",
    })
    .moveDown();
  doc.text(
    `Proprietario struttura: ${req.session.utente.nome} ${req.session.utente.cognome}`
  );
  doc.text(`Totale rendiconto: ${totaleRendiconto}`).moveDown();
  rendiconto.forEach((element) => {
    doc.text(`Arrivo: ${element.check_in}  Partenza: ${element.check_out}`);
    element.ospiti.forEach((ospite) => {
      doc.text(`Nome: ${ospite.nome}`);
      doc.text(`Cognome: ${ospite.cognome}`);
      doc.text(`Data di nascita: ${ospite.data_nascita}`);
      doc.text(`Data di nascita: ${ospite.nazionalita}`);
      if (ospite.isEsente === 1) {
        doc.text("Esente").moveDown();
      } else {
        doc.text("Non esente").moveDown();
      }
    });
  });
  doc.end();

  let bodyMail = {
    from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
    bcc: "marcodaleo114@gmail.com", //PER TESTARE IL CONTENUTO DELLA MAIL RICEVUTA, INSERIRE IL PRIMO INDIRIZZO EMAIL
    subject: "Rendiconto tasse di soggiorno",
    text: `In allegato alla presente email: \n-generalita degli ospiti e periodo in cui hanno soggiornato presso la struttura turistica del sottoscritto; \n- ricevuta dell'effetivo pagamento della tasse di soggiorno presso il comune\n\n Cordiali Saluti, ${req.session.utente.nome} ${req.session.utente.cognome}`,
    attachments: [
      {
        filename: "generalita.pdf",
        content: doc,
      },
      {
        filename: "ricevuta" + path.extname(req.files.ricevuta.name),
        content: fs.createReadStream(newpathfile),
      },
    ],
  };

  await transporter.sendMail(bodyMail, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Messaggio inviato: %s", info.messageId);
  });

  let prenList = [];
  rendiconto.forEach((rend) => {
    prenList.push(rend.ospiti[0].ref_prenotazione_u);
  });

  prenList = new Set(prenList);

  prenList.forEach(async (pren) => {
    await Prenotazione.update(
      { turismoFlag: 1 },
      { where: { id_prenotazione: pren } }
    );
  });

  await Utente.update(
    { ultimo_rendiconto: new Date() },
    { where: { id: req.session.utente.id } }
  );

  res.status(200).json({ success: true });
};

const identifica_post = async (req, res) => {
  try {
    const ospiti = req.body;
    const result = await Ospite.bulkCreate(ospiti);
    await Prenotazione.update(
      { stato_prenotazione: 3 },
      { where: { id_prenotazione: ospiti[0].ref_prenotazione_u } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const contatta_questura_post = async (req, res) => {
  try {
    let prenotazioni = JSON.parse(req.fields.prenQuestura);
    let documenti;
    if (!req.files.documenti.length) {
      documenti = [];
      documenti.push(req.files.documenti);
    } else {
      documenti = req.files.documenti;
    }
    console.log(documenti);

    let newpathfile = new Array(documenti.length);

    for (let i = 0; i < documenti.length; i++) {
      newpathfile[i] = documenti[i].path + path.extname(documenti[i].name);
      fs.rename(documenti[i].path, newpathfile[i], () => {
        console.log("File rinominato");
      });
    }

    const doc = new PDFDocument();
    doc
      .text("Comunicazione presenza ospiti", {
        width: 400,
        align: "center",
      })
      .moveDown();
    doc
      .text(
        `Proprietario struttura: ${req.session.utente.nome} ${req.session.utente.cognome}`
      )
      .moveDown();
    prenotazioni.forEach((prenotazione) => {
      doc
        .text(
          `Arrivo: ${prenotazione.check_in}  Partenza: ${prenotazione.check_out}`
        )
        .moveDown();
      prenotazione.ospiti.forEach((ospite) => {
        doc.text(`Nome: ${ospite.nome}`);
        doc.text(`Cognome: ${ospite.cognome}`);
        doc.text(`Data di nascita: ${ospite.data_nascita}`);
        doc.text(`Nazionalita: ${ospite.nazionalita}`);
        doc.text(`Sesso: ${ospite.sesso}`);
        doc
          .text(
            `Documento: ${ospite.tipo_documento}    N°: ${ospite.numero_documento}`
          )
          .moveDown();
      });
    });
    doc.end();

    const allegati = [];
    allegati.push({ filename: "generalita.pdf", content: doc });
    documenti.forEach((documento, index) => {
      console.log(newpathfile[index]);
      let allegato = {};
      allegato.filename =
        `documento${index}` + path.extname(newpathfile[index]);
      allegato.content = fs.createReadStream(newpathfile[index]);
      allegati.push(allegato);
    });

    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
      bcc: "marcodaleo114@gmail.com", //PER TESTARE IL CONTENUTO DELLA MAIL RICEVUTA, INSERIRE IL PRIMO INDIRIZZO EMAIL
      subject: "Comunicazione presenza ospiti",
      text: `In allegato alla presente email, generalita e documenti degli ospiti che hanno soggiornato presso una struttura turistica del sottoscritto\n\n Cordiali Saluti, ${req.session.utente.nome} ${req.session.utente.cognome}`,
      attachments: allegati,
    };

    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });

    prenotazioni.forEach(async (prenotazione) => {
      await Prenotazione.update(
        { questuraFlag: 1 },
        { where: { id_prenotazione: prenotazione.id_prenotazione } }
      );
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

module.exports = {
  become_host_get,
  aggiungi_inserzione_post,
  gestione_host_get,
  modifica_inserzione_put,
  cancella_inserzione_delete,
  accetta_prenotazione_get,
  rifiuta_prenotazione_get,
  cancella_prenotazione_delete,
  contatta_utente_post,
  contatta_turismo_get,
  contatta_turismo_post,
  identifica_post,
  contatta_questura_post,
};
