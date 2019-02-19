var base_url = "https://api.football-data.org/v2/competitions/2002/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getSchedules() {
  if ("caches" in window) {
    caches.match(base_url + "matches").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var contentHTML = "";
          data.matches.forEach(function(match) {
            contentHTML += `
                      <div class="card">
                        <div class="card-content">
                          <span class="card-title truncate">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
                          <p>${formatDate(match.utcDate)}</p>
                          <a id="match-${match.id}" class="waves-effect waves-light btn">Save this match</a>
                        </div>
                      </div>
                    `;
          });
          document.getElementById("schedules").innerHTML = contentHTML;
    
          data.matches.forEach(function(match) {
            document.getElementById(`match-${match.id}`).onclick = ()=>addSchedules(match);
          });
        });
      }
    });
  }

  fetch(base_url + "matches?status=SCHEDULED", {
    method: 'GET',
    headers: {
      'X-Auth-Token': '0a7396c60e6249fca3e46a37a98c65b1',
    },
  })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var contentHTML = "";
      data.matches.forEach(function(match) {
        contentHTML += `
                  <div class="card">
                    <div class="card-content">
                      <span class="card-title truncate">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
                      <p>${formatDate(match.utcDate)}</p>
                      <a id="match-${match.id}" class="waves-effect waves-light btn">Save this match</a>
                    </div>
                  </div>
                `;
      });
      document.getElementById("schedules").innerHTML = contentHTML;

      data.matches.forEach(function(match) {
        document.getElementById(`match-${match.id}`).onclick = ()=>addSchedules(match);
      });
    })
    .catch(error);
}

function getSavedSchedules() {
  getAllSchedules().then((matches)=>{
    console.log("Masok pak eko")
    var contentHTML = "";
    matches.forEach(function(match) {
      contentHTML += `
                <div class="card">
                  <div class="card-content">
                    <span class="card-title truncate">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
                    <p>${formatDate(match.utcDate)}</p>
                    <a id="match-${match.id}" class="waves-effect waves-light btn">Remove from list</a>
                  </div>
                </div>
              `;
    });
    console.log(document.getElementById("saved"));
    document.getElementById("saved").innerHTML = contentHTML;

    matches.forEach(function(match) {
      document.getElementById(`match-${match.id}`).onclick = ()=>deleteSchedule(match.id);
    });
  })
}

function getStandings() {
  if ("caches" in window) {
    console.log("Use caches")
    caches.match(base_url + "standings").then(function(response) {
      if (response) {
        console.log("Using caches")
        response.json().then(function(data) {
          var contentHTML = "";
          data.standings[0].table.forEach(function(team) {
            contentHTML += `
            <div class="card">
              <div class="card-content">
                <span class="card-title truncate">${team.position}. ${team.team.name}</span>
                <p>Win: ${team.won} | Draw: ${team.draw} | Lost: ${team.lost} | Points: ${team.points} | Played games: ${team.playedGames}</p>
              </div>
            </div>
          `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("standings").innerHTML = contentHTML;
        });
      }
    });
  }

  fetch(base_url + "standings", {
    method: 'GET',
    headers: {
      'X-Auth-Token': '0a7396c60e6249fca3e46a37a98c65b1',
    },
  })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      console.log(data)
      var contentHTML = "";
      data.standings[0].table.forEach(function(team) {
        contentHTML += `
                  <div class="card">
                    <div class="card-content">
                      <span class="card-title truncate">${team.position}. ${team.team.name}</span>
                      <p>Win: ${team.won} | Draw: ${team.draw} | Lost: ${team.lost} | Points: ${team.points} | Played games: ${team.playedGames}</p>
                    </div>
                  </div>
                `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("standings").innerHTML = contentHTML;
    })
    .catch(error);
}

function formatDate(date){
  const month_names =[
    "Jan","Feb","Mar",
    "Apr","May","Jun",
    "Jul","Aug","Sep",
    "Oct","Nov","Dec"
  ];
  let current_datetime = new Date(date);
  let formatted_date = month_names[current_datetime.getMonth()]+" "+ current_datetime.getDate()+", "+current_datetime.getFullYear()+" | " + current_datetime.getHours() + ":" + current_datetime.getMinutes() 
  return formatted_date
}

var dbPromise = idb.open("myDatabase", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("schedules")) {
      var table = upgradeDb.createObjectStore('schedules', {autoIncrement: true});
      console.log('Database dibuat.');
  }
});

function addSchedules(match){
  
  let schedule = {
    id: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    utcDate: match.utcDate,
  }
  dbPromise.then(function(db) {

      var tx = db.transaction('schedules', 'readwrite');

      var store = tx.objectStore('schedules');

      store.add(schedule, schedule.id);

      return tx.complete;
  }).then(function() {
      console.log('Buku berhasil disimpan.');
  }).catch(function(error) {
      console.log('Buku gagal disimpan.')
      console.error(error)
  })
}   

function getAllSchedules(){
  return dbPromise.then(function(db) {
      var tx = db.transaction('schedules', 'readonly');
      var store = tx.objectStore('schedules');
      return store.getAll();
  }).then(function(items) {
      console.log('Data yang diambil: ');
      console.log(items);

      return items;
  });
}

function deleteSchedule(id){
  dbPromise.then(function(db) {
      var tx = db.transaction('schedules', 'readwrite');
      var store = tx.objectStore('schedules');
      store.delete(id);
      return tx.complete;
  }).then(function() {
      console.log('Item deleted');
  });
}