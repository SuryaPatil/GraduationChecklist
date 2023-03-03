# React File Upload

> This is a full stack React-Express app that can parse Stony Brook University PDF Transcripts written in a specific format.

## Installing Node
Running this project requires Node.js. If Node is not installed on your machine, follow these directions: https://nodejs.org/en/download/

## Project setup
In your terminal, go into the root project directory and type in the following commnads:
```bash
# Install dependencies server/client
npm install
cd client
npm install
```
## Start the application
In the root project directory, enter the following command:
```bash
# Serve in localhost:3000
npm run dev
```
In a web browser, type localhost:3000. At this point, you should see this page:
<img width="720" alt="Screen Shot 2023-03-03 at 4 19 03 PM" src="https://user-images.githubusercontent.com/78182536/222831372-05f46688-88ab-4a09-941b-07accff79681.png">

Click "Browse" to select a PDF transcript from your computer, and click "Upload" to upload your file. Now, look at the output in your terminal. If you see the word "Text" followed by the text extracted from the PDF, the program will be able to parse the PDF. However, if you see the word "Text" followed by just whitespace, the program will not be able to parse the PDF. 

Example terminal output where program can parse the transcript (the transcript format I worked with originally): 
<img width="613" alt="Screen Shot 2023-03-03 at 4 25 37 PM" src="https://user-images.githubusercontent.com/78182536/222833276-5ecab669-b4a0-48de-9cff-d6912fdca4ea.png">

Example terminal output where program cannot parse the transcript (the transcript you sent me): 
<img width="604" alt="Screen Shot 2023-03-03 at 4 26 09 PM" src="https://user-images.githubusercontent.com/78182536/222833316-a0b11393-604e-40c0-8369-c0602ee30561.png">

