const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../utils/connection");
const Utente = require("./Utente");
const Prenotazione = require("./Prenotazione");
const Servizi = require("./Servizi");
const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI

const Inserzione = db.sequelize.define(
  "inserzione",
  {
    id_inserzione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_inserzione: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    citta: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    inizioDisponibilita: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    fineDisponibilita: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    n_ospiti: {
      type: DataTypes.INTEGER(11),
      validate: {
        len: {
          args: [1, 2],
          msg: "Numero ospiti elevato",
        },
      },
    },
    descrizione: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    indirizzo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    prezzo_base: {
      type: DataTypes.INTEGER(30),
      allowNull: false,
    },
    tassa_soggiorno: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    galleryPath: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    ref_host_ins: {
      //chiave esterna riferita a utente
      type: DataTypes.INTEGER(11),
      required: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// ASSOCIAZIONE [1-1]
Inserzione.hasOne(Servizi, {
  foreignKey: "ref_inserzione_s",
});
Servizi.belongsTo(Inserzione, {
  foreignKey: "ref_inserzione_s",
});

//---------ASSOCIAZIONE [1-N] // INSERZIONE-PRENOTAZIONE-------------------//
Inserzione.hasMany(Prenotazione, {
  as: "prenotazioni",
  foreignKey: "ref_inserzione",
  onDelete: "cascade",
});
Prenotazione.belongsTo(Inserzione, {
  foreignKey: "ref_inserzione",
});

//ASSOCIAZIONE [1-MOLTI]-------
Utente.hasMany(Inserzione, {
  foreignKey: "ref_host_ins",
  onDelete: "cascade",
});
Inserzione.belongsTo(Utente, {
  foreignKey: "ref_host_ins",
});

Inserzione.verRicerca = async (query, checkin, checkout) => {
  const lista = await Inserzione.findAll({
    where: query,
    include: [
      {
        model: Servizi,
        required: false,
        //attributes: ['wifiFlag', 'riscaldamentoFlag','frigoriferoFlag','casaFlag','bnbFlag','parcheggioFlag','ascensoreFlag','cucinaFlag','essenzialiFlag', 'piscinaFlag']
      },
      {
        model: Prenotazione,
        as: "prenotazioni",
        required: false,
        attributes: ["ref_inserzione", "check_in", "check_out"],
      },
    ],
  });

  let listaFinale = [];

  function checkDates(pren) {
    let checkinPren = Date.parse(pren.check_in);
    let checkoutPren = Date.parse(pren.check_out);
    let checkinComp = Date.parse(checkin);
    let checkoutComp = Date.parse(checkout);
    let range = moment().range(checkinPren, checkoutPren);
    if (
      range.contains(checkinComp) == true ||
      range.contains(checkoutComp) == true
    ) {
      return false;
    } else {
      return true;
    }
  }

  if (lista) {
    lista.forEach((inserzione) => {
      if (inserzione.prenotazioni.length === 0) {
        listaFinale.push(inserzione);
      } else {
        if (inserzione.prenotazioni.every(checkDates)) {
          listaFinale.push(inserzione);
        }
      }
    });
    return listaFinale;
  }
  throw new Error("Nessuna inserzione");

  //console.log(typeof checkin);
  //console.log(typeof checkout);

  /* let ListaSenzaPren = [];

  lista.forEach((elem) => {
    if (Object.keys(elem.prenotazioni).length == 0) {
      //console.log(typeof elem.prenotazioni);
      ListaSenzaPren = ListaSenzaPren.concat(elem);
    }
  });

  console.log(ListaSenzaPren);

  if (lista) {
    // PROVA 2
    let outsideRangeList = [];
    let insideRangeList = [];

    lista.forEach((elem) => {
      elem.prenotazioni.forEach((pren) => {
        let checkinPren = Date.parse(pren.check_in);
        let checkoutPren = Date.parse(pren.check_out);
        let checkinComp = Date.parse(checkin);
        let checkoutComp = Date.parse(checkout);
        let range = moment().range(checkinPren, checkoutPren);
        let range2 = moment().range(checkinComp, checkoutComp);
        if (range2.overlaps(range) === false) {
          outsideRangeList = outsideRangeList.concat(elem);
        } else if (range2.overlaps(range) === true) {
          insideRangeList = insideRangeList.concat(elem);
        }
        /* if (
          range.contains(checkinComp) == false ||
          range.contains(checkoutComp) == false
        ) {
          outsideRangeList = outsideRangeList.concat(elem);
        } else if (
          range.contains(checkinComp) == true ||
          range.contains(checkoutComp) == true
        ) {
          insideRangeList = insideRangeList.concat(elem);
        } 
      });
    });
    //console.log(outsideRangeList);
    //console.log("LUNGHEZZA ARRAY DI DATE ESTERNE " + outsideRangeList.length);
    //console.log("LUNGHEZZA ARRAY DI DATE INTERNE " + insideRangeList.length);
    //let uniqueOutsideList = Array.from(new Set(outsideRangeList));
    //let uniqueInsideList = Array.from(new Set(insideRangeList));
    /*console.log("LUNGHEZZA ARRAY DI DATE ESTERNE " + uniqueOutsideList.length);
    console.log(uniqueOutsideList);
    console.log("LUNGHEZZA ARRAY DI DATE INTERNE " + uniqueInsideList.length);
    console.log(uniqueInsideList);

    let diffList = uniqueOutsideList.filter((a1) => {
      return !uniqueInsideList.some((a2) => {
        return a2.id_inserzione == a1.id_inserzione;
      });
    });

    diffList = diffList.concat(ListaSenzaPren);

    let diffUniqueList = Array.from(new Set(diffList));

    return diffUniqueList;
  } */
};

/* Inserzione.aggiungiInserzione = async (query) => {
  if (query) {
    /*const oldIns = await Inserzione.findOne({
             where: {
                nome_inserzione: query[0]
            }
        })
    //se l'inserzione non esiste
    const newIns = await Inserzione.create({
      nome_inserzione: query[0],
      citta: query[1],
      inizioDisponibilita: query[2],
      fineDisponibilita: query[3],
      n_ospiti: query[4],
      descrizione: query[5],
      indirizzo: query[6],
      prezzo_base: query[7],
      galleryPath: query[8],
      ref_host_ins: query[9],
    });

    const services = await Servizi.create({
      ref_inserzione_s: newIns.id_inserzione,
      wifiFlag: query[10]["wifi"],
      riscaldamentoFlag: query[10]["riscaldamento"],
      frigoriferoFlag: query[10]["frigorifero"],
      casaFlag: query[10]["casa"],
      bnbFlag: query[10]["bnb"],
      parcheggioFlag: query[10]["parcheggio"],
      ascensoreFlag: query[10]["ascensore"],
      cucinaFlag: query[10]["cucina"],
      essenzialiFlag: query[10]["essenziali"],
      piscinaFlag: query[10]["piscina"],
    });
    return newIns;
  }
  throw new Error("query vuota");
}; */

Inserzione.aggiungiInserzione = async (
  nome_inserzione,
  citta,
  inizioDisponibilita,
  fineDisponibilita,
  n_ospiti,
  descrizione,
  indirizzo,
  prezzo_base,
  tassa_soggiorno,
  ref_host_ins,
  galleryPath,
  servizi
) => {
  const newIns = await Inserzione.create({
    nome_inserzione,
    citta,
    inizioDisponibilita,
    fineDisponibilita,
    n_ospiti,
    descrizione,
    indirizzo,
    prezzo_base,
    tassa_soggiorno,
    ref_host_ins,
    galleryPath,
  });

  const services = await Servizi.create({
    ref_inserzione_s: newIns.id_inserzione,
    wifiFlag: servizi["wifi"],
    riscaldamentoFlag: servizi["riscaldamento"],
    frigoriferoFlag: servizi["frigorifero"],
    casaFlag: servizi["casa"],
    bnbFlag: servizi["bnb"],
    parcheggioFlag: servizi["parcheggio"],
    ascensoreFlag: servizi["ascensore"],
    cucinaFlag: servizi["cucina"],
    essenzialiFlag: servizi["essenziali"],
    piscinaFlag: servizi["piscina"],
  });
  return newIns;
};

//Funzione temporanea
Inserzione.mostra = async (idInserzione) => {
  const risultato = await Inserzione.findOne({
    where: {
      id_inserzione: idInserzione,
    },
    include: {
      model: Servizi,
      required: true,
    },
  });
  if (risultato) {
    return risultato;
  }
  throw new Error("Inserzione inesistente");
};

Inserzione.processaLista = async (id_host) => {
  const lista = await Inserzione.findAll({
    attributes: [
      "id_inserzione",
      "nome_inserzione",
      "citta",
      "inizioDisponibilita",
      "fineDisponibilita",
      "n_ospiti",
      "descrizione",
      "indirizzo",
      "prezzo_base",
      "tassa_soggiorno",
      "galleryPath",
    ],
    where: {
      ref_host_ins: id_host,
    },
    include: {
      model: Utente,
      required: true,
      attributes: ["isHost"],
    },
    include: {
      model: Servizi,
      required: true,
    },
  });
  if (lista) {
    return lista;
  }
  throw new Error("Nessuna inserzione");
};

Inserzione.modificaInserzione = async (id_ins, query) => {
  const ins_modifica = await Inserzione.findByPk(id_ins);
  const ins_modifica_s = await Servizi.findByPk(id_ins);
  if (!ins_modifica && !ins_modifica_s) {
    throw new Error("Nessuna inserzione");
  }
  console.log("modifica in corso");

  if (query) {
    if (query[0]) {
      //nome inserzione
      ins_modifica.nome_inserzione = query[0];
    }
    if (query[1]) {
      ins_modifica.citta = query[1];
    }
    if (query[2]) {
      ins_modifica.inizioDisponibilita = query[2];
    }
    if (query[3]) {
      ins_modifica.fineDisponibilita = query[3];
    }
    if (query[4]) {
      ins_modifica.n_ospiti = query[4];
    }
    if (query[5]) {
      ins_modifica.descrizione = query[5];
    }
    if (query[6]) {
      ins_modifica.indirizzo = query[6];
    }
    if (query[7]) {
      ins_modifica.prezzo_base = query[7];
    }
    if (query[8]) {
      ins_modifica.tassa_soggiorno = query[8];
    }
    if (query[9]) {
      ins_modifica.galleryPath = query[9];
    }
    if (query[10]["wifi"] != ins_modifica_s.wifiFlag) {
      ins_modifica_s.wifiFlag = query[10]["wifi"];
    }
    if (query[10]["riscaldamento"] != ins_modifica_s.riscaldamentoFlag) {
      ins_modifica_s.riscaldamentoFlag = query[10]["riscaldamento"];
    }
    if (query[10]["frigorifero"] != ins_modifica_s.frigoriferoFlag) {
      ins_modifica_s.frigoriferoFlag = query[10]["frigorifero"];
    }
    if (query[10]["casa"] != ins_modifica_s.casaFlag) {
      ins_modifica_s.casaFlag = query[10]["casa"];
    }
    if (query[10]["bnb"] != ins_modifica_s.bnbFlag) {
      ins_modifica_s.bnbFlag = query[10]["bnb"];
    }
    if (query[10]["parcheggio"] != ins_modifica_s.parcheggioFlag) {
      ins_modifica_s.parcheggioFlag = query[10]["parcheggio"];
    }
    if (query[10]["ascensore"] != ins_modifica_s.ascensoreFlag) {
      ins_modifica_s.ascensoreFlag = query[10]["ascensore"];
    }
    if (query[10]["cucina"] != ins_modifica_s.cucinaFlag) {
      ins_modifica_s.cucinaFlag = query[10]["cucina"];
    }
    if (query[10]["essenziali"] != ins_modifica_s.essenzialiFlag) {
      ins_modifica_s.essenzialiFlag = query[10]["essenziali"];
    }
    if (query[10]["piscina"] != ins_modifica_s.piscinaFlag) {
      ins_modifica_s.piscinaFlag = query[10]["piscina"];
    }
    await ins_modifica.save();
    await ins_modifica_s.save();
    return ins_modifica;
  } else {
    throw new Error("query vuota");
  }
};

Inserzione.modificaInserzione_img = async (id_ins, query) => {
  const ins_modifica = await Inserzione.findByPk(id_ins);
  if (!ins_modifica) {
    throw new Error("Nessuna inserzione");
  }
  console.log("modifica in corso");

  if (query) {
    ins_modifica.galleryPath = query;
    await ins_modifica.save();
    return ins_modifica;
  } else {
    throw new Error("query vuota");
  }
};

Inserzione.cancellaInserzione = async (id_ins) => {
  const ins_cancella = await Inserzione.destroy({
    where: {
      id_inserzione: id_ins,
    },
  });
  if (!ins_cancella) {
    throw new Error("Nessuna inserzione");
  }

  return ins_cancella;
};

/* Inserzione.getEmailUtentiPren = async (id_ins) => {
  let MailArray = [];
  const prenAss = await Inserzione.findAll({
    where: {
      id_inserzione : id_ins
    },
    include: {
      model: Prenotazione,
      required: true,
      attributes: ["id_prenotazione","ref_utente"]
    } 
  })
  if (prenAss) {
    prenAss.forEach((pren) => {
      const mailUtente = await Utente.findByPk(pren.ref_utente);
      MailArray.push(mailUtente.email);
    })
    return MailArray
  } else {
    throw new Error("prenotazioni non trovate");
  }
} */

module.exports = Inserzione;
