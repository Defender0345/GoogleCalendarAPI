const { google } = require('googleapis');

const { OAuth2 } = google.auth;

// Get this info from https://console.cloud.google.com/apis/credentials/oauthclient/
// Its the client ID and client secret
const oAuth2Client = new OAuth2(
);

// Get this info from https://developers.google.com/oauthplayground/ after registering
oAuth2Client.setCredentials({
  refresh_token:
    ,
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// TODO: Fix the times, puts the event 20 days prior to current date
// This is where the form input information would be set instead of a const
const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDay() + 2);

const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDay() + 4);

const event = {
  summary: 'Meeting',
  location:
    'Centenary Drive, Intersection of N2 & R44 Somerset West, Somerset West, 7130',
  description: 'Discuss new project',
  start: {
    dateTime: eventStartTime,
    timeZone: 'Africa/Johannesburg',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'Africa/Johannesburg',
  },
  colorId: 1,
};

// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/Denver',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err);

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy;

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        (err) => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err);
          // Else log that the event was created.
          return console.log('Calendar event successfully created.');
        }
      );

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`);
  }
);
