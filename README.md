TraceMe
========


TraceMe is an extension for the web browser ( Chrome, Firefox). It allows users to collect basic actions of users at client side (mouse, key) and send them to a trace based management system (TBMS). Such a TBMS is currently available (kTBS) for installation on any server. Collected traces are stored through this TBMS on a specific server which has to be identified.

For more information about KTBS you may have a look on the official documentation :https://kernel-for-trace-based-systems.readthedocs.org/en/latest/

The TraceMe documentation is structured in two parts:
##### 1- User’s documentation 

 The user’s documentation describes each feature of TraceMe, and assists the user in exploiting these features.

##### 2- Developers’ documentation
 
The developers’ documentation gives you tips on how to use TraceMe directly from java script and html code, and how to modify it.

User’s documentation
====================== 
##### Installation :
First, you must install traceMe. An automatic installation is available on this link :

 http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assist-TraceMe/Install-TraceMe.html
 
##### Filling the Option Form :
After having installed the extension, you must complete the information in the Option Form :
- Identity of user (First Name, Last Name, Email)
- Server information (Trace_URI = name of the traced activity) : you can add more traced activities, after what you should select the name of the traced activity in the extension popup.
If you have a server collector, the server information  will be filled  automatically.

##### Configuring the Tracing :

You can specify the elements  you want to collect for a site: 
* 1) Load the targeted website (the site will be loaded in an iframe);
* 2) Select an element that you want to collect in;  the selector of the element is displayed;
* 3) Pressing the button adds this element as an element to be traced when interacted by the user;
* 4) copy the selector text in the field selector
* 5) you can give a type to this element (obsel-type = type of observed element).

By default, if you do not specify what has to be traced in a web page, traceMe collects only the URL of the visited web page.

##### Visualizing the Trace :

To be done.

Developers’ documentation
====================== 
The extension TraceMe  is developed with [Kango Framework](http://kangoextensions.com/kango.html).

##### Preparation of environment to work with Kango:
Before you begin working with Kango you have to check the environment and, if necessary, to install it:
- Install Python 2.7 (http://www.python.org/download/).
- Download here and extract the archive with framework to any directory.

##### Creation of a TraceMe project:

- Create a directory for the project
- Download the archive TraceMe in this directory
- Run kango.py from the framework directory: 
 `python kango_dir/kango.py create "my_project_dir"`

After each code modification, you have to run this command to generate the output folder.

##### File :
TraceMe uses the following files:

- [extension_info.json] (https://github.com/fderbel/Trace-Me/blob/master/src/common/extension_info.json): gives information about the extension, such as the most important files and the capabilities that the extension might use.
- [popup.html] (https://github.com/fderbel/Trace-Me/blob/master/src/common/popup.html) & [popup.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/popup.js): to be explained.
- [options.html](https://github.com/fderbel/Trace-Me/blob/master/src/common/options.html) & [options.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/options.js): to be explained.
- [background.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/background.js): to be explained.
- [Collecteur.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/Collecteur.js): to be explained.
- [fr.json] (https://github.com/fderbel/Trace-Me/blob/master/src/common/locales/fr.json): to be explained

##### Manual installation in Chrome
* 1- Download the archive
* 2- Visit chrome://extensions in your browser 
(or open up the Chrome menu by clicking the icon to the far right of the Omnibox: The menu's icon is three horizontal bars.. and select  "Tools then Extensions"  to reach the same place).
* 3- Ensure that the Developer mode checkbox in the top right-hand corner is checked.
* 4- Click "Load unpacked extension…" to pop up a directory-selection dialog.
* 5- Navigate to the directory TraceMe/output/Chrome, and select it.

##### Manual installation in Firefox
* 1- Download the archive
* 2- Open the Tools/Add-ons Manger
* 3- Click on the gear icon (Tools for all add-ons) > Install Add-on From File
* 5- Select TraceMe/output/traceme_1.0.0.xpi in your local archive




