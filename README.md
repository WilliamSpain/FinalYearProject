# x86 CPU Simulator



### *Images showing usage in "ExampleImagesUsingStep.md"*



## Installation with npm 
### method 1 with zip
1. Copy the OS.JS folder into desired location
2. navigate directory with OS.JS folder i.e. "../OS.JS" and run "npm install" command
3. then run "npm run package:discover" command
4. then run "npm run build" command 


### method 2 with GitHub
1. run "git clone https://github.com/WilliamSpain/FinalYearProject.git"
2. navigate into the download folder then into OS.JS i.e. "../OS.JS"
3. run "npm install" command
4. then run "npm run package:discover" command
5. then run "npm run build" command 

## Running instance with npm
- once the installation steps are complete run "npm run serve" to create a local instance on port :8000

# Headings
### 1. UI
### 2. Hello World
### 3. Logic Game


# 1. UI
## Registers
- Four 8 bit registers exist in the top left of our main window AL, BL, CL, DL
- Each Register has a Decimal, Hex, and Byte representation
-   The registers have a max value of ( 255/ 0xFF / 11111111 ) if the max value is incremented it overflows back to zero and sets the carry ( C ) flag to true

## Flags
- There are 3 flags carry ( C ), zero( Z ), fault( F )
- these are set based on the operations performed by the CPU

## Pointers
- The Instruction pointer (IP) points to the next instruction to be executed
- The stack pointer points to the current location in the stack
- The stack pointer starts at 231 and decreases as 232-255 are for console output
- if you watch the browser console when your program finishes it will  print any ascii it finds in that memory location
-  The IP tends to jump more than 1 value as the CPU counts every part of an instruction as 1 byte and adds that to the instruction pointer so it points to instructions not data
- "mov al,2" increases the IP by 3 where as "inc al" increases the IP by 2

## Text Editor Buttons
- Assemble: Compiles code that is in the text box
- Run: Repeatedly steps through the code with an atrificial delay
- Stop: Stops CPU running through code
- Step: Walks through program 1 instruction at a time
- Reset: Resets registers, flags, pointers,  and memory
## Window Buttons
- Memory : Launches 256 byte memory window that shows compiled code and contains a button switch between decimal and hex
- Instructions: Shows available instructions with corresponding opcode in Decimal and Hex
- Choose Game + Load Game: lets you select a logic game, "load game" launches window

# 2. Hello World
Here is a program that loads hello World as ascii into the last 24 bytes of the memory array, When the code is finished executing the program should log the word to browser console.
```
	JMP start
hello: DB "Hello World!"  
       DB 0	

start:	MOV CL, hello    
	    MOV DL, 232	
    	CALL print
        HLT             

print:	PUSH AL
	    PUSH BL
    	MOV BL, 0

.loop:	MOV AL, [CL]	
    	MOV [DL], AL	
    	INC CL
    	INC DL  
    	CMP BL, [CL]	
    	JNZ .loop	
    	POP BL
    	POP AL
	    RET
```
Lets walk through
	
1. "hello:" holds the byte string with 0 appended and then jumps to start
2. CL holds the hello address and DL is set to our first output position in memory
3. AL and BL are pushed to stack and BL is set to 0 for comparison purposes
4. The first character of hello in CL is moved into AL
5. It is then moved into DL which "prints" it into memory 
6. Both CL and DL are incremented so we get the next character and the next free character slot in our memory window
7. compare BL and CL are we at the last character 0 if so break else loop
8. Repeat until we reach the 0 at the end of hello: and then halt  

# 3. Logic Game

- The logic Game simply works off of the byte representation of the AL register
- the bottom bit in the window is the LSB of the AL register
- if pairs of bits are set the relevant light turns on except for the first two bits (i.e AL = 3) which turn on all of the lights at once
```
	mov Al,3 ;turns on all lights
	shl AL,2 ;left shifts the al register twice turning on the green light only
```
