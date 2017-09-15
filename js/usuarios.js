const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

function logout() {
  auth.signOut();
}

function mostrarUsuarios() {
  let departamento = $('#departamento').val();
  let puesto = $('#puesto').val();

  let usuariosRef = db.ref('usuarios/'+departamento+'/'+puesto);
  usuariosRef.on('value', function(snapshot) {
    let usuarios = snapshot.val();
    let trs = "";

    for(let usuario in usuarios) {
      trs += `<tr>
                <td>${usuarios[usuario].nombre}</td>
                <td>${usuarios[usuario].username}</td>
                <td>${usuarios[usuario].puesto}</td>
                <td>${usuarios[usuario].descripcion}</td>
                <td>${usuarios[usuario].region}</td>
              </tr>`;
    }

    $('#tbodyTablaUsuarios').html(trs);
  });
}

function haySesion() {
  auth.onAuthStateChanged(function (user) {
    //si hay un usuario
    if (user) {

    }
    else {
      $(location).attr("href", "index.html");
    }
  });
}

haySesion();

function guardarUsuario() {
  let departamento = $('#departamento').val();
  let puesto = $('#puesto').val();
  let nombre = $('#nombre').val();
  let email = $('#email').val();
  let username = $('#username').val();
  let contraseña = $('#contraseña').val();
  let descripcion = $('#descripcion').val();

  if(puesto == "supervisoras" || puesto == "promotoras") {
    let region = $('#region').val();
    let datosUsuario = {
      puesto: puesto,
      nombre: nombre,
      email: email,
      descripcion: descripcion,
      username: username,
    }

    auth.createUserWithEmailAndPassword(email, contraseña)
    .then(function(data) {
      let uid = data.uid;

      datosUsuario.region = region;
      let usuariosRef = db.ref('usuarios/tiendas/'+puesto+'/'+uid);
      usuariosRef.set(datosUsuario);
      logout();
    })
    .catch(function(error) {
      console.log(error);
    });

    $('#puesto').val('');
    $('#nombre').val('');
    $('#region').val('');
    $('#email').val('');
    $('#username').val('');
    $('#contraseña').val('');
    $('#descripcion').val('');
  }
  else {
    auth.createUserWithEmailAndPassword(email, contraseña)
    .then(function(data) {
      let uid = data.uid;;

      let usuariosRef = db.ref('usuarios/'+departamento+'/'+puesto+'/'+uid);
      usuariosRef.set(datosUsuario);
      logout();
    }).catch(function (error) {

    });

    $('#puesto').val('');
    $('#nombre').val('');
    $('#email').val('');
    $('#username').val('');
    $('#contraseña').val('');
    $('#descripcion').val('');
  }
}

$('#departamento').change(function() {
  let departamento = $(this).val();
  if(departamento == "administrativo") {
    $('#puesto').html(
      '<option selected disabled>Seleccionar</option>'+
      '<option value="directores">Director</option>'+
      '<option value="recursosHumanos">Recursos Humanos</option>'
    );
    $('#divRegion').addClass("hidden");
  }
  else if(departamento == "planta") {
    $('#puesto').html(
      '<option selected disabled>Seleccionar</option>'+
      '<option value="almacen">Almacen</option>'
    );
    $('#divRegion').addClass("hidden");
  }
  else if(departamento == "tiendas") {
    $('#puesto').html(
      '<option selected disabled>Seleccionar</option>'+
      '<option value="promotoras">Promotora</option>'+
      '<option value="supervisoras">Supervisora</option>'
    );
  }
});

$('#puesto').change(function(){
  let puesto = $(this).val();

  mostrarUsuarios();
});

function mostrarNotificaciones() {
  let usuario = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+usuario+'/lista');
  notificacionesRef.on('value', function(snapshot) {
    let lista = snapshot.val();
    let lis = "";

    let arrayNotificaciones = [];
    for(let notificacion in lista) {
      arrayNotificaciones.push(lista[notificacion]);
    }

    arrayNotificaciones.reverse();

    for(let i in arrayNotificaciones) {
      let date = arrayNotificaciones[i].fecha;
      moment.locale('es');
      let fecha = moment(date, "MMMM DD YYYY, HH:mm:ss").fromNow();

      lis += '<li>' +
               '<a>' +
                '<div>' +
                  '<i class="fa fa-comment fa-fw"></i> ' + arrayNotificaciones[i].mensaje +
                    '<span class="pull-right text-muted small">'+fecha+'</span>' +
                '</div>' +
               '</a>' +
             '</li>';
    }

    $('#contenedorNotificaciones').empty().append('<li class="dropdown-header">Notificaciones</li><li class="divider"></li>');
    $('#contenedorNotificaciones').append(lis);
  });
}

function llenarSelectRegion() {
  let regionesRef = db.ref('regiones');
  regionesRef.on('value', function(snapshot) {
    let regiones = snapshot.val();
    let options = '<option disabled selected value="">Seleccionar</option>';
    for(region in regiones) {
      options += '<option value="'+region+'">'+region+'</option>';
    }
    $('#region').html(options);
  });
}

function mostrarContador() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+uid);
  notificacionesRef.on('value', function(snapshot) {
    let cont = snapshot.val().cont;

    if(cont > 0) {
      $('#spanNotificaciones').html(cont).show();
    }
    else {
      $('#spanNotificaciones').hide();
    }
  });
}

function verNotificaciones() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+uid);
  notificacionesRef.update({cont: 0});
}

$('#campana').click(function() {
  verNotificaciones();
});

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  llenarSelectRegion();
});
