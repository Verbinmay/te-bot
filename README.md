<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/FxL5qM0.jpg" alt="Bot logo"></a>
</p>

<h3 align="center">todo-bot</h3>

<div align="center">


---

<p align="center"> 🤖 Few lines describing what your bot does.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Demo / Working](#demo)
- [Usage](#usage)


## 🧐 About <a name = "about"></a>

The purpose of the bot is to provide an interactive and engaging experience for users on the Telegram platform. The bot offers various functionalities and scenes, allowing users to participate in quizzes, interviews, and access information about themselves. It also includes an administration section for users with admin privileges to manage different aspects of the bot. The bot aims to entertain and educate users by presenting them with questions, providing answers, and allowing them to explore different scenes based on their interests. With a user-friendly interface and customized keyboards, the bot offers an intuitive and seamless user experience, catering to both regular users and administrators.

## 🎥 Demo / Working <a name = "demo"></a>

![Working](https://media.giphy.com/media/12XTNObsY1pWQU/giphy.gif)

## 💭 How it works <a name = "working"></a>
The bot works as follows:

Initialization: The bot is initialized and starts listening for incoming messages from users.

Main Scene: When a user starts a chat with the bot or sends a specific command, they are directed to the "Main Scene" represented by the constant START_MAIN_SCENE. In this scene, the bot checks if the user is authorized and retrieves their information from the database using the userService.getByTelegramId() method. Based on the user's role and ban status, the bot constructs a custom keyboard with different buttons, allowing the user to access various functionalities.

User Interaction: The user interacts with the bot by selecting one of the buttons displayed on the custom keyboard. Each button corresponds to a specific action or scene in the bot.

Scene Navigation: When a button is pressed, the bot checks the text of the message to determine which action the user intends to perform. For example, if the user selects TWENTY_QUESTION, they will be directed to the "Start Quiz Scene" represented by the constant START_QUIZ_SCENE. Similarly, selecting FORTY_QUESTION will take them to the "Start Interview Scene" represented by START_INTERVIEW_SCENE.

Scene Handling: In each scene, the bot performs specific actions and interacts with the user accordingly. For example, in the "Start Quiz Scene," the bot may present the user with quiz questions, and in the "Start Interview Scene," it may provide interview-related content.

Error Handling: Throughout the bot's operation, there are error handling mechanisms to catch any unexpected issues or errors that may occur. If an error is encountered, the bot sends appropriate error messages like MS_SORRY_ERROR to inform the user and gracefully handle the situation.

Admin Functionality: The bot also includes an "Administration" feature that can be accessed by users with the role of "admin." Admins can access this functionality by selecting the ADMINISTRATION button. In the "Administration Scene," represented by START_ADMINISTRATION_SCENE, admins have access to additional functionalities such as managing users, questions, and administrators.

Helper Functionality: The HELPER button provides users with a "Help" feature, where they can seek assistance or support from the bot. The bot may direct users to the "Send Help Scene," represented by SEND_HELP_SCENE, to handle user queries or provide relevant information.

User Ban: If a user is banned, the bot displays the MS_SORRY_BAN message to inform them of their ban status, restricting certain functionalities.

User Authorization: The bot might have an "Authorization" feature represented by START_AUTHORIZATION_SCENE, where new users can sign in or log in to access personalized features and store user-related data.

In summary, the bot follows a structured scene-based approach to provide various functionalities to users based on their roles and inputs. It utilizes constants for buttons, scenes, and messages to maintain a consistent user interface and interaction experience. The bot's functionality is expanded for admin users who have access to additional administrative features. Error handling ensures smooth user experience even in unforeseen situations.


