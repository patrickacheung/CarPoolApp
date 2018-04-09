Application description and components.
This is an application for SFU students to organize carpools. The application has account registration and login. To ensure that only SFU students can log in, the application requires that the user uses a SFU email. The user can view all carpools being offered and can filter out and search for specifics. The search is smart in the sense that the user can search for specific drivers, days, campuses or before certain times, or any combinations of those. The user can also contact the carpool driver by clicking an email button that sends an email to the driver about the carpool that the user wishes to join. From there, the users can communicate through email, since both users now have each others basic contact information. Only logged in users are able to send the automated emails. All the core requirements of the project are implemented, along with certain quality-of-life features, mentioned above. The nice to have feature of SFU authentication was completed by using an email validator to ensure that SFU emails where used. 

User data:
Login is required to create, login and email carpools and users.
No accounts or carpools are created in the database, but can be created through the application.

Instructions for deploying:
git clone  
cd  
vagrant up  

http://localhost:5000/

Not yet deployed, having administrative issues with the server.