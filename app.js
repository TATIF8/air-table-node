const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const axios = require("axios");
const val = require("./val");
const API_TOKEN =
  "patP4DYdNBbMxgNfM.86a4d3d893407e1e7ad07e5e59bda9c8abadb7d33e86eecbe2e21eaac386445a";

const API_URL = `https://api.airtable.com/v0/appiSfzer3iVlkmir/tbl5AnU1BeuS9cALH`;
const config = {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.post("/agregarUsuario", async (req, res) => {
  try {
    const { bol, aPat, aMat, nombre, semestre } = req.body;

    if (
      !val.val.valBol(bol) ||
      !val.val.valApellidos(aPat) ||
      !val.val.valApellidos(aMat) ||
      !val.val.valApellidos(nombre)
    ) {
      res.send(`
       <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
      <body class="bg-gray-100 p-6">
        <div class="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
            <div class="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded-md">
                Error: No ingrese cosas raras
            </div>
             
        </div>
      </body>
`);
    }
    const alumData = {
      fields: {
        Boleta: bol,
        ApellidoP: aPat,
        ApellidoM: aMat,
        Nombre: nombre,
        Semestre: semestre,
      },
    };
    axios
      .post(API_URL, alumData, config)
      .then((response) => {
        const data = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error);
  }
  res.send("Registro insertado con éxito");
});

app.get(`/verUsuarios`, (req, res) => {
  axios
    .get(API_URL, config)
    .then((response) => {
      const data = response.data.records;
      const userHTML = `
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-indigo-600 text-white">
                    <th class="border border-gray-300 py-2 px-4">Número</th>
                    <th class="border border-gray-300 py-2 px-4">Boleta</th>
                    <th class="border border-gray-300 py-2 px-4">Nombre</th>
                    <th class="border border-gray-300 py-2 px-4">Apellido Paterno</th>
                    <th class="border border-gray-300 py-2 px-4">Apellido Materno</th>
                    <th class="border border-gray-300 py-2 px-4">Semestre</th>
                    <th class="border border-gray-300 py-2 px-4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${data
                  .map((user, index) => {
                    const userData = user.fields;
                    const userId = user.id;
                    return `<tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
                        <td class="border border-gray-300 py-2 px-4">${index + 1}</td>
                        <td class="border border-gray-300 py-2 px-4">${userData.Boleta}</td>
                        <td class="border border-gray-300 py-2 px-4">${userData.Nombre}</td>
                        <td class="border border-gray-300 py-2 px-4">${userData.ApellidoP}</td>
                        <td class="border border-gray-300 py-2 px-4">${userData.ApellidoM}</td>
                        <td class="border border-gray-300 py-2 px-4">${userData.Semestre}</td>
                        <td class="border border-gray-300 py-2 px-4">
                            <a href="/verUsuario/${userId}" class="text-indigo-600 hover:underline">Ver</a> |
                            <a href="/editarUsuario/${userId}" class="text-indigo-600 hover:underline">Editar</a>
                        </td>
                    </tr>`;
                  })
                  .join("")}
            </tbody>
        </table>
    </div>
    <div class="text-center mt-4">
        <a href="/" class="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700">Crear usuario</a>
    </div>
</body>
`;
      res.send(userHTML);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al obtener los usuarios.");
    });
});

app.get("/verUsuario/:id", (req, res) => {
  const userId = req.params.id;
  axios
    .get(`${API_URL}/${userId}`, config)
    .then((response) => {
      const userData = response.data.fields;
      const userHTML = `
       <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 p-6">
    <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 class="text-2xl font-semibold mb-4">Detalles del Usuario</h1>
        <p><strong>Boleta:</strong> ${userData.Boleta}</p>
        <p><strong>Nombre:</strong> ${userData.Nombre}</p>
        <p><strong>Apellido Paterno:</strong> ${userData.ApellidoP}</p>
        <p><strong>Apellido Materno:</strong> ${userData.ApellidoM}</p>
        <p><strong>Semestre:</strong> ${userData.Semestre}</p>
        <a href="/editarUsuario/${userId}" class="text-indigo-600 hover:underline block mt-4">Editar</a>
        <a href="/eliminarUsuario/${userId}" class="text-red-600 hover:underline block mt-2">Eliminar</a>
        <a href="/verUsuarios" class="text-indigo-600 hover:underline block mt-2">Ver usuarios</a>
    </div>
</body>
</html>
`;

      res.send(userHTML);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al obtener los detalles del usuario.");
    });
});
app.get("/editarUsuario/:id", (req, res) => {
  const userId = req.params.id;
  axios
    .get(`${API_URL}/${userId}`, config)
    .then((response) => {
      const userData = response.data.fields;
      const editUserForm = `
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
        <h1>Editar Usuario</h1>
        <div class="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
  <form method="POST" action="/guardarEdicionUsuario/${userId}">
    <div class="mb-4">
      <label for="boleta" class="block text-sm font-medium text-gray-700">Boleta:</label>
      <input type="text" id="boleta" name="boleta" value="${userData.Boleta}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none focus:border-indigo-300">
    </div>
    <div class="mb-4">
      <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre:</label>
      <input type="text" id="nombre" name="nombre" value="${userData.Nombre}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none focus:border-indigo-300">
    </div>
    <div class="mb-4">
      <label for="apPaterno" class="block text-sm font-medium text-gray-700">Apellido Paterno:</label>
      <input type="text" id="apPaterno" name="apPaterno" value="${userData.ApellidoP}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none focus:border-indigo-300">
    </div>
    <div class="mb-4">
      <label for "apMaterno" class="block text-sm font-medium text-gray-700">Apellido Materno:</label>
      <input type="text" id="apMaterno" name="apMaterno" value="${userData.ApellidoM}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none focus:border-indigo-300">
    </div>
    <div class="mb-4">
      <label for="semestre" class="block text-sm font-medium text-gray-700">Semestre:</label>
      <input type="text" id="semestre" name="semestre" value="${userData.Semestre}" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none focus:border-indigo-300">
    </div>
    <div class="text-center">
      <input type="submit" value="Guardar Cambios" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
  </form>
</div>

        </body>
      `;

      res.send(editUserForm);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al obtener los datos del usuario para editar.");
    });
});
app.post("/guardarEdicionUsuario/:id", (req, res) => {
  const userId = req.params.id;
  const { bol, aPat, aMat, nombre, semestre } = req.body;
  if (!val.val.valApellidos(aPat) || !val.val.valApellidos(aMat) || !val.val.valApellidos(nombre)) {
    res.send("No ingrese cosas raras");
  }
  const updatedUserData = {
    fields: {
      Boleta: bol,
      ApellidoP: aPat,
      ApellidoM: aMat,
      Nombre: nombre,
      Semestre: semestre,
    },
  };

  axios
    .patch(`${API_URL}/${userId}`, updatedUserData, config)
    .then(() => {
      res.redirect(`/verUsuario/${userId}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al guardar los cambios del usuario.");
    });
});

app.get("/eliminarUsuario/:id", (req, res) => {
  const userId = req.params.id;
  axios
    .delete(`${API_URL}/${userId}`, config)
    .then(() => {
      res.redirect("/verUsuarios");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al eliminar el usuario.");
    });
});
// app.get("/borrarUsuario", (req, res) => {
//   let { bol } = req.query;
//   sent = `delete from alumnos where bol=${bol}`;
//   con.query(sent, (err, respuesta) => {
//     if (err) return console.log(err);
//     return res.send(`<h1>Usuario Eliminado Correctamente</h1>
//         <form action="/verUsuarios" method="get">
//             <input type="submit" value="Regresar">
//         </form>`);
//   });
// });
// app.get("/PeditarUsuario", (req, res) => {
//   let { bol } = req.query;
//   let { nom } = req.query;
//   let { appat } = req.query;
//   let { apmat } = req.query;
//   let { tel } = req.query;
//   return res.send(`<form action="/editarUsuario" method="get">
//         <table>
//             <tr>
//                 <td>Boleta: </td>
//                 <td><input type="number" name="bol" id="bol" value="${bol}" readonly></td>
//             </tr>
//             <tr>
//                 <td>Ingrese el nuevo nombre: </td>
//                 <td><input type="text" name="nom" id="nom" value="${nom}"></td>
//             </tr>
//             <tr>
//                 <td>Ingrese el nuevo apellido paterno: </td>
//                 <td><input type="text" name="appat" id="appat" value="${appat}"></td>
//             </tr>
//             <tr>
//                 <td>Ingrese el nuevo apellido materno: </td>
//                 <td><input type="text" name="apmat" id="apmat" value="${apmat}"></td>
//             </tr>
//             <tr>
//                 <td>Ingrese el nuevo telefono: </td>
//                 <td><input type="number" name="tel" id="tel" value="${tel}"></td>
//             </tr>
//             <tr>
//                 <td rowspan="2"><input type="submit" value="Editar Usuario"></td>
//             </tr>
//         </table>
//     </form>`);
// });
// app.get("/editarUsuario", (req, res) => {
//   let { bol } = req.query;
//   let { nom } = req.query;
//   let { appat } = req.query;
//   let { apmat } = req.query;
//   let { tel } = req.query;
//   sent = `update alumnos set nom="${nom}",appat="${appat}",apmat="${apmat}",tel=${tel} where bol=${bol}`;
//   con.query(sent, (err, respuesta) => {
//     if (err) return console.log(err);
//     return res.send(`<h1>Usuario Actualizado Correctamente</h1>
//         <form action="/verUsuarios" method="get">
//             <input type="submit" value="Regresar">
//         </form>`);
//   });
// });
app.listen(8000, () => {
  console.log("escuchando en el puerto 8000");
});
