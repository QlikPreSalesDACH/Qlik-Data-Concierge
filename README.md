# Qlik-Data-Qoncierge

###What is it?

A self-service solution for non-technical BEx users based on Qlik Sense, the Qlik SAP BEx Connector, a web wizard to select the BEx query and its parameters and the Sense API (on-demand app generation) to generate a new app filled with cached BEx data..

###What it is not?

It is not (yet) a supported or built-in function of Qlik Sense. It is rather an example solution for Self-service access to BEx, and perhaps, in the future, to other SAP structures, Big Data systems or high-performance databases. It will most likely need customizations or adaptations to run on a productive customer environment. We work closely with Qlik Consulting Services to offer this as a Solution Services package - the customize outcome of which could be supported by Qlik Services according to individual agreements with the customer.

###What's the motivation?

We see BW on HANA as the preferred, long-term IT strategy in most of the large enterprise accounts in Germany, Switzerland and many other sales regions. BEx queries are designed by SAP for Self-Service data consumption by the business user as they generally provide rather small, aggregated data sets based on the user's individual selection of dimension, measures and variables. As the old SAP BEx Analyzer Excel plugin is phased out, newer, more modern, web based ad-hoc visualization and reporting tools offered by SAP itself (e.g. BO Web Analyzer, Report Designer) and other competitors like Tableau start to fill the gap with their promises of rich & advanced analytical features combined with direct (live) connection to BEx queries. With the shift towards BW systems boosted by HANA, this notion of "live" consumption of BEx queries by the self-service user becomes a key requirement for any new (strategic) BI project in the enterprise.
Currently, Qlik does not have a viable offering to satisfy these requirements. At a technical, scripting level, both QlikView and Qlik Sense can fully leverage the connectivity options our Qlik SAP Connector for Netweaver package offers to access data from both SAP ERP and BI (BW), whether running on HANA or on traditional data bases. A true self-service solution, however, requires a user-friendly, intuitive wizard to select the data which is not available for BEx queries so far. The first native Qlik Sense SAP connector wizard shipped by Qlik in Nov 2015 uses only the SAP SQL connector to load from logical SAP tables - usually a very technical, data-modeling activity.
To fulfill Enterprise IT demands for self-servcie live access to BEx queries for business users, the Qlik Data Concierge (QDC) has been developed.

###Where can I get a sneak peak?

[Check out this cool video for a quick step-by-step walk-through on how to use the QDC.](https://www.dropbox.com/s/76no5gt7dlslbt9/QDC%20Teaser%20Neu.mp4?dl=0)

