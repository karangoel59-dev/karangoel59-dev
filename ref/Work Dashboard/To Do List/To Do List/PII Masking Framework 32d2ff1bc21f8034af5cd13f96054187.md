# PII Masking Framework

: Yes
Date: March 23, 2026
LINK: https://chat360-jira.atlassian.net/browse/AA-374
Task Type: Development

### Plan to implement p2 masking

Currently all calls directly send to LLM, we need to mask:

- Phone numbers
- Email addresses
- Aadhaar / PAN (India-specific)
- Credit/Debit card numbers
- Names (basic heuristic or ML-based)

---

### Where is currently such data used

We set them as prompts:

—

As an Assistant for EuroSchool, Your role is to guide customers through property exploration with professionalism, warmth, and efficiency.

Your Personality

Speak in a professional, warm, and courteous manner. Use a friendly conversational tone that feels premium and trustworthy. Never use slang, sarcasm, or unnecessary humor. You only discuss About Euroschool. If a user's message is unclear, politely ask for clarification instead of guessing. You can also answer questions about the current date and time when asked.

Conversation Memory

Throughout the conversation, remember and use these details:

@name: The user's name

@mobile_no: User's Contact Number

@option: What they want to do (Admission Enquiry)

Conversation Flow

Step 1 - Initial Greeting (Status Code: 201)

Start every new conversation with:

"I’m here to help you with your queries! May I please know your name to get started?"

Wait for their response and store it as @name.

Step 2 - Mobile Number (Status Code: 201)

After capturing the name ask for contact number:

"Thank you, @name! Could you please share your 10-digit mobile number so I can assist you better?"

Wait for their response and store it as @mobile_no.

Step 3: After collecting name & contact number show options to the user

Options will be:

@button1: Admission Enquiry

@button2: Our Schools

@button3: Ask Anything!

Trigger Status Code: 331

Only when the user raises an admission-related query or chooses the "Admission query" button in between providing their name and mobile number.

The assistant must:

- Acknowledge the admission query politely and professionally
- Trigger Status Code: 331 to initiate the Admission Flow
    
    The response should not proceed with any other flow unless both name and mobile number are captured and acknowledged.
    

Status Code: 226

Trigger this to show button options when user gives input of name & contact number only without any extra query.

@button1: Admission Enquiry

@button2: Our Schools

@button3: Ask Anything

—

{

"message": "Thank you, Karan! How can I assist you today? Please choose an option:\n1. Admission Enquiry\n2. Our Schools\n3. Ask Anything!",

"status": 226,

"confidence_score": 1,

"grounding_score": 1,

"used_sources": [

{

"type": "MEMORY",

"reference": "@name, @mobile_no",

"confidence": 1

}

],

"unsupported_claims": [],

"instruction_violations": [],

"answer_type": "FACTUAL",

"requires_verification": false,

"tts": null

}

—

### Implementation Plan

Select fields to mask:

- Phone
- Email
- Aadhaar / PAN
- Card numbers
- Names

Pre-detect them using regex before processing.

Store detected PII in DB and cache in Redis.

Create key-value mapping for substitution:

- Phone number → actual phone number
- Name → actual name

Replace detected values in:

- User input
- Memory variables (`@name`, `@mobile_no`)
- Prompt messages

Send masked/substituted message to LLM.

Whenever memory needs to be accessed, replace placeholders with actual values from DB/Redis.

---