//STORAGE CARICAMENTO FOTO
const multer = require("multer");
const path = require("path");
var fs = require("fs-extra");

//funzione custom
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = req.params.type;

    let path = "public/uploads" + "/" + type;
    fs.mkdirSync(path, { recursive: true }); //crea il percorso qualora non ci fosse
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Inizializza upload

const upFiles = multer({
  //?
  storage: storage,
  limits: { filesize: 1000000 },
  filefilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

//Controllo per il tipo di estensione
function checkFileType(file, cb) {
  // Estensioni permesse
  const filetypes = /jpeg|jpg|png|gif/;
  // controllare l'estensione
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extnmae) {
    return cb(null, true);
  } else {
    return cb("Errore: puoi caricare solo immagini!");
  }
}

//---------------------//

module.exports = { upFiles };
