# Data Capture 1

: Yes
Date: March 24, 2026 → March 25, 2026
LINK: https://chat360-jira.atlassian.net/browse/AA-384
Task Type: Issue

References:

[https://docs.google.com/document/d/1IxFNcjPTje2abZV6JMppglH3pPqTsSg_srKFcW4hmIw/edit?tab=t.0#heading=h.v1jt5yffl603](https://docs.google.com/document/d/1IxFNcjPTje2abZV6JMppglH3pPqTsSg_srKFcW4hmIw/edit?tab=t.0#heading=h.v1jt5yffl603)

[chat360-agents/backend/supervisor/webhook.py at stage-v1.1.0 · sumanel/chat360-agents](https://github.com/sumanel/chat360-agents/blob/stage-v1.1.0/backend/supervisor/webhook.py#L568)

### **Data Capture Flow**

---

### **Agentic side — Data Capture (During Conversation)**

- End user interacts with the agent during a conversation
- Agent reads `data_to_capture` configuration (e.g., `[@name, @phone, @email]`)
- Agent prompts the user to provide the required details
- `capture_user_data` tool is triggered to capture inputs
- Captured values are stored in `ChatRoom.captured_data`
- No data is sent to DB Hub at this stage
- Data remains accumulated within the `ChatRoom` for the session

---

### **New Requirements**

- Create a **new API on the agentic platform** to expose captured data
- Integrate this API within the bot flow to:
  - Fetch captured data from the agentic platform
  - Update bot-side data accordingly

---

Comments

Will try to fix redis first, then move to Dev

:1:VARIABLES_f9fc8287-2267-489f-93de-cb5bd034cb9b

{"@name": "", "@user_name": "", "@lead_score": 0, "@user_number": "", "@user_country": "", "@first_response": "Saurabh", "@current_variable": null, "@ip_address": "2401:4900:5308:a94a:ec53:24e1:59e9:33bb", "@user_agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36", "@user_os": "linux", "@user_system": "mobile", "@user_browser": "chrome", "@current_url": "Preview", "@room_id": "f9fc8287-2267-489f-93de-cb5bd034cb9b", "@website_url_1": "[staging.chat360.io](http://staging.chat360.io/)", "@location_1": "", "@region": "", "@country_code": "", "@current_url_1": "[https://staging.chat360.io/web_bot/?h=39557670-1ad3-4159-a043-6f9a69646f5b](https://staging.chat360.io/web_bot/?h=39557670-1ad3-4159-a043-6f9a69646f5b) rcs", "@preview_1": "true", "@last_response": null, "@current_datetime": "25/03/2026 12:39:24", "@time_spent": 266.0, "@session_id": "f0608765-8088-4c7c-9530-428d7fcade6f", "@created_on": "25/03/2026 12:32:53", "@updated_on": "25/03/2026 12:37:58", "@room_created": "25/03/2026 12:32:53", "@room_updated": "25/03/2026 12:37:58"}

RMD_0013a53c-b101-4583-ad7b-deab56f446b8

{"CLIENTWIDGETLEADDATA":"{'@name': '', '@user_os': '', '@location': '', '@utm_term': '', '@ip_address': '', '@lead_score': '', '@time_spent': '', '@user_agent': '', '@utm_medium': '', '@utm_source': '', '@current_url': '', '@user_system': '', '@user_browser': '', '@first_response': '', '@current_variable': ''}","THIRD_PARTY_IDENTITY":"b63039fb-825e-4bb1-a2ae-85604715faed::46c19005-ccc2-4867-923a-251e68f5c30d::61cc5052-6614-4a21-89e3-54368ead1115","ROOM_REDIS_ONLY":"True","website_url":"testmsgvarinlivechat.blogspot.com","bot_type":"website","CLIENTWIDGETLOCK":"46c19005-ccc2-4867-923a-251e68f5c30d","ROOM_NAME":"No Response 3748","channel_id":"https://testmsgvarinlivechat.blogspot.com/?m=1","ADMIN_ID_INT":"214","bot_id":"b63039fb-825e-4bb1-a2ae-85604715faed","CLIENTWIDGETLEADFIELDS":"['@name', '@user_os', '@location', '@utm_term', '@ip_address', '@lead_score', '@time_spent', '@user_agent', '@utm_medium', '@utm_source', '@current_url', '@user_system', '@user_browser', '@first_response', '@current_variable']","VARIABLES":"{'@msg': '', '@name': '', '@user_os': 'linux', '@location': '', '@utm_term': '', '@ip_address': '66.249.75.7', '@lead_score': '', '@time_spent': '', '@user_agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.159 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', '@utm_medium': '', '@utm_source': '', '@current_url': 'https://testmsgvarinlivechat.blogspot.com/?m=1', '@user_system': 'mobile', '@user_browser': 'chrome', '@name_by_owner': '', '@first_response': '', '@current_variable': '', '@room_id': '46c19005-ccc2-4867-923a-251e68f5c30d', '@website_url_1': 'testmsgvarinlivechat.blogspot.com', '@location_1': '', '@region': '', '@country_code': '', '@current_url_1': 'https://testmsgvarinlivechat.blogspot.com/?m=1', '@targetId_1': '82e877b0-cbe0-4ec0-ad49-e5175c9df80a', '@origin': 'https://testmsgvarinlivechat.blogspot.com'}"}
