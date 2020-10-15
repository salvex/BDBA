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

/* TO-DO: CONTATTA UTENTE */

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

async function parseField(
  NomeFilter,
  CittàFilter,
  CheckInFilter,
  CheckOutFilter,
  nOspitiFilter,
  DescFilter,
  IndirizzoFilter,
  PrezzoFilter,
  PathFilter,
  IdFilter,
  ServiziFilter
) {
  const query = [];

  if (
    NomeFilter ||
    CittàFilter ||
    CheckInFilter ||
    CheckOutFilter ||
    nOspitiFilter ||
    PrezzoFilter ||
    DescFilter ||
    IndirizzoFilter ||
    PathFilter ||
    IdFilter ||
    ServiziFilter
  ) {
    if (NomeFilter) {
      query[0] = NomeFilter;
    }
    if (CittàFilter) {
      query[1] = CittàFilter;
    }
    if (CheckInFilter) {
      query[2] = CheckInFilter;
    }
    if (CheckOutFilter) {
      query[3] = CheckOutFilter;
    }
    if (nOspitiFilter) {
      query[4] = nOspitiFilter;
    }
    if (DescFilter) {
      query[5] = DescFilter;
    }
    if (IndirizzoFilter) {
      query[6] = IndirizzoFilter;
    }
    if (PrezzoFilter) {
      query[7] = PrezzoFilter;
    }
    if (PathFilter) {
      query[8] = PathFilter;
    }
    if (IdFilter) {
      query[9] = IdFilter;
    }
    if (ServiziFilter) {
      var filtri = {
        wifi: ServiziFilter.wifi,
        riscaldamento: ServiziFilter.riscaldamento,
        frigorifero: ServiziFilter.frigorifero,
        casa: ServiziFilter.casa,
        bnb: ServiziFilter.bnb,
        parcheggio: ServiziFilter.parcheggio,
        ascensore: ServiziFilter.ascensore,
        cucina: ServiziFilter.cucina,
        essenziali: ServiziFilter.essenziali,
        piscina: ServiziFilter.piscina,
      };
      query[10] = filtri;
    }
  }

  return query;
}

const become_host_get = async (req, res) => {
  try {
    var jwt = await Utente.diventaHost(req.session.utente.id); //test
    var token_host = JwtToken.createTokenHost(req.session.utente.id);
    res.cookie("host", token_host, {
      httpOnly: true,
      expiresIn: maxAge * 1000,
    });
    //--------------------/
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

/* const aggiungi_inserzione_post = async (req, res) => {
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
      servizi,
    } = req.body;
    console.log(req.body);
    const id_host = req.session.utente.id;
    /* var path = req.files["gallery"][0].path;
    path = path.replace(/\\/g, "/"); 
    let path = null;
    console.log(path);
    /* var fields = await parseField(
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      servizi,
      id_host
    ); 
    console.log(
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      servizi
    );

    var inserzione = await Inserzione.aggiungiInserzione(
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      servizi
    );
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
}; */

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
    /* var path = req.files["gallery"][0].path;
    path = path.replace(/\\/g, "/");
    console.log(path); */

    let path = "";
    for (let i = 0; i < req.files["gallery"].length - 1; i++) {
      path += req.files["gallery"][i].path.slice(31) + ",";
    }
    path += req.files["gallery"][req.files["gallery"].length - 1].path.slice(
      31
    );
    path = path.replace(/\\/g, "/");

    // /upload/AvatarUtente/12312748142/21907121.png

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

/* const aggiungi_inserzione_post = async (req, res) => {
  try {
    /* const id_host = req.session.utente.id;
    var path = req.files["gallery"][0].path;
    path = path.replace(/\\/g, "/");
    console.log(path); 

    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
}; */

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
    const errors = errorsHandler(err); //
    res.status(400).json({ errors });
  }
};

const modifica_inserzione_put = async (req, res) => {
  try {
    console.log("ciao");
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
        path += req.files["gallery"][i].path.slice(31) + ",";
      }
      path += req.files["gallery"][req.files["gallery"].length - 1].path.slice(
        31
      );
    } else {
      if (imgToSave.length > 0) {
        path = imgToSave.reduce((x, y) => x + "," + y);
      } else {
        path = "";
      }
    }
    path = path.replace(/\\/g, "/");
    console.log(path);

    imgToDel.forEach((img, index) => {
      fs.unlink(`public/uploads/fotoInserzione/${id_host}${img}`, (err) => {
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
    console.log();
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
    /* var fields = await parseField(
      nome,
      citta,
      inizioDisp,
      fineDisp,
      nospiti,
      desc,
      indirizzo,
      prezzo,
      path,
      id_host,
      servizi
    ); */

    /* var inserzione_m = await Inserzione.modificaInserzione(
      id_inserzione,
      fields
    ); */
    /* var path = req.files["gallery"][0].path;
    var inserzione_m = await Inserzione.modificaInserzione_img(
      id_inserzione,
      path
    ); */
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

/* const modifica_inserzione_put_img = async (req, res) => {
  try {
    const { id_inserzione } = req.body;
    var path = req.files["gallery"][0].path;
    var inserzione_m = await Inserzione.modificaInserzione_img(
      id_inserzione,
      path
    );
    res.status(200).json({
      message: "hai modificato questa inserzione con successo!",
      inserzione_m,
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
}; */

/* const cancella_inserzione_delete = async (req, res) => {
  try {
    const { id_inserzione } = req.body;
    console.log(id_inserzione);
    var deleteIns = await Inserzione.findByPk(id_inserzione);
    let path =
      `public/uploads/fotoInserzione/` +
      req.session.utente.id +
      deleteIns.galleryPath.slice(0, 14);

    console.log(path, deleteIns);
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
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
}; */
const cancella_inserzione_delete = async (req, res) => {
  //MODIFICATO, DA INSERIRE CON DANIEL
  try {
    const { id_inserzione } = req.body;

    console.log(id_inserzione); // DA INSERIRE

    // Cerco l'inserzione da cancellare
    var deleteIns = await Inserzione.findByPk(id_inserzione); // DA INSERIRE

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
        "Cancellazione Prenotazione a Struttura: " + deleteIns.nome_inserzione,
      text:
        "Comunicazione relativa alla presenza di ospiti presso una struttura",
      html:
        "<b>Le comunichiamo che la sua prenotazione è stata cancellata</b><br><br><b>Cordiali Saluti, Team AIRBDBA</b>",
    };

    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });

    //elimino l'inserzione
    await deleteIns.destroy(); //DA INSERIRE

    // elimino ricorsivamente le la cartella e i file all'interno
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log(`File eliminati`);
    });
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

/* const cancella_inserzione_delete = async (req, res) => { //MODIFICATO, DA INSERIRE CON DANIEL
  try {
    const { id_inserzione } = req.body;

    console.log(id_inserzione); // DA INSERIRE 

    // Cerco l'inserzione da cancellare 
    var deleteIns = await Inserzione.findByPk(id_inserzione); // DA INSERIRE 

    let path =
      `public/uploads/fotoInserzione/` +
      req.session.utente.id +
      deleteIns.galleryPath.slice(0, 14);

    //Prendo le email degli utenti associati alle prenotazioni della relativa insserzione // DA INSERIRE
    const mailList = await Inserzione.getEmailUtentiPren(id_inserzione);

    if(mailList) { 
      
      let bodyMail = { 
        from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
        to: mailList,
        subject: "Cancellazione Prenotazione a Struttura: " + deleteIns.nome_inserzione ,
        text: "Comunicazione relativa alla presenza di ospiti presso una struttura",
        html: "<b>Le comunichiamo che la sua prenotazione è stata annullata/cancellata</b><br><br><b>Cordiali Saluti, Team AIRBDBA</b>",
      };

      await transporter.sendMail(bodyMail, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Messaggio inviato: %s", info.messageId);
      });

    }

    console.log(path, deleteIns);

    //elimino l'inserzione 
    await deleteIns.destroy(); //DA INSERIRE

    // elimino ricorsivamente le la cartella e i file all'interno
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log(`File eliminati`);
    });
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  } */

const accetta_prenotazione_get = async (req, res) => {
  try {
    var acceptPren = await Prenotazione.findByPk(req.params.id_pren);
    if (acceptPren) {
      acceptPren.stato_prenotazione = 2;
      await acceptPren.save();
    } else {
      throw new Error("prenotazione inesistente");
    }
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const rifiuta_prenotazione_get = async (req, res) => {
  try {
    var refusePren = await Prenotazione.update(
      { stato_prenotazione: 0 },
      {
        where: {
          id_prenotazione: req.params.id_pren,
        },
      }
    );
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const cancella_prenotazione_delete = async (req, res) => {
  try {
    var deletePren = await Prenotazione.update(
      { stato_prenotazione: 0 },
      {
        where: {
          id_prenotazione: req.params.id_pren,
        },
      }
    );
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const contatta_utente_post = async (req, res) => {
  //DA MODIFICARE CON GET
  try {
    const { user_email, message, titolo } = req.body;
    console.log(user_email, message, titolo);

    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
      to: "",
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
      /* html: "<b>RIEPILOGO PLACEHOLDER</b>", */
    };

    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });
    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const contatta_turismo_get = async (req, res) => {
  try {
    var totaleRendiconto = 0;
    var rendiconto = [];
    const prenotazioni = req.body;
    prenotazioni.forEach((prenotazione) => {
      prenotazione.ospiti.forEach((ospite) => {
        if (ospite.isEsente === 0) {
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
  }
};

// const contatta_turismo_post = /* async */ (req, res) => {
//   /* const rendiconto = req.body.rendiconto;
//   const ricevuta = req.body.ricevuta;
//   const doc = new PDFDocument();
//   doc.text("Rendiconto tasse di soggiorno", {
//     width: 400,
//     align: "center",
//   });
//   doc.text(`Totale rendiconto: ${rendiconto.totaleRendiconto}`);
//   rendiconto.forEach((element) => {
//     doc.text(
//       `Arrivo: ${rendiconto.check_in}  Partenza: ${rendiconto.check_out}`
//     );
//     element.ospiti.forEach((ospite) => {
//       doc.text(`Nome: ${ospite.nome} `);
//     });
//   });

//   let bodyMail = {
//     from: req.session.utente.email,
//     to: indirizzo_questura,
//     subject: "Rendiconto tasse di soggiorno",
//     text: "ricevuta pagamento e generalita ospiti",
//     //html: "<b>RIEPILOGO PLACEHOLDER</b>",
//   };

//   await transporter.sendMail(bodyMail, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("Messaggio inviato: %s", info.messageId);
//   }); */
//   console.log(req.fields);
//   res.status(200).json({ success: true });
// };

const contatta_turismo_post = async (req, res) => {
  let { rendiconto, totaleRendiconto } = JSON.parse(req.fields.rendiconto);
  const newpathfile =
    req.files.ricevuta.path + path.extname(req.files.ricevuta.name);
  console.log(newpathfile);

  fs.rename(req.files.ricevuta.path, newpathfile, () => {
    console.log("File rinominato");
  });

  //console.log(ricevuta);
  //console.log(rendiconto);
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
    to: "",
    subject: "Rendiconto tasse di soggiorno",
    text: "ricevuta pagamento e generalita ospiti",
    attachments: [
      {
        filename: "rendiconto.pdf",
        content: doc,
      },
      {
        filename: "generalita" + path.extname(req.files.ricevuta.name),
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
    console.log(req.files);
    console.log(req.files.documenti);
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
    console.log(newpathfile);

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

    /* const allegati = [];
    allegati.push({ filename: "documento.pdf", content: doc });
    documenti.forEach((documento, index) => {
      console.log(documento.path);
      let allegato = {};
      allegato.filename = `documento${index}` + path.extname(documento.name);
      allegato.content = documento.path;
      allegati.push(allegato);
    }); */
    const allegati = [];
    allegati.push({ filename: "documento.pdf", content: doc });
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
      to: "",
      subject: "Comunicazione presenza ospiti",
      text: "lista ospiti e documenti",
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
  /* modifica_inserzione_put_img, */
  cancella_inserzione_delete,
  accetta_prenotazione_get,
  rifiuta_prenotazione_get,
  cancella_prenotazione_delete,
  contatta_utente_post,
  contatta_turismo_get,
  contatta_turismo_post,
  identifica_post,
  contatta_questura_post,
}; //
