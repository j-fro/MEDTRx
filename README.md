#MEDTR<sub>x</sub>

MEDTR<sub>x</sub> is a single page web app and companion IoT device to help users and their families keep track of their medication intake. Users log their daily medication intake using the MEDTR<sub>x</sub> Organizer and can view their current track record and history on the MEDTR<sub>x</sub> Dashboard online. From there, users can opt-in to SMS reminders if they are late, and even duplicate reminders to family, friends, or their physician.

##Installation

To set up the MEDTR<sub>x</sub> web server locally:
* Ensure you have Node.js installed: https://nodejs.org/en/
* Install dependencies using `npm install`
* MEDTR<sub>x</sub> requires a SQL DBMS to be present and a database URI at `DATABASE_URL` in the environment. MEDTR<sub>x</sub> was developed with [PostgreSQL](https://www.postgresql.org/) and [node-postgres](https://github.com/brianc/node-postgres).
    * Use your choice of SQL management tool to run `/database/create-tables.sql`
    
