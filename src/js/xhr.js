export {
  all,
  create,
  removed,
  r,
};

function status(response) {
  console.log(response.status);
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.status))
  }
}

function json(response) {
  return response.json();
}
function text(response) {
  return response.text();
}
let r;
async function all() {

  let result = await fetch('http://localhost:7070/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
    .then(status)
    .then(json)
  return result;
}

async function create() {

  let result = await fetch('http://localhost:7070/create', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }).then(status)
    .then(json)
  return result;
}

async function removed(id) {
  let r;
  let res = await fetch('http://localhost:7070/rem', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    body: id
  }).then(
    result => {
      r = result.status;
    },
    error => {
      alert("Rejected: " + error);
    }
  );
  return r;
}