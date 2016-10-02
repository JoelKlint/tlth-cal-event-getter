const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(hooks())
  .configure(socketio(socket));

const eventService = app.service('events');
eventService.on('created', event => console.log('Created an event\n', event));
eventService.on('updated', event => console.log('Updated an event\n', event));

const fetch = require('node-fetch');
const ical = require('ical');

require('babel-polyfill');

function convertGoogleEvent(googleEvent) {
  var newEvent = {}
  newEvent.id = googleEvent.uid;
  newEvent.title = googleEvent.summary;
  newEvent.description = googleEvent.description;
  newEvent.startDate = new Date(googleEvent.start.getTime());
  newEvent.endDate = new Date(googleEvent.end.getTime());
  newEvent.owner = "joel";
  return newEvent
}

cal_url = "https://calendar.google.com/calendar/ical/pv16ao64805cakbq0915he7vfk%40group.calendar.google.com/private-bb97f6057f838c79b8d7328c9af8c6e2/basic.ics";
fetch(cal_url)
.then(res => { return res.text() })
.then(data => {

  const cal = ical.parseICS(data);
  const allEvents = Object.values(cal);
  allEvents.forEach(googleEvent => {

    eventService.get(googleEvent.uid)
    .then(serverEvent => {
      console.log('event existed');
      const convertedEvent = convertGoogleEvent(googleEvent);
      eventService.update(convertedEvent.id, convertedEvent).catch(err => console.log(err))
    })
    .catch(error => {
      console.log('event could not be found')
      if(error.code === 404) {
        const convertedEvent = convertGoogleEvent(googleEvent);
        eventService.create(convertedEvent).catch(err => console.log(err))
      }
    })

  })
})
.catch(err => console.log("fail"))

// eventService.find({query: { "$select": ["title", "startDate"] }}).then(events => console.log(events));
