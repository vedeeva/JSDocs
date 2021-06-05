
// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAaAx6HT1qq_mZIZLggvj8EzL5ctI0mQfA",
  authDomain: "pageone-c741e.firebaseapp.com",
  projectId: "pageone-c741e",
  storageBucket: "pageone-c741e.appspot.com",
  messagingSenderId: "752294608481",
  appId: "1:752294608481:web:2bad0f544ed9d91584b420",
  databaseURL: "https://pageone-c741e-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(firebaseConfig);

import { router } from './router.js'
const setState = router.setState;

var userId = "";

var tempArray = new Map();   // hashmap to store notes locally
var currId = "";
//console.log(tempArray.size);


var filterArr = {}; // arr to filter for specific notes

  // temp arr for storing notes until Firebase is fully implemented

var eventArr = {};



// *********************************************
// state changes
// *********************************************
window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar')


let calendar = document.querySelector('calendar-elem');
calendarLogo.addEventListener('click', function () {
  setState({ state: 'calendar' }, false);
  calendar.render();

});


let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function () {
  setState({ state: 'notes' }, false);
});

let logoutLogo = document.querySelector('#logout');

logoutLogo.addEventListener('click', function () {
  firebase.auth().signOut().then(() => {
    console.log('user signed out');
  })
  window.location.href = "login.html";
});

// *********************************************
// Enable/Disable 'bold' for notes
// *********************************************
var text = document.getElementById("info");
let bold = document.querySelector('img[class="bold"]');
bold.addEventListener('click', function () {
  text.style.fontWeight = text.style.fontWeight == 'bold' ? 'normal' : 'bold';
});

// Enable/Disable 'italics' for notes
// let italics = document.querySelector('img[class="italics"]');
// italics.addEventListener('click', function() {
//   text.value.italics();
// });




// *********************************************
// 'New Note' onclick
// *********************************************
let newNote = document.querySelector('button[type="new_note"]');
newNote.addEventListener('click', function () {
  // shows input form when pressing 'New Note' button
  var form = document.getElementById("noteinput");
  form.style.display = "block";
  document.getElementById("title").value = "";
  document.getElementById("info").value = "";
  document.getElementById('tag').selectedIndex = 0;
  title = undefined;
  if(document.getElementById('tagDiv') != null){
    let tagDiv = document.getElementById('tagDiv');
    tagDiv.remove();
  }

  // create new entry
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled"; // title of the note
  var content = document.getElementById('info').value;  // main text; the body of the note
  var tag = document.getElementById('tag').value;       // note tag
  // let newPost = document.createElement('note-elem');    // new Notes obj as defined in notes.js
  var newButton = document.createElement("button");                                                         // button for the new note
  var notes_list = document.getElementById('noteslist');                                                    // list of note buttons

  // sets the text inside the button to the note's title, then appends it to the list
  newButton.innerHTML = title;

  // hashing for unique entry id
  let id = Math.floor(Math.random() * 1000000000);
  newButton.id = id;
  newButton.className = "notes";


  // add to notelist
  notes_list.appendChild(newButton);

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  let eventStart = '';
  let eventEnd = '';
  //newPost.entry = { "title": title, "content": content, "date": date, "tag": tag };
  let entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "eventStart": eventStart, "eventEnd": eventEnd };

  // Saves the new Note obj in tempArray, then empties the form
  tempArray.set(newButton.id, entry);

  // new note, currId should be empty
  currId = newButton.id;
  newButton.addEventListener('click', function () {
    let entry = tempArray.get(newButton.id);
    form.style.display = "block";
    document.getElementById('title').value = entry.title;
    document.getElementById('info').value = entry.content;
    document.getElementById('tag').value = entry.tag;
    if(entry.tag == 'Event'){
      if(document.getElementById('tagDiv') == null){
        let mainDiv = document.querySelector('.float-child-three');
        let tagDiv = document.createElement('div');
        tagDiv.setAttribute('id', 'tagDiv');
        let dateInfo = document.createElement('p');
        dateInfo.innerHTML = 'Select Start And End Date:';

        let dateSelectStart = document.createElement('input');
        dateSelectStart.setAttribute('type', 'date');
        dateSelectStart.setAttribute('id', 'date1');
        let dateSelectEnd = document.createElement('input');
        dateSelectEnd.setAttribute('type', 'date');
        dateSelectEnd.setAttribute('id', 'date2');

        tagDiv.appendChild(dateInfo);
        tagDiv.appendChild(dateSelectStart);
        tagDiv.appendChild(dateSelectEnd);

        let timeInfo = document.createElement('p');
        timeInfo.innerHTML = 'Select Start And End Time:';
        let timeStart = document.createElement('input');
        timeStart.setAttribute('type', 'time')
        timeStart.setAttribute('id', 'time1');
        let timeEnd = document.createElement('input');
        timeEnd.setAttribute('type', 'time');
        timeEnd.setAttribute('id', 'time2');

        tagDiv.appendChild(timeInfo);
        tagDiv.appendChild(timeStart);
        tagDiv.appendChild(timeEnd);
        mainDiv.appendChild(tagDiv);
      }
      let startDate = entry.eventStart;
      let endDate = entry.eventEnd;
      if(startDate != ''){
        document.getElementById('date1').value = startDate.substring(0,10);
        document.getElementById('time1').value = startDate.substring(11,startDate.length);
      }
      if(endDate != ''){
        document.getElementById('date2').value = endDate.substring(0,10);
        document.getElementById('time2').value = endDate.substring(11,startDate.length);
      }
    }
    else{
      if(document.getElementById('tagDiv') != null){
        let eventSelect = document.getElementById('tagDiv');
        eventSelect.remove();
      }
    }
    console.log(newButton.id);
    currId = newButton.id;
  });

  // save to Firebase
  var pushID = firebase.database().ref().child("users/" + userId + "/entries").push(entry).getKey();
  //console.log(entry.id + " saved");
  //console.log(pushID);
  firebase.database().ref().child("users/" + userId + "/entries/" + pushID).update({ 'firebaseID': pushID });

  entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "eventStart": eventStart, "eventEnd": eventEnd, "firebaseID": pushID };
  tempArray.set(newButton.id, entry);
});


// *********************************************
// 'Save" onclick
// *********************************************
let saveButton = document.querySelector('button[class="save"]');
saveButton.addEventListener('click', function () {
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled";
  var notes_list = document.getElementById('noteslist');
  var content = document.getElementById('info').value;  // main text; the body of the note
  var tag = document.getElementById('tag').value;


  // entry already exists, update contents only
  let entry = tempArray.get(String(currId));
  // console.log(tempArray);
  // console.log(entry);
  entry.title = title;
  entry.content = content;
  entry.tag = tag;
  if(tag == 'Event'){
    let eventStartDate = document.getElementById('date1').value;
    let eventStartTime = document.getElementById('time1').value;
    let eventStart = eventStartDate + 'T' + eventStartTime;
    entry.eventStart = eventStart;

    let eventEndDate = document.getElementById('date2').value;
    let eventEndTime = document.getElementById('time2').value;
    let eventEnd = eventEndDate + 'T' + eventEndTime;
    entry.eventEnd = eventEnd;
  }


  let currButton = document.querySelector(`button[id="${currId}"]`);
  currButton.innerHTML = title;

  // save to Firebase
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).set(entry);
  
  var tag = document.getElementById('tag').value;      // note tag

  // if (!(title in tempArray) && title != '' && tag == 'Event'){
  //   let eventDate = document.getElementById('date').value;
  //   eventArr[title] = eventDate;
  //   //console.log(eventArr);
  // }

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  // Also resets the forms to be empty
  if (!(title in tempArray) && title != '') { // it will only save if title is unique or not empty
    // newPost.entry = { "title": title, "content": content, "date": "10/10/10", "tag": tag }
    // tempArray[title] = newPost;
    document.getElementsByName('title')[0].value = ''; // did this to fix a strange bug
    document.getElementById("info").value = '';
    document.getElementById('tag').selectedIndex = 0;
    filterArr[title] = tag;
    //console.log(document.getElementsByName('title')[0]); // did this to fix a strange bug
    title = undefined;
  }

  if(document.getElementById('date') != null){
    let dateElem = document.getElementById('date');
    dateElem.remove();
  }

  updateReminders();

});

// *********************************************
// 'Delete" onclick
// *********************************************
let deleteButton = document.querySelector('button[class="delete"]');
deleteButton.addEventListener('click', function () {
  // delete from Firebase
  let entry = tempArray.get(currId);
  // console.log(tempArray);
  // console.log(entry);
  // console.log(currId);
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).remove();

  tempArray.delete(currId);
  let button = document.querySelector(`button[id="${currId}"]`);
  button.remove();
  document.getElementById("noteinput").style.display = "none";
  updateReminders();
});

// *********************************************
// Search bar
// *********************************************
var search = document.getElementById('search');
search.addEventListener('input', function () {

  //console.log(searchArr);


  //Delete current note list to make room for filtered search
  let currList = document.getElementById('noteslist');
  currList.remove();
  //Create new list which we will append searched values to
  let newList = document.createElement('ul');
  newList.setAttribute('class', 'notes_arr');
  newList.setAttribute('id', 'noteslist');
  let searchDiv = document.querySelector('.left-half');

  let searchStr = search.value;
  for (const [key, value] of tempArray.entries()) {

    let currTitle = value.title;

    if (currTitle.includes(searchStr)) {
      let currButton = document.createElement('button');
      currButton.innerHTML = currTitle;
      currButton.className = "notes";

      currButton.addEventListener('click', function () {

        document.getElementById('title').value = value.title;
        document.getElementById('info').value = value.content;
        document.getElementById('tag').value = value.tag;
  
      });

      newList.appendChild(currButton);
    }
  }
  searchDiv.appendChild(newList);

});


// *********************************************
// Firebase
// *********************************************

// Sets the main page with firebase properties
// Loads the notes
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    //console.log(firebaseUser);
    var notes_list = document.getElementById('noteslist');
    var greeting = document.getElementsByClassName("greeting")[0].children[0];
    greeting.innerHTML = "Hi, " + firebaseUser.displayName;
    userId = firebaseUser.uid;
    firebase.database().ref().child("users/" + userId + "/entries/").once("value").then(function (e) {
      for (var key in e.val()) {
        let entry = e.val()[key];
        let newButton = document.createElement("button");
        newButton.className = "notes";
        newButton.innerHTML = entry.title;
        newButton.id = entry.id;
        tempArray.set(entry.id, entry);
        notes_list.appendChild(newButton);

        newButton.addEventListener('click', function () {
          document.getElementById("noteinput").style.display = "block";
          document.getElementById('title').value = entry.title;
          document.getElementById('info').value = entry.content;
          currId = newButton.id;
        });
      }

    });
  } else {
    console.log('Not logged in');
  }

});




// works very similarly to the search method
var dropMenu = document.getElementById('Notes');
dropMenu.addEventListener('change', function () {
  //console.log('test');
  //console.log(filterArr);
  //Delete current note list to make room for filtered search
  let currList = document.getElementById('noteslist');
  currList.remove();
  //Create new list which we will append searched values to
  let newList = document.createElement('ul');
  newList.setAttribute('class', 'notes_arr');
  newList.setAttribute('id', 'noteslist');
  let searchDiv = document.querySelector('.left-half');

  let filterStr = dropMenu.value;
  if (filterStr == 'All') {
    for (let title in filterArr) {
      let currButton = document.createElement('button');
      currButton.innerHTML = title;
      currButton.id = title;
      currButton.className = "notes";
      newList.appendChild(currButton);
    }
  } else {
    for (let title in filterArr) {
      if (filterArr[title] == filterStr) {
        let currButton = document.createElement('button');
        currButton.innerHTML = title;
        currButton.id = title;
        currButton.className = "notes";
        newList.appendChild(currButton);
      }
    }
  }
  searchDiv.appendChild(newList);


  let buttons2 = document.getElementsByClassName("notes");

  for (let button of buttons2) {
    button.addEventListener('click', function () {
      var temp = tempArray[button.id];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
      document.getElementById('tag').value = temp.entry.tag;




    });
  }
});


var tagSelect = document.getElementById('tag');
tagSelect.addEventListener('input', function(){
  if(tagSelect.value == 'Event'){
    let mainDiv = document.querySelector('.float-child-three');
    let tagDiv = document.createElement('div');
    tagDiv.setAttribute('id', 'tagDiv');
    let dateInfo = document.createElement('p');
    dateInfo.innerHTML = 'Select Start And End Date:';

    let dateSelectStart = document.createElement('input');
    dateSelectStart.setAttribute('type', 'date');
    dateSelectStart.setAttribute('id', 'date1');
    let dateSelectEnd = document.createElement('input');
    dateSelectEnd.setAttribute('type', 'date');
    dateSelectEnd.setAttribute('id', 'date2');

    tagDiv.appendChild(dateInfo);
    tagDiv.appendChild(dateSelectStart);
    tagDiv.appendChild(dateSelectEnd);

    let timeInfo = document.createElement('p');
    timeInfo.innerHTML = 'Select Start And End Time:';
    let timeStart = document.createElement('input');
    timeStart.setAttribute('type', 'time')
    timeStart.setAttribute('id', 'time1');
    let timeEnd = document.createElement('input');
    timeEnd.setAttribute('type', 'time');
    timeEnd.setAttribute('id', 'time2');

    tagDiv.appendChild(timeInfo);
    tagDiv.appendChild(timeStart);
    tagDiv.appendChild(timeEnd);
    mainDiv.appendChild(tagDiv);
  }
  else{
    if(document.getElementById('tagDiv') != null){
      let eventSelect = document.getElementById('tagDiv');
      eventSelect.remove();
    }
  }
});

// *********************************************
// Reminders Tab
// *********************************************
// Checks if an event is within the next week and will display the event in the case that it is.
function updateReminders(){
  if(document.getElementById('eventsList') != null){
    let reminders = document.getElementById('eventsList');
    reminders.remove()
  }
  let container = document.querySelector('.reminders');
  let remindersUl = document.createElement('ul');
  remindersUl.setAttribute('id', 'eventsList');
  for(const [key, value] of tempArray.entries()){
    if(value.tag == 'Event'){
      let today = new Date();
      today.setHours(0,0,0,0)
      let day = String(today.getDate()).padStart(2, '0');
      let month = String(today.getMonth() + 1).padStart(2, '0');
      let year = today.getFullYear();

      let eventDate = String(value.eventStart).substring(0,10);
      if(month == '02'){
        if(Number(day) > 21){
          let maxDay = 7 - 28 + Number(day);
          let maxDate = year + '-03-' + String(maxDay);
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
        else{
          let maxDay = 7 + Number(day);
          let maxDate = year + '-02-' + String(maxDay);
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
      }
      else if(month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12'){
        if(Number(day) > 24){
          let maxDate;
          let maxDay = 7 - 31 + Number(day);
          if(month == '12'){
            maxDate = year + '-01-' + String(maxDay);
          }
          else{
            let newMonth = Number(month) + 1;
            maxDate = year + '-' + String(newMonth).padStart(2,0) + '-' + String(maxDay);
          }
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
        else{
          let maxDay = 7 + Number(day);
          let maxDate = year + '-' + month + '-' + String(maxDay);
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
      }
      else{
        if(Number(day) > 24){
          let maxDay = 7 - 30 + Number(day);
          let newMonth = Number(month) + 1;
          let maxDate = year + '-' + String(newMonth).padStart(2,0) + '-' + String(maxDay);
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
        else{
          let maxDay = 7 + Number(day);
          let maxDate = year + '-' + month + '-' + String(maxDay);
          let compDate = new Date(maxDate);
          compDate.setHours(0,0,0,0);
          let compEvent = new Date(eventDate);
          compEvent.setHours(0,0,0,0);
          if(compEvent <= compDate && compEvent >= today){
            let item = document.createElement('li');
            item.innerHTML = value.title;
            remindersUl.appendChild(item);
          }
        }
      }
    }
  }

  container.appendChild(remindersUl);
}

