import idb from 'idb';

console.log("terpanggil");

var dbPromise = idb.open("myDatabase", 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("schedules")) {
        var table = upgradeDb.createObjectStore('schedules', {keyPath: 'id', autoIncrement:true});
        table.createIndex("id", "id");
        console.log('Database dibuat.');
    }
});

addSchedules(
    {
        "id": 235883,
        "season": {
            "id": 155,
            "startDate": "2018-08-24",
            "endDate": "2019-05-18",
            "currentMatchday": 22
        },
        "utcDate": "2019-02-15T19:30:00Z",
        "status": "SCHEDULED",
        "matchday": 22,
        "stage": "REGULAR_SEASON",
        "group": "Regular Season",
        "lastUpdated": "2019-01-11T17:30:22Z",
        "score": {
            "winner": null,
            "duration": "REGULAR",
            "fullTime": {
                "homeTeam": null,
                "awayTeam": null
            },
            "halfTime": {
                "homeTeam": null,
                "awayTeam": null
            },
            "extraTime": {
                "homeTeam": null,
                "awayTeam": null
            },
            "penalties": {
                "homeTeam": null,
                "awayTeam": null
            }
        },
        "homeTeam": {
            "id": 16,
            "name": "FC Augsburg"
        },
        "awayTeam": {
            "id": 5,
            "name": "FC Bayern München"
        },
        "referees": []
    },
);

function addSchedules(schedule){
    dbPromise.then(function(db) {
        var tx = db.transaction('myDatabase', 'readwrite');
        var store = tx.objectStore('schedules');
        store.add(schedule, schedule.id);
        return tx.complete;
    }).then(function() {
        console.log('Buku berhasil disimpan.');
    }).catch(function() {
        console.log('Buku gagal disimpan.')
    })
}   