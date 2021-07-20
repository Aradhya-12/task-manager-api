Overview of the project:
It is a REST API created using html, javascript , css, nodejs, express. The main purpose of this REST API is register user and allow them to maintain list of tasks which they want to perform. 
It has following endpoints:  
|1.'/':	             |To get the landing page of api|
|2.'/users':         |To register new user|
|                    |Required:json data with "name","email","password"|
|                    |Return: The details of user created along with and a bearer auth token|
|3.'/users/login':   |To login in the user's account|
|                    |Required: json data with "email" and "password"|
|                    |Returns: Details of user|
|4.'/user/logout':   |To log out from user's account|
|                    |Required:An auth token of logged in user|
|                    |Returns: Message of successfull logut|
|5.'/user/logoutall':|To logout from all the sessions of account|
|                    |Required:An auth token of logged in user|
|                    |Returns: Message of successfull logut|
|6.'/users/me':    	 |To read information of the user's profile from database|
|                    |Required:An auth token of logged in user|
|                    |Returns: The details of the user|
|7.'/users/updateme':|To update user's details|
|                    |Required:An auth token of logged in user along with the updates to be made in profile|
|                    |Returns: Updated Details of user|
|8.'/users/me':	     |To delete a user and all their tasks of particular id|
|                    |Required:An auth token of logged in user|
|                    |Returns: Details of the deleted user|
|9.'/user/me/avatar':|To upload user's profile pic|
|                    |Required:An auth token of logged in user along with pic in either .jpg/.jpeg/.png file|
|                    |Returns: None|
|10.'/user/me/avatar':|To delete user's profile pic|
|                    |Required:An auth token of logged in user|
|                    |Returns: None|
|11.'/task':         |To create tasks from the logged in user|
|                    |Required:An auth token of logged in user with json data like 'desc' and "status"|
|                    |Returns: The details of currently created task|
|12.'/task':         |To read details of all the tasks in database that authenicated user created|
|                    |Required:An auth token of logged in user.Prams like 'status', 'limit', 'skip','sortB'for Searching, Sorting and Pagination.|
|                    |Returns: Details of all the tasks created by logged in user|
|13.'/task/:id':	    |To read info of particular task eg by id|
|                    |Required : An Authorization bearer token of logged in user along with the id of task to be searched.|
|                    |Returns : Json data with searched task.|
|14.'/task/:id':     |To update task's details by id|
|                    |Required : An Authorization bearer token of logged in user and upates and id of the task that has to be Updated.|
|                    |Returns : Updated details of the given task.|
|15.'task/:id':      |To delete a task of particular id|
|                    |Required : An Authorization bearer token of logged in user along with the id of task to be deleted.|
|                    | Returns : Json data of deleted task.|

In case of any problem you can ping me at: arutripathi011@gmail.com

Deployed app's link: http://aradhya-task-manager-api.herokuapp.com/
