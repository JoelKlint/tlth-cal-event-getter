const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(hooks())
  .configure(socketio(socket));

const eventService = app.service('events');
eventService.on('created', message => console.log('Created a message\n', message));
eventService.on('updated', message => console.log('Updated a message\n', message));

const fetch = require('node-fetch');
const ical = require('ical');

require('babel-polyfill');

function extractEvent(event) {
  console.log(event);
  var newEvent = {}
  newEvent.id = event.uid;
  newEvent.title = event.summary;
  newEvent.description = event.description;
  newEvent.startDate = new Date(event.start.getTime());
  newEvent.endDate = new Date(event.end.getTime());
  newEvent.owner = "joel";
  return newEvent
}

cal_url = "https://calendar.google.com/calendar/ical/pv16ao64805cakbq0915he7vfk%40group.calendar.google.com/private-bb97f6057f838c79b8d7328c9af8c6e2/basic.ics";
fetch(cal_url)
.then(res => { return res.text() })
.then(data => {

  const cal = ical.parseICS(data);
  const allEvents = Object.values(cal);
  allEvents.forEach(event => {
    
  })
  console.log(Object.values(cal));
  // for(var k in cal) {
  //   if(cal.hasOwnProperty(k)) {
  //     var event = cal[k];
  //     console.log('id for ' + event.summary + ' is ' + event.uid);
  //
  //     eventService.get(event.uid)
  //     .then(event => {
  //       eventService.update(event.id, extractEvent(event)).catch(err => console.log(err))
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       if(error.code === 404) {
  //         eventService.create(extractEvent(event)).catch(err => console.log(err))
  //       }
  //     });
  //   }
  // }
})
.catch(err => console.log("fail"))


// eventService.find({query: { "$select": ["title", "startDate"] }}).then(events => console.log(events));

// eventService.create({
//   title: "Funny event",
//   startDate: new Date(),
//   endDate: new Date(),
//   description: "This is a test event",
//   owner: 1
// }).then(event => console.log(event))
// .catch(err => console.log(err));

// eventService.find().then(events => console.log(events));

cal_url = "https://calendar.google.com/calendar/ical/jbb16vovta1s5dinh36b5homi8%40group.calendar.google.com/public/basic.ics"
