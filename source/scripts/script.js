import { router } from './router.js'
const setState = router.setState;

window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar');
let calendar = document.querySelector('calendar-elem');
calendarLogo.addEventListener('click', function(){
    setState({state: 'calendar'}, false);
    calendar.render(); 
})

let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function() {
  setState({state: 'notes'}, false);
});

let logoutLogo = document.querySelector('#logout');
logoutLogo.addEventListener('click', function(){
    window.location.href = "login.html";
})