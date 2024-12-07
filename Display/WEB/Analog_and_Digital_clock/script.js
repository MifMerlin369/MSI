const handHour = document.querySelector('.hour')
const handMin = document.querySelector('.min')
const handSec = document.querySelector('.sec')
const digSec = document.querySelector('.seconds')
const digMin = document.querySelector('.minutes')
const digHour = document.querySelector('.hours')
const digAmpm = document.querySelector('.ampm')
const calendar = document.querySelector('.date')
const day = document.querySelector('.day')
const date = new Date();

let dd = date.getDate();
let mm = date.getMonth();
let yy = date.getFullYear();
let month = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
let today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

calendar.innerHTML = dd + ' / ' + month[mm] + ' / ' + yy;
day.innerHTML = today[date.getDay()];


setInterval(loop);

function loop() {
  const date = new Date();
  let hs = date.getSeconds() * 6;
  let hm = date.getMinutes() * 6;
  let hh = date.getHours() * 30;
  handSec.style.transform = `rotateZ(${hs}deg)`
  handMin.style.transform = `rotateZ(${hm+(hs/60)}deg)`
  handHour.style.transform = `rotateZ(${hh+(hm/12)}deg)`


  ds = date.getSeconds();
  dm = date.getMinutes();
  dh = date.getHours();


  let ap;
  if (dh < 12) {
    ap = 'AM';
  } else {
    ap = 'PM';
  }
  if (dh == 0) {
    dh = 12;
  }
  if (dh > 12) {
    dh -= 12;
  }
  if (ds < 10) {
    ds = '0' + ds;
  }
  if (dm < 10) {
    dm = '0' + dm;
  }
  if (dh < 10) {
    dh = '0' + dh;
  }


  digSec.innerHTML = ds
  digMin.innerHTML = dm
  digHour.innerHTML = dh
  digAmpm.innerHTML = ap
}

loop();