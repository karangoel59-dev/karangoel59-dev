import { MarkdownDB } from "mddb";

// 1. Create a reusable timeout wrapper
const withTimeout = (promise, ms) => {
  let timeoutId;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([
    // If the main promise finishes first, clear the timeout so it doesn't hang the event loop
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
};

async function test() {
  const client = new MarkdownDB({
    client: "sqlite3",
    connection: {
      filename: "markdown.db",
    },
  });

  await client.init();

  await client.indexFolder({
    folderPath: "ref/Work Dashboard/To Do List/To Do List",
    ignorePatterns: [],
  });

  const files = await client.getFiles();
  
  if (files.length > 0) {
    console.log("File:", files[0]);
  }
}

// 2. Set your desired timeout duration (e.g., 5000 milliseconds = 5 seconds)
const TIMEOUT_MS = 5000;

// 3. Wrap your test function execution with the timeout helper
withTimeout(test(), TIMEOUT_MS)
  .then(() => {
    console.log("Execution completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error/Timeout:", err.message);
    // Force the process to exit. If it timed out, the mddb sqlite connection 
    // might still be open in the background, keeping the Node process alive.
    process.exit(1); 
  });