const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

function logout() {
  auth.signOut();
}

function mostrarSolicitudes() {
  let solicitudesRef = db.ref('aspirantes');
  solicitudesRef.on('value', function(snapshot) {
    let aspirantes = snapshot.val();
    let trs = "";
    let i = 1;

    for(let aspirante in aspirantes) {
      if( i%2 == 0 ) {
        trs += `<tr class="info">
                  <td>${i}</td>
                  <td>${aspirantes[aspirante].nombre} ${aspirantes[aspirante].apellidos}</td>
                  <td>${aspirantes[aspirante].sexo}</td>
                  <td>${aspirantes[aspirante].edad}</td>
                  <td>${aspirantes[aspirante].email}</td>
                  <td>${aspirantes[aspirante].celular}</td>
                  <td class="text-center"><a href="aspirante.html?=${aspirante}" class="btn btn-primary btn-xs">Ver más <i class="fa fa-eye" aria-hidden="true"></i></a></td>
                </tr>`;
      }
      else {
        trs += `<tr>
                  <td>${i}</td>
                  <td>${aspirantes[aspirante].nombre} ${aspirantes[aspirante].apellidos}</td>
                  <td>${aspirantes[aspirante].sexo}</td>
                  <td>${aspirantes[aspirante].edad}</td>
                  <td>${aspirantes[aspirante].email}</td>
                  <td>${aspirantes[aspirante].celular}</td>
                  <td class="text-center"><a href="aspirante.html?=${aspirante}" class="btn btn-primary btn-xs">Ver más <i class="fa fa-eye" aria-hidden="true"></i></a></td>
                </tr>`;
      }
      i++;
    }
    $('#tbodyTablaSolicitudes').html(trs);
  })
}

mostrarSolicitudes();

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

function verNotificaciones() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+uid);
  notificacionesRef.update({cont: 0});
}

$('#campana').click(function() {
  verNotificaciones();
});
