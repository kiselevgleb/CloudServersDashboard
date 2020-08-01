import {
  all,
  create,
  removed,
} from './xhr.js';

const table = document.querySelector('table');
const trPlus = document.createElement('tr');
const log = document.getElementById('tr-log');
const bStop = document.getElementsByClassName('thStop');

function serv() {
  table.innerHTML = "";
  all().then(result => {
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      console.log(element.id);
      createServer(element);
    }
    const trTitle = document.createElement('tr');
    trTitle.innerHTML = "Your micro instances:";
    table.prepend(trTitle);
    trPlus.classList.add("thStop");
    trPlus.innerHTML = "Create new instance";
    table.appendChild(trPlus);
  });
}
let masES = [];
trPlus.addEventListener('click', () => {
  let id;
  create().then(result => {

    console.log(result[result.length - 1].id);
    id = result[result.length - 1].id;
    let eventSource;
    let date = new Date();
    log.innerHTML += "<p style='font-size:10px'>" + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + "</p>" + "<p style='font-size:10px'>" + id + "</p>" + "<p  style='font-size:10px'>" + "INFO: Create command" + "</p>" + "<br>";
    // eventSource = new EventSource(`http://localhost:7070/${id}`);
    eventSource = new EventSource(`https://cloud-servers.herokuapp.com/${id}`);
    masES.push({
      id: id,
      es: eventSource
    });
    console.log(masES.length);
    eventSource.addEventListener('message', (evt) => {
      console.log(evt.data);
    }, );
    eventSource.addEventListener('open', () => {});
    eventSource.addEventListener('error', () => {});
    });
  setTimeout(() => {
    let date = new Date();
    log.innerHTML += "<p style='font-size:10px'>" + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + "</p>" + "<p style='font-size:10px'>" + id + "</p>" + "<p style='font-size:10px'>" + "INFO: Created" + "</p>" + "<br>";
    serv();
  }, 2000);
});
serv();

function createServer(element) {
  const tbWrap = document.createElement('table');
  tbWrap.classList.add("tbWrap");
  const trFir = document.createElement('tr');
  const trSec = document.createElement('tr');
  const trThr = document.createElement('tr');
  const thActions = document.createElement('th');
  const thStop = document.createElement('th');
  const thRem = document.createElement('th');
  thActions.innerHTML = "Actions";
  thStop.classList.add("thStop");
  thRem.classList.add("thStop");
  thStop.innerHTML = "&#9654";
  thRem.innerHTML = "&#215";
  trThr.appendChild(thActions);
  trThr.appendChild(thStop);
  trThr.appendChild(thRem);
  trFir.innerHTML = element.id;
  trSec.innerHTML = "Status: " + element.state;
  tbWrap.appendChild(trFir);
  tbWrap.appendChild(trSec);
  tbWrap.appendChild(trThr);
  table.prepend(tbWrap);
  thRem.addEventListener('click', (e) => {
    let id =
      e.target.parentNode.parentNode.firstElementChild.innerText;
    console.log(id);
    removed(id);
    serv();
  });
  thStop.addEventListener('click', (e) => {
    let id = e.target.parentNode.parentNode.firstElementChild.innerText;
    let state = e.target.parentNode.parentNode.children[1].innerText;
    console.log(state);
    if (state === "Status: stopped") {
      e.target.innerHTML = "&#9208";
      e.target.parentNode.parentNode.children[1].innerText = "Status: running";
      let date = new Date();
      log.innerHTML += "<p style='font-size:10px'>" + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + "</p>" + "<p style='font-size:10px'>" + id + "</p>" + "<p style='font-size:10px'>" + "INFO: Started" + "</p>" + "<br>";

    } else {
      e.target.parentNode.parentNode.children[1].innerText = "Status: stopped";
      const resultClose = masES.filter((s) => s.id == id);
      resultClose[0].es.close();
      e.target.innerHTML = "&#9654";
      let date = new Date();
      log.innerHTML += "<p style='font-size:10px'>" + date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + "</p>" + "<p style='font-size:10px'>" + id + "</p>" + "<p style='font-size:10px'>" + "INFO: Stopped" + "</p>" + "<br>";
    };
  });
}
