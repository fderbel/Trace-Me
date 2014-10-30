TraceMe
========

TraceMe is an extension for the web browser ( Chrome, Firefox). It allows collecting basic actions of  users at client side
(mouse, key) and send them to a server (ktbs).
To use TraceMe, you must have kernel for Trace-Based Systems KTBS.
For more information about KTBS please have a look on its official documentation :https://kernel-for-trace-based-systems.readthedocs.org/en/latest/

This documentation is divided into two parts:
##### 1- User’s documentation 

The User’s documentation describes how using TraceMe directly from java script and html code, and how modifying it.

##### 2- Developers’ documentation
 
 The developers’ documentation describes each feature of TraceMe, and assists the user in realizing these features.

User’s documentation
====================== 
##### Installation :
First, you must install traceMe. An automatic installation is available on this link :

 http://dsi-liris-silex.univ-lyon1.fr/fderbel/Assist-TraceMe/Install-TraceMe.html
##### Option Form :
After, you must complete the information in the Option Form :
- The identity of user (First Name, Last Name, Email)
- The server information (Trace_URI,name of the activity) : you can add more activities, after you should select the name of trace in the popup of extention.
If you have a server collector, the server information  will be filled  automatically.

##### Configure Tracing :
Another feature of traceMe is Configure Tracing : 
You can specify the events and the element that you want to collect for a site. 
- Load your website (the site will be loaded in an iframe)
- Select the element that you want to collect it, then the selector of the element is displayed
- Press the button add event and copy the selector text in the field selector
- you can specify the obsel-type of this event

By default this extension collect , URL of a site visited.

##### Show Trace :

Developers’ documentation
====================== 
The extension TraceMe  is developed with [Kango Framework](http://kangoextensions.com/kango.html).

##### Preparation of environment to work with Kango :
Before you begin working with Kango you should make a few steps:
- Install Python 2.7 (http://www.python.org/download/).
- Download here and extract the archive with framework to any directory.

##### Creation of  project TraceMe :
- Download the archive TraceMe
- Create a directory for the project
- Run kango.py from the framework directory : 
 `python kango_dir/kango.py create "my_project_dir"`

After each code change, you must run this command to generate the output folder.

##### File :
TraceMe has the following files:

- [extension_info.json] (https://github.com/fderbel/Trace-Me/blob/master/src/common/extension_info.json): gives information about the extension, such as the most important files and the capabilities that the extension might use.
- [popup.html] (https://github.com/fderbel/Trace-Me/blob/master/src/common/popup.html) & [popup.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/popup.js):
- [options.html](https://github.com/fderbel/Trace-Me/blob/master/src/common/options.html) & [options.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/options.js):
- [background.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/background.js):
- [Collecteur.js] (https://github.com/fderbel/Trace-Me/blob/master/src/common/Collecteur.js):
- [fr.json] (https://github.com/fderbel/Trace-Me/blob/master/src/common/locales/fr.json)

##### Installation manual in Chrome
1- Download the archive

2-Visit chrome://extensions in your browser 
(or open up the Chrome menu by clicking the icon to the far right of the Omnibox: The menu's icon is three horizontal bars.. and select  Tools then Extensions  to reach the same place).
3-Ensure that the Developer mode checkbox in the top right-hand corner is checked.

4-Click Load unpacked extension… to pop up a directory-selection dialog.

5-Navigate to the directory TraceMe/output/Chrome, and select it.

##### Installation manual in Firefox
1- Download the archive

2-Open the Tools/Add-ons Manger

3-Click on the gear icon (Tools for all add-ons) > Install Add-on From File

5-Select TraceMe/output/traceme_1.0.0.xpi

