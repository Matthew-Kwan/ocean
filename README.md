# Ocean

Include in your README.md file in your repo instructions explaining in detail how to use the application, the roles of users and how the users would go about using all the features of your website. Using the main features of your project should be intuitive enough that any user with access to your URL should be able to discover all its features (more on this file in the Grading section below).

Also, provide an overview of the routes in your Express server, and what they are used for in your app, what data they expect to be sent, and what they would return.  We will test your routes individually (such as in Postman) based on your instructions.

## How to run this project locally

1. Clone this github repository to your local machine.
2. Open a terminal and access the root repository.
3. Change directory to `ocean`.
4. Run `npm install`.
5. Change directory to `server`.
6. Run `npm install`.
7. Change directory back to root.
8. Run `npm run build`
9. After building, run `npm start` to start the application.
10. Use the login credentials below to log in to the platform.

## Installed Third-Party Packages
In case `npm install` did not install all the packages, here are all our third-party dependencies.

- Material UI
- react-router-dom
- sass

## Application Usage Notes
Please do **not refresh** the page while using the application. State management has not been implemented yet and this will break the application. Please refer to “Limitations of Phase 1” for more details.

## Login Credentials

**Standard user profile:**

username - user <br>
password - user

**Admin user profile:**

username - admin <br>
password - admin

## Explanation of Features
The main idea of this product is to create a space for you to start a work session, while also seeing other people's active sessions. By completing sessions, you can collect fish for your tank, and by completing goals you set, you can add decor to your tank. You can add other users and see what they are up to as well. A more in-depth explanation on each of the features are below.

### Login and Registering
The login form and registering form can be seen upon entry to the applications base url. From there you can decide either login, or instead register by pressing the 'here' button at the bottom of the modal to switch the form to the registration form. For PHASE 1, the registration form simply logs you in as the standard user profile from above. Otherwise, the login form works correctly for the profile above.

### Nav Bar
There is a nav bar on the left of all the views in the application that will allow you to navigate through the different views.

### Ocean View

#### Viewing other active sessions
On the ocean page, you will find other fish floating around. These depict the active sessions that are currently going on (based off our hardcoded data). The current limit of fish that are shown is 3, but this may be increased in Phase 2. Clicking on these fish will let you see a modal of their user profile. Features related to these user profiles will be discussed later in this file. You can also hover over the session title to see the full title in case it was truncated due to overflow.

#### Starting your own session
There is a "Start Session" box in the ocean view that allows you to pick a goal, write down a title, and then start a session with the button at the bottom. After starting a session, you switch to the In-Session box where you can see the title and goal you selected, as well as a timer for how long your session has been going on for. There is a button at the bottom that will allow you to end the session, or simply leaving the page will end the session (this might be adjusted in Phase 2).

### Tank View

This is your own personal tank that keeps track of all your completed sessions and completed/in-progress goals. Here, you can see your current goals, and create new goals with/without tasks. In this view, the fish in your tank represent your past completed sessions, and the decor in the tank represent your past completed goals. On hover over either the fish or decor, you will see the respective corresponding past session or goal details. Currently, default user `user` has two completed sessions (fish) and two in-progress goals. Click `Finish!` on the goals to see the corresponding decor appear.

#### Creating Goals

Under `See Your Goals`, there is an option to add new goals with `Add Goal`. The popup modal will require you only to specify a goal name; you can also add tasks to your goal for more modular work items. If you create tasks for your goal, they will automatically be populated into a checklist that allows you to keep track of what tasks have been completed. The `Create Goal` submission button will be disabled if you have an empty goal name or empty task names (you cannot add tasks that have empty names; if they are empty, you must delete the task before you will be able to create the goal).

#### Checking Off Tasks

Under `Check Tasks` for each goal, as you mark off completed tasks, the progress bar will update with the goal’s current task completion percentage.

#### Editing Goals

Using the edit icon in the top right of each goal container, you can edit a goal’s name and tasks (add/remove/rename tasks) using the form provided in the popup modal. The `Edit Goal` submission button will be disabled if you have an empty goal name or empty task names (you cannot add tasks that have empty names; if they are empty, you must delete the task before you will be able to create the goal).

### Profile View

#### Your own profile
On your profile page, you can edit your name and tagline by hovering over the fields. You can also see your friends, and recent goals and sessions.

#### Other people's profiles
On other users profile pages, you can view their tank or add them as a friend.

### Admin View
If you’re logged in as an Admin, you can view the admin dashboards. You can see the current active sessions, a list of all registered users, and reports from users. In Phase 2, more functionality will be added with regards to resolving reports.

## Limitations of Phase 1

1) A limitation that we experienced in phase 1 was from the lack of a backend. With no backend, it was difficult to properly address drilling down components, and it caused the site to break upon refresh. In the future, for phase 2 we will be implementing a state management system to help address this problem.

2) As expected, a lot of portions of the code are not actually functioning due to the lack of a server to play with. We have commented at locations where there would be a GET, POST, or PUT request for when we implement a backend server in phase 2.

## Future Work for Front-end

There are some additional pieces of work that we would like to perform on the front-end to improve upon it in phase 2.

1) Implement state management (Recoil or Redux)
2) Improve responsive styling
3) Add more fish and tank decor variety and fix the styling for both of these to make it look better
4) There are some miscallaneous styling bugs in tank and ocean we will address

Phase 2 will address these extra front-end fixes, but the backend will be the first thing prioritized.