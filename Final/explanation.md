# Final Assignment
For this assignment, I wanted to incorporate shader programming into another project that I was working on: IbisEngine. IbisEngine is a game engine that I am creating for a text adventure that I will be working on later this year. The engine will include its own natural language processor, options for interactive text, and unicode support. Implementing shaders into this game engine would allow for more ways to make the text interactive in the future.

Before this part of the project IbisEngine included these components:
- A singleton Message Bus that receieved messages from and notified all "managers".
- A singleton engine class to control the game loop, startup, shutdown, and resources created by the game developer.
- A logfile "manager" that wrote messages to a logfile.
- A console "manager" that created a console window to output messages and errors.
- A display "manager" that used SFML to create and draw to a window.
- An input "manager" that used SFML to listen for input to that window.

## Goals
This project included two main goals:
1. Incorporate WebGPU into IbisEngine
2. Create a demo "game" that displayed different shaders from user command input

To incorporate WebGPU into my C++ game engine, I used [Dawn](https://dawn.googlesource.com/dawn/) with [Elie Michel's tutorial](https://eliemichel.github.io/LearnWebGPU/).
To create the demo game I also needed to create new components and managers:
- A UI component for displaying keyboard input to the screen and sending user commands as messages.
- A command "manager" that stores all available commands and listens for all commands that were sent by the user. If a user sends a valid command, the manager will send a message with the shader to display.
- A command class for game programmer defined commands.
- A shader class for game programmer defined shaders.

## Issues with WebGPU
While following the tutorial I found a few issues with incorporating WebGPU with IbisEngine. The first major issue was that I was already using SFML to for my graphics engine. This meant that I would have to find a way to render a WebGPU texture to an SFML object then draw that object to the display window. I found that SFML textures were able to be drawn to using an array of 32bit RBGA pixels. This means that it was possible to run WebGPU "headless" by drawing to a texture, reading the pixel values, and writing to an SFML texture for future display. 

The second major issue had to do with information loss. For some unkown reason, the memory around the WebGPU device corrupted whenever I attempted to create a WebGPU texture. This caused a lot of headache and time loss. Since I was never able to fix this issue specifically, I decided to scrap the idea of using WebGPU and instead use SFML's built in Shader class.

## Using SFML Shaders
The SFML shader class allowed for drawing shaders to an object, while drawing that object to the screen. This allowed me to designate a portion of the screen for drawing shaders, while leaving the lower part of the screen to user input. SFML Shaders can be set directly from a file, but that shader file must be written in GLSL. SFML also only supports vertex and fragment shaders, since it does not include a built-in compute pipeline. 

With a shader component in place, I created a shader class for IbisEngine that abstracted out the SFML shader class. This class allowed for setting Vertex and Fragment shaders using glsl files and setting uniforms. I then created a command class that stored a string and an IbisEngine shader. Commands are created by the developer with a string, set with an optional shader, then sent as a message to all managers by using the engine's "addCommand" method.

These messages would be received by the command "manager", which stores them in a hash map. While the game is playing, the command "manager" listens for user commands and attempts to find the corresponding command in the hash map. If the command is found it will be sent back as a different message.

The display "manager" listens for these messages and draws the shader to a blank sprite covering most of the screen. It also listens for input messages and updates the default uniforms for the shader. There are 5 default uniforms for the engine:
- frame : A float that increments by 1 every frame. The engine runs at 30 frames per second by default.
- res : A Vec2 for the sprite's horizontal and vertical pixel count.
- mouse_pos : A Vec2 for the mouse's position on the window.
- mouse_click : A bool that is true when the mouse button is down.
- key_down : A bool that is true when any key is down.

## IbisShader
Using the updated engine, I created a demo game called IbisShader. This game creates 4 commands and 3 shaders associated with them.
1. Clear : Clears the screen and sets a null shader
2. Test : A shader that shows all 5 uniforms in action
3. Glitch : A shader similar to my A2, but without reading from a texture
4. Clouds : A shader created by [patriciogv](http://patriciogonzalezvivo.com) in 2015 showcased in the [Book of Shaders](https://thebookofshaders.com/13/).

The demo is created for Windows 64bit systems, but I can compile for other systems on request with some slight modification. 

## Learning Points
If I were to attempt this project again, I would create the game engine around WebGPU using the tutorial as a starting point. Integrating WebGPU into a project with its own graphical componenet is not easy, and it may have saved me more time if I removed SFML from the project and recreated the graphics engine using WebGPU.