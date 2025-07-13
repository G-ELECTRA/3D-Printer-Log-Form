// --- CONFIGURATION ---
const a_LogSheetName = "Log";
const b_FilamentSheetName = "FilamentStock";
const c_NotificationEmail = "gelectra@gitam.edu";

// --- doGet for fetching filaments ---
function doGet(e) {
  try {
    if (e.parameter.action === 'getFilaments') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(b_FilamentSheetName);
      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      const filamentList = data.map(row => row[0]).filter(name => name.trim() !== "");
      const response = { result: 'success', data: filamentList };
      
      // IMPORTANT: Return response WITH the CORS header
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON)
        .addHttpHeader("Access-Control-Allow-Origin", "*");
    }
  } catch (error) {
    const response = { result: 'error', message: error.toString() };
    // IMPORTANT: Also return error response WITH the CORS header
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .addHttpHeader("Access-Control-Allow-Origin", "*");
  }
}

// --- doPost for submitting the form ---
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); 

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(a_LogSheetName);
    const data = JSON.parse(e.postData.contents);
    const now = new Date(); // The reliable Date object
    
    const newRow = [
      now.toLocaleString("en-IN"), // Timestamp
      now.toLocaleDateString("en-IN"), // Date
      data.name,
      data.phoneNumber,
      data.gitamMail,
      data.team,
      data.printTime,
      data.purpose,
      data.permission,
      data.filamentSource,
      data.filamentDetails
    ];
    sheet.appendRow(newRow);
    
    sendNotificationEmail(data, now); // Pass the Date object

    // IMPORTANT: Return the SUCCESS response WITH the CORS header
    return ContentService.createTextOutput(JSON.stringify({ result: "success", message: "Log submitted successfully!" }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHttpHeader("Access-Control-Allow-Origin", "*");
      
  } catch (error) {
    Logger.log("ERROR in doPost: " + error.toString());
    // IMPORTANT: Also return the ERROR response WITH the CORS header
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHttpHeader("Access-Control-Allow-Origin", "*");
  } finally {
    lock.releaseLock();
  }
}

// --- sendNotificationEmail (no changes needed here but including for completeness) ---
function sendNotificationEmail(data, dateObject) {
    const recipient = c_NotificationEmail;
    const subject = `3D Printer Usage Notification: ${data.name}`;
    
    const dateFormatted = dateObject.toLocaleDateString("en-IN");
    const timeFormatted = dateObject.toLocaleTimeString("en-IN");
    
    const body = `
      Hi,

      A new 3D printer job has been logged.

      - Name: ${data.name}
      - Phone Number: ${data.phoneNumber}
      - Purpose: ${data.purpose}
      - Filament Used: ${data.filamentDetails} (Source: ${data.filamentSource})
      - Submitted On: ${dateFormatted} at ${timeFormatted}

      This is an automated notification.
    `;
    MailApp.sendEmail(recipient, subject, body);
}