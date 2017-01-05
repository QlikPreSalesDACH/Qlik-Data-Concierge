# Qlik Data Concierge (QDC)

####**Qlik Data Concierge in action**

 [![Qlik Data Concierge in action](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/master/IMAGES/index.jpg)](https://www.youtube.com/watch?v=MsRgWh_7Xs4)

####**What is it?**

An advanced self-service solution for non-technical users. It widens the standard Qlik Sense self-service use cases by reusing data source specific structures and metadata. Additionally it provides modern mashup-based wizards for the business users with Sense API usage plus enhanced scripting in the background.
This QDC framework is **highly customizable** and can be used to provide **true data self-service solutions in combination with any fast Big Data or non-Big Data source** as long as there is a driver or a connector available for the specific data source.

It is shipped with 4 predefined use cases:

  - SAP BW Query Wizard - for SAP BW Query power users
  - SAP HANA Wizard - for SAP HANA power users. It also creates Direct Discovery based load scripts
  - SAP BW Live Dashboard Wizard - for any kind of business user (based on an nice Dashboard template and the ODAG extension)
  - SAP HANA Live Dashboard - ODAG + Direct Discovery on a 100 million records fact table

----------


####**What it is not?**

It is not a built-in function of Qlik Sense. It is rather an example solution, a self-service app providing access to **SAP BEx queries**, to **other SAP structures**, **Big Data systems** or **high-performance databases**. It will most likely need customizations or adaptations to run on a productive customer environment. We work closely with Qlik Consulting Services to offer this as a Solution Services package - the customize outcome of which could be supported by Qlik Services according to individual agreements with the customer. Please see also below, section “Implementation”.


----------


####**What's the motivation?**

The Qlik Data Concierge (QDC) has been developed to fulfill Enterprise IT demands, providing self-service live access to **SAP structures**, **Big Data systems**, **high-performance databases** and other **operative data sources** for business users.


----------


####**How does it work?**

The QDC is a 2 component solution. The **first component** of the solution is a Qlik Sense document (.qvf) which helps you to collect the metadata of your necessary BEx Query's out of your SAP BW System(s).

 - Define your SAP BW system(s)
 - Define a set of possible BEx Query's
 - Delivers selection-dialogue-information to Frontend (Mashup)

After that this qvf file delivers all necessary metadata-information to the Frontend within the green, white and grey logic from Qlik Solutions.

The **second component** is a Webmashup. The Mashup enables the user to select the BEx Query containing the necessary filter-logic.

 - Web-based UI 
 - Selection-logic wizard
 - Self-Service Load-Script-Generation
 - Ad-hoc App-Generation process

----------


####**Where do I find a documentation?**

The documentation for Qlik Data Concierge will be maintained through the internal WIKI section of this repository.

- [Go to documentation](https://github.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/wiki)


----------



####**Contribution**

 **I like to build my own Data-Acquisition-Wizard based on a different data source e.g. Hadoop etc.**
 
*You are welcome! We are highly interested to gain your contribution. Please contact Qlik PreSales Organization.*
 


----------


####**Implementation**
 **I like to implement the solution in a production environment. Where can I get assistance from?**
 
 *Please contact Qlik Consulting Services to gain help in your project.*
 


----------

 
Process-Overview of QDC:

![Process-overview](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Concierge/master/IMAGES/Process%20Overview.png)


----------
Welcome to QDC:

![Welcomescreen](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/master/IMAGES/index.jpg)


----------
QDC BEx Wizard:

![Mashupe](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/master/IMAGES/Bex%20Wizard.png)


----------
QDC HANA Wizard:

![Mashupe](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/master/IMAGES/HANA%20Wizard.png)

----------
QDC Live Dashboard:

![Mashupe](https://raw.githubusercontent.com/QlikPreSalesDACH/Qlik-Data-Qoncierge/master/IMAGES/Live%20Dashboard.png)

