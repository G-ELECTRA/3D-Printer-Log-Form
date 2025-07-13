# 3D Printer Log Book & Management System

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

A modern, serverless web form for logging and managing 3D printer usage. This system uses a frontend hosted on GitHub Pages and a powerful Google Apps Script backend to automatically update a Google Sheet and send email notifications, providing a robust logbook with zero hosting costs.

---

### **[► View Live Demo](https://g-electra.github.io/3D-Printer-Log-Form/)** 

---


*(It is highly recommended to replace this with a screenshot of your own finished form)*

## Core Features

-   **Serverless Architecture:** No need for a dedicated server or hosting plan. Runs entirely on GitHub Pages and Google's infrastructure.
-   **Automated Logbook:** Submissions are automatically saved as new rows in a Google Sheet, creating a time-stamped, organized log.
-   **Dynamic Filament Inventory:** The form dynamically fetches the list of available "Club Filaments" directly from a tab in the Google Sheet. Simply update the sheet to update the form dropdown.
-   **Email Notifications:** Instantly receive an email notification with key details of the print job upon every successful form submission.
-   **User-Friendly Interface:** A clean, modern, and responsive UI with an animated background and clear input fields.
-   **Input Validation:** Ensures data integrity with required fields and pattern matching for GITAM email addresses.
-   **Robust Fallback:** If the filament list fails to load for any reason, the form gracefully falls back to a manual text input.

## Technology Stack

-   **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+)
-   **Backend:** Google Apps Script
-   **Database:** Google Sheets
-   **Hosting:** GitHub Pages

## Project Architecture

The data flows in a simple, effective sequence:

1.  **User Interaction:** The user fills out the form hosted on **GitHub Pages**.
2.  **API Call:** On submission, the JavaScript `fetch` API sends the form data to the deployed **Google Apps Script Web App URL**.
3.  **Backend Processing:** The **Google Apps Script** (`doPost` function) receives the data.
4.  **Data Storage:** The script appends the processed data as a new row in the **Google Sheet**.
5.  **Notification:** The script then uses `MailApp` to send a formatted email to the designated administrator.
6.  **Confirmation:** The script sends a `success` message back to the frontend, which displays a confirmation to the user.

## Setup and Installation

Follow these steps carefully to set up your own instance of this project.

### Part 1: Google Sheet Setup

1.  Create a new Google Sheet at [sheets.google.com](https://sheets.google.com).
2.  Name the spreadsheet **"3D Printer Log Book"**.
3.  You need two sheets (tabs). Rename the default sheet to **`Log`**.
4.  Click the `+` icon to add a new sheet and name it **`FilamentStock`**.
5.  **Set up the `Log` sheet headers:** In the first row, create these exact headers:
    | A | B | C | D | E | F | G | H | I | J | K |
    | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
    | Timestamp | Date | Name | Phone Number| Gitam Mail ID| Team | Print Time | Purpose | Permission From | Filament Source | Filament Details|
6.  **Set up the `FilamentStock` sheet:**
    -   In cell `A1`, type the header `FilamentName`.
    -   In the cells below (`A2`, `A3`, etc.), list the club filaments you have in stock (e.g., `Bambu PLA Basic Black`).

### Part 2: Google Apps Script Setup

1.  In your Google Sheet, go to **Extensions > Apps Script**.
2.  Delete any placeholder code in the `Code.gs` file and paste the entire contents of the `Code.gs` file from this repository.
3.  **Configure the Script:** Find the line `const c_NotificationEmail = "..."` and change the email address to the one where you want to receive notifications.
4.  **Deploy the Script:**
    -   Click the blue **Deploy** button > **New deployment**.
    -   Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
    -   For "Execute as", select **Me (your Google account)**.
    -   For "Who has access", you MUST select **Anyone**. This is required for a public GitHub Pages site to access it.
    -   Click **Deploy**.
5.  **Authorize Permissions:** Google will ask you to authorize the script. Follow the prompts. Click **"Advanced"** and **"Go to (project name) (unsafe)"** if you see a warning screen. This is normal for your own scripts.
6.  **Copy the Web App URL:** After deploying, a URL will be provided. **Copy this URL.** You will need it for the `index.html` file.

### Part 3: Frontend & Hosting

1.  Download the `index.html` file from this repository.
2.  **Configure the HTML:**
    -   Open `index.html` in a text editor.
    -   Find the line: `const SCRIPT_URL = '...'`. Paste the **Web App URL** you copied in the previous step.
    -   (Optional) Find the `<img>` tag and replace the `src` attribute with a link to your own logo.
3.  **Host on GitHub Pages:**
    -   Create a new public repository on GitHub.
    -   Upload the configured `index.html` file to this repository.
    -   Go to your repository's **Settings > Pages**.
    -   Under "Branch", select `main` (or `master`) and click **Save**.
    -   Your site will be live at the provided URL (e.g., `https://your-username.github.io/your-repo-name/`) in a few minutes.

## How to Use

-   Navigate to your live GitHub Pages URL.
-   Fill in all the required fields.
-   If you select "Club's" as the filament source, a dropdown will appear with the items listed in your `FilamentStock` sheet.
-   Click **Submit**. The data will be recorded, and an email will be sent.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
