const db = require("../utils/connection.js");
const Utente = require("../model/Utente");
const Inserzione = require("../model/Inserzione");
require("dotenv").config();
const JwtToken = require("../utils/JwtToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const Prenotazione = require("../model/Prenotazione.js");
var transporter = require("../utils/mailSender");

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
      servizi,
    } = JSON.parse(req.body.inserzione);

    const id_host = req.session.utente.id;
    /* var path = req.files["gallery"][0].path;
    path = path.replace(/\\/g, "/");
    console.log(path); */

    let path = "";
    for (let i = 0; i < req.files["gallery"].length - 1; i++) {
      path += req.files["gallery"][i].path.slice(29) + ",";
    }
    path += req.files["gallery"][req.files["gallery"].length - 1].path.slice(
      29
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

const visualizza_inserzioni_get = async (req, res, next) => {
  try {
    const id_host = JwtToken.decodedId(req);
    var lista = await Inserzione.processaLista(id_host);
    res.locals.inserzioni = JSON.stringify(lista);
    next();
  } catch (err) {
    const errors = errorsHandler(err); //
    res.status(400).json({ errors });
  }
};

const modifica_inserzione_put = async (req, res) => {
  try {
    const {
      id_inserzione,
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
    const id_host = req.session.utente.id;
    var path = req.files["gallery"][0].path;
    path = path.replace(/\\/g, "/");
    var fields = await parseField(
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
    );
    console.log(fields);
    var inserzione_m = await Inserzione.modificaInserzione(
      id_inserzione,
      fields
    );
    /* var path = req.files["gallery"][0].path;
    var inserzione_m = await Inserzione.modificaInserzione_img(
      id_inserzione,
      path
    ); */
    res.status(200).json({
      message: "hai modificato questa inserzione con successo!",
      inserzione_m,
    });
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

const cancella_inserzione_delete = async (req, res) => {
  try {
    const { id_inserzione } = req.body;
    var deleteFlag = await Inserzione.cancellaInserzione(id_inserzione);
    res.status(200).json({
      message: "hai cancellato questa inserzione con successo!",
      deleteFlag,
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const accetta_prenotazione_get = async (req, res) => {
  try {
    var acceptPren = await Prenotazione.findByPk(req.params.id_pren);
    if (acceptPren) {
      acceptPren.stato_ordine = 2;
      await acceptPren.save();
    } else {
      throw new Error("prenotazione inesistente");
    }
    res.status(200).json({
      message: "hai accettato l'ordine con successo!",
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const rifiuta_prenotazione_get = async (req, res) => {
  try {
    var refusePren = await Prenotazione.findByPk(req.params.id_pren);
    if (refusePren) {
      refusePren.stato_ordine = 0;
      await refusePren.save();
    } else {
      throw new Error("prenotazione inesistente");
    }
    res.status(200).json({
      message: "hai rifiutato l'ordine con successo!",
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const cancella_prenotazione_delete = async (req, res) => {
  try {
    var deletePren = await Prenotazione.findByPk(req.params.id_pren);
    if (deletePren) {
      if (deletePren.stato_ordine == 2) {
        await deletePren.destroy();
      } else {
        res.status(304).json({
          message: "Non puoi cancellare questa prenotazione!",
        });
      }
      res.status(200).json({
        message: "hai cancellato l'ordine con successo!",
      });
    } else {
      throw new Error("prenotazione inesistente");
    }
    res.status(200).json({
      message: "hai rifiutato l'ordine con successo!",
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const contatta_utente_post = async (req, res) => {
  //DA MODIFICARE CON GET
  try {
    const result = await Prenotazione.getUserMail(
      req.params.id_pren,
      req.session.utente.id
    );
    let bodyMail = {
      from: '"Sistema AIRBDBA" <bdba_services@gmail.com>',
      to: result.utente.email,
      replyTo: req.session.utente.email,
      subject:
        "Comunicazione dall'Host " +
        req.session.utente.nome +
        " " +
        req.session.utente.cognome +
        " relativa alla Prenotazione ID " +
        req.params.id_pren,
      text: "Comunicazione relativa alla prenotazione ID " + req.params.id_pren,
      html: "<b>RIEPILOGO PLACEHOLDER</b>",
    };

    await transporter.sendMail(bodyMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Messaggio inviato: %s", info.messageId);
    });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

module.exports = {
  become_host_get,
  aggiungi_inserzione_post,
  visualizza_inserzioni_get,
  modifica_inserzione_put,
  /* modifica_inserzione_put_img, */
  cancella_inserzione_delete,
  accetta_prenotazione_get,
  rifiuta_prenotazione_get,
  cancella_prenotazione_delete,
  contatta_utente_post,
}; //
