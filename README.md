# Ketshopweb Webhook Handler (Google Apps Script)

This repository contains Google Apps Script code to handle webhooks from Ketshopweb, an e-commerce website template service.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ketshopweb-webhook-handler.git

   ```

2. **Open Google Sheets:**

   - Open a new or existing Google Sheets document.

3. **Open Script Editor:**

   - Click on `Extensions` -> `Apps Script`.

4. **Copy the Code:**

   - Copy the content from `src/Code.gs` and paste it into the Google Apps Script editor.

5. **Save and Deploy:**

   - Save the script.
   - Deploy as a web app:
     - Click on `Deploy` -> `New deployment`.
     - Select `Web app`.
     - Set `Execute as` to `Me`.
     - Set `Who has access` to `Anyone`.
     - Click `Deploy` and follow the prompts to authorize.

6. **Configure Webhook:**
   - Use the provided web app URL to configure the webhook in Ketshopweb.

## Files

- `src/Code.gs`: Main Google Apps Script code for handling webhooks from Ketshopweb.

## License

This project is licensed under the MIT License.
