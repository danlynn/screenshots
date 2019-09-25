## Screenshots

This node app makes screenshots from all the urls listed one-per-line in the `RecipePages.txt` file.  The screenshots are saved as either png or pdf files in the `screenshots/screenshots-<format>` directories.

This node app is a work-in-progress.  So... there are lots of places where config and options could be added to make it more flexible.  For now, it is a useful proof of concept.

---

### Usage

1. Run the `./bash.rb` script

   ```bash
   $ ./bash.rb
     
   Launching bash
   
   DEVTOOLS: Opening chrome browser...
   DEVTOOLS: [0925/141349.756623:ERROR:socket_posix.cc(145)] bind() failed: Address already in use (48)
   DEVTOOLS:
   DEVTOOLS:     DevTools listening on: ws://host.docker.internal:9222/devtools/browser/2853d4ed-9cbd-4e5b-b4ac-a59c3336a6a5
   DEVTOOLS:
   DEVTOOLS:     Exit browser with 'kill 43795'
   ```

   This starts a docker container where you can run the node app, run npm install, etc.  Note that before the docker container is started, a new --headless chrome instance is started.  The --headless chrome instance is started in devtools mode and writes the devtools connection url to the `.dev_tools_url` file upon launch.
2. Run the `screenshots.js node app`

   ```bash
   # node screenshots.js
   ```

   This will process all of the urls in the `RecipePages.txt` file until complete.

3. Exit from the docker container with a ctrl-d.

4. Kill the --headless chrome instance by typing the command that was listed when starting it up.

   ```bash
   $ kill 43795
   DEVTOOLS:
   DEVTOOLS:     browser closed
   ```

   If the browser was not started in --headless mode then you can simply quit that instance of chrome in the usual manner (or kill it).
   
   The browser does not exit automatically after the script is ran because it is useful to keep it running during development.
   
   When the browser exits, it will delete the `.dev_tools_url` file that was created upon launch.
---

### Customization

#### Headless Mode

Headless mode can be enabled/disabled by adding or removing the `--headless` option to the chrome launch command in the `open_browser.rb` script.  It is useful to NOT run in --headless mode during development so that you can visually observe the rendering of the pages.

#### Screenshot Format

Either a PDF or PNG may be created for the screenshot depending on the value assigned in line 52 of the `screenshots.js` script.

```javascript
const format = 'pdf'
```

   Note that the pdf format can ONLY be used when chrome is running in --headless mode.

#### Setting Screenshot Screensize

You man need to play with the html page size a bit to make the screenshots come out the way that you like.  This can be done by modify the following values on line 40 of the `screenshots.js` script.

```javascript
    width: 1200,
    height: 6000
```

   Note that the height has to be pretty tall in order to be taller than the max height of any page being rendered.
