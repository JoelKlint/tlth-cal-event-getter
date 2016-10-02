const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

const fetch = require('node-fetch');
const ical = require('ical');
require('babel-polyfill');

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(hooks())
  .configure(socketio(socket));

const eventService = app.service('events');
eventService.on('created', event => console.log('Created event:', event.title));
eventService.on('updated', event => console.log('Updated event:', event.title));

function convertGoogleEvent(googleEvent) {
  var newEvent = {}
  newEvent.id = googleEvent.uid;
  newEvent.title = googleEvent.summary;
  newEvent.description = googleEvent.description;
  newEvent.startDate = new Date(googleEvent.start.getTime());
  newEvent.endDate = new Date(googleEvent.end.getTime());
  newEvent.owner = guild.name;
  return newEvent
}

function updateServerFromSource(cal_url) {
  fetch(cal_url)
  .then(res => res.text())
  .then(data => {

    const cal = ical.parseICS(data);
    const allEvents = Object.values(cal);
    allEvents.forEach(googleEvent => {

      eventService.get(googleEvent.uid)
      .then(serverEvent => {
        const convertedEvent = convertGoogleEvent(googleEvent);
        eventService.update(convertedEvent.id, convertedEvent).catch(err => console.log(err))
      })
      .catch(error => {
        if(error.code === 404) {
          const convertedEvent = convertGoogleEvent(googleEvent);
          eventService.create(convertedEvent).catch(err => console.log(err))
        }
      })

    })
  })
  .catch(err => console.log("fail"))
}

const study_cal = "https://calendar.google.com/calendar/ical/pv16ao64805cakbq0915he7vfk%40group.calendar.google.com/private-bb97f6057f838c79b8d7328c9af8c6e2/basic.ics";
const welcome_cal = "https://calendar.google.com/calendar/ical/ih2i0ql1va1f3s44gia3oaujmg%40group.calendar.google.com/public/basic.ics";

const guild = {
  name: 'Test Guild',
  eventSources: {
    study: [ study_cal ],
    industry: [],
    recreational: [ welcome_cal ]
  }
};

const guilds = [ guild ];

/*
* Start the importing
*/
guilds.forEach(guild => {

  const studySources = guild.eventSources.study;
  studySources.forEach(studySource => {
    updateServerFromSource(studySource);
  });

  const industrySources = guild.eventSources.industry;
  industrySources.forEach(industrySource => {
    updateServerFromSource(industrySource);
  });

  const recreationalSources = guild.eventSources.recreational;
  recreationalSources.forEach(recreationalSource => {
    updateServerFromSource(recreationalSource);
  });

});
