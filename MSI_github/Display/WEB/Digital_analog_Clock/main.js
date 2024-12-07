let hr = document.querySelector('#hr');
let mn = document.querySelector('#mn');
let sc = document.querySelector('#sc');

setInterval(() => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * 6;
  let ss = day.getSeconds() * 6;

  hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
  mn.style.transform = `rotateZ(${mm}deg)`;
  sc.style.transform = `rotateZ(${ss}deg)`;

  /* Digital clock */
  hour = document.getElementById('hour');
  minutes = document.getElementById('minutes');
  seconds = document.getElementById('seconds');
  ampm = document.getElementById('ampm');

  h = new Date().getHours();
  m = new Date().getMinutes();
  s = new Date().getSeconds();



  am = h >= 12 ? "PM" : 'AM';

  /*Add zero before the number*/
  h = (h < 10) ? "0" + h : h
  m = (m < 10) ? "0" + m : m
  s = (s < 10) ? "0" + s : s

  /*Convert 24hr clock into 12hr clock*/
  if (h > 12) {
    h = h - 12
  }
  hour.innerHTML = h;
  minutes.innerHTML = m;
  seconds.innerHTML = s;
  ampm.innerHTML = am;
});