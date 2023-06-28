<p align="center">
  <a href="" rel="noopener">
 <img width=2000px height=200px src="https://i.imgur.com/46Gwmet.gif" alt="Bot logo"></a>
</p>

<h3 align="center">todo-bot</h3>

<div align="center">

</div>

---

<p align="center"> 🤖 Few lines describing what your bot does.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Demo / Working](#demo)
- [How it works](#working)


## 🧐 About <a name = "about"></a>

The purpose of this Telegram bot is to facilitate task management and organization for users. By leveraging the bot's functionality, users can easily create, view, edit, and delete tasks directly within the Telegram messaging platform. The bot provides a user-friendly interface through commands, buttons, and text interactions, allowing users to interact with their task list seamlessly. Whether it's keeping track of personal to-do lists, managing work-related tasks, or organizing projects, this bot serves as a convenient and efficient tool for users to stay organized and prioritize their tasks. With its intuitive features and integration with Telegram, the bot offers a streamlined task management experience for users, enhancing their productivity and enabling them to stay on top of their responsibilities.

## 🎥 Demo / Working <a name = "demo"></a>

![Working](https://media.giphy.com/media/20NLMBm0BkUOwNljwv/giphy.gif)

## 💭 How it works <a name = "working"></a>

This code represents a description of a Telegram bot that provides task management functionality. The bot is built using the NestJS framework and the telegraf library.

The main logic of the bot is implemented in the `AppUpdate` class, which serves as the handler for bot updates. The `bot` and `appService` instances are injected into the constructor of this class, provided by the telegraf library and the application service, respectively.

The bot responds to various events and commands using the `@Start()`, `@Hears()`, and `@On()` decorators. For example, when receiving the "/start" command, the bot sends a welcome message and prompts the user to choose an action using buttons.

The main actions available in the bot include viewing the task list, marking a task as done, creating a new task, deleting a task, and editing a task name. Each action is associated with a corresponding handler that performs the required operations using the `appService` application service.

For handling text messages unrelated to commands or buttons, the `@On('text')` handler is used. Inside this handler, the current user action type is checked, and the message is processed accordingly. For example, if the user is performing the "done" action, the bot accepts the task ID, marks it as done, and displays the updated task list.

The functionality of the bot is implemented using object-oriented principles and is divided into separate methods, making the code more structured and easier to understand.

This bot provides a simple way to manage a task list through Telegram and can be extended or modified according to the requirements of your application.


