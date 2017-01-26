#MEDTR<sub>x</sub>

MEDTR<sub>x</sub> is a single page web app and companion IoT device to help users and their families keep track of their medication intake. Users log their daily medication intake using the MEDTR<sub>x</sub> Organizer and can view their current track record and history on the MEDTR<sub>x</sub> Dashboard online. From there, users can opt-in to SMS reminders if they are late, and even duplicate reminders to family, friends, or their physician.

##Installation

To set up the MEDTR<sub>x</sub> web server locally:
* Ensure you have Node.js installed: https://nodejs.org/en/
* Install dependencies using `npm install`
* MEDTR<sub>x</sub> requires a SQL DBMS to be present and a database URI at `DATABASE_URL` in the environment. MEDTR<sub>x</sub> was developed with [PostgreSQL](https://www.postgresql.org/) and [node-postgres](https://github.com/brianc/node-postgres).
    * Use your choice of SQL management tool to run `/database/create-tables.sql`
* In order to use the notification system, Twilio and Sendgrid accounts and API keys are required.
    * For text integration with Twilio, the following environment variabls must be set:
        * `TWILIO_ACCOUNT_SID`
        * `TWILIO_AUTH_TOKEN`
        * `TWILIO_NUMBER`
    * For email integration with Sendgrid, the following environment variable must be set:
        * `SENDGRID_API_KEY`

##Dashboard

The MEDTR<sub>x</sub> Dashboard allows users to easily track their medication intake based on data provided by the MEDTR<sub>x</sub> Organizer. Registration for the Dashboard is free but requires a valid Organizer Device ID to be used effectively.

On logging in with an email and password, users are greeted by their personal Dashboard, which allows at a glance viewing of their weekly track record:
![Dashboard example](/docs/images/dashboard.png)

Users can also view their record from earlier weeks (going back to their first check in with the Organizer) from the `History` button on the Dashboard:
![History example](/docs/images/history.png)

On the profile tab, users can save the time they want to be reminded and what contact numbers to send reminders to:
![Profile example](/docs/images/profile.jpg)

##Technologies Used
* Node.js
* Express.js
* AngularJS
* PostgreSQL
* Particle Photon
* Bootstrap
* Passport
* bcrypt
* Twilio
* Sendgrid
* node-schedule
