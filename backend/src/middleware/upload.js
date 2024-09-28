const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    // Define o nome do arquivo (pode ser personalizado conforme sua necessidade)
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;

//https://consolelog.com.br/upload-de-arquivos-imagens-utilizando-multer-express-nodejs/#google_vignette
// destination: function (req, file, cb) {
//     cb(null, 'uploads/')
// },
// filename: function (req, file, cb) {
//     // Extração da extensão do arquivo original:
//     const extensaoArquivo = file.originalname.split('.')[1];

//     // Cria um código randômico que será o nome do arquivo
//     const novoNomeArquivo = require('crypto')
//         .randomBytes(64)
//         .toString('hex');

//     // Indica o novo nome do arquivo:
//     cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
// }






// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '../uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//      cb(null, path.join(__dirname, 'uploads')); // Caminho para a pasta de uploads
//   },
//   filename: (req, file, cb) => {
//     // Define o nome do arquivo (pode ser personalizado conforme sua necessidade)
//     cb(null, `${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
