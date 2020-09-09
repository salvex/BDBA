//STORAGE CARICAMENTO FOTO
const multer = require('multer');
const path = require('path');
var fs = require('fs');

var upFiles = function (id,type) { //funzione custom
  const storage = multer.diskStorage({
    destination: function (req, file,cb) {
      //var dest = '../public/uploads' + '/'
      cb(null, '../public/uploads' + '/' + type + '/' + id +'/');
    },          //'../public/uploads'
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // Inizializza upload 

  const upload = multer({ //?
    storage: storage,
    limits: {filesize: 1000000},
    filefilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  }).fields([
    {name: 'avatar', maxCount: 1},
    {name: 'gallery', maxCount: 10 }
  ]);

  return upload;
}

//Controllo per il tipo di estensione
function checkFileType(file, cb) {
  // Estensioni permesse
  const filetypes = /jpeg|jpg|png|gif/;
  // controllare l'estensione
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extnmae) {
    return cb(null,true);
  } else {
    return cb('Errore: Carica solo immagini!');
  }
}

//---------------------//

module.exports = {upFiles};