function doPost(e) {
  var sheetName = "webhook input";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }

  try {
    // Parse the webhook data
    var data = JSON.parse(e.postData.contents);

    // Log the received data
    Logger.log("Webhook data received: %s", JSON.stringify(data));

    // Convert the data object to a flat array
    var flattenedData = flattenObject(data);

    // Log the flattened data
    Logger.log("Flattened data: %s", JSON.stringify(flattenedData));

    // Get the existing headers
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log("Headers: %s", headers);

    // Handle order update
    if (data.type === "orderUpdate") {
      Logger.log(
        "Handling orderUpdate for ordercode: %s",
        flattenedData["data.ordercode"]
      );
      var ordercode = String(flattenedData["data.ordercode"]);
      var range = sheet.getDataRange();
      var values = range.getValues();
      var found = false;

      for (var i = 1; i < values.length; i++) {
        // Start from 1 to skip header row
        Logger.log(
          "Comparing %s with %s",
          String(values[i][headers.indexOf("data.ordercode")]),
          ordercode
        );
        if (
          String(values[i][headers.indexOf("data.ordercode")]) === ordercode
        ) {
          sheet
            .getRange(i + 1, headers.indexOf("data.status") + 1)
            .setValue(flattenedData["data.status"]);
          Logger.log(
            "Updated status for row %s to %s",
            i + 1,
            flattenedData["data.status"]
          );
          found = true;
        }
      }

      if (!found) {
        Logger.log(
          "Ordercode %s not found for update, appending as new order",
          ordercode
        );
        appendOrder(data);
      }
    }
    // Handle order create
    else if (data.type === "orderCreate") {
      appendOrder(data);
    }
  } catch (error) {
    // Log any errors
    Logger.log("Error: %s", error.toString());
  }
}

function appendOrder(data) {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("webhook input");

  // Prepare the order row
  var orderRow = [
    new Date(), // Timestamp
    "order", // Row Type
    data.type,
    data.data.id,
    data.data.status,
    data.data.cod,
    data.data.order_complete,
    data.data.ordercode,
    data.data.channel,
    data.data.channel_name,
    data.data.trackcode,
    data.data.totals,
    data.data.name,
    data.data.address1,
    data.data.address2,
    data.data.district,
    data.data.subdistrict,
    data.data.province,
    data.data.zipcode,
    data.data.tel,
    data.data.created_at,
    data.data.updated_at,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "", // Empty cells for detail fields
  ];

  // Insert the order row
  sheet.appendRow(orderRow);
  Logger.log("Inserted order row for ordercode: %s", data.data.ordercode);

  // Loop through each item in the details array and append to the sheet
  data.data.details.forEach(function (detail) {
    var detailRow = [
      new Date(), // Timestamp
      "orderItem", // Row Type
      data.type,
      data.data.id,
      data.data.status,
      data.data.cod,
      data.data.order_complete,
      data.data.ordercode,
      data.data.channel,
      data.data.channel_name,
      data.data.trackcode,
      "", // Totals (excluded)
      "", // Name (excluded)
      "", // Address 1 (excluded)
      "", // Address 2 (excluded)
      "", // District (excluded)
      "", // Subdistrict (excluded)
      "", // Province (excluded)
      "", // Zipcode (excluded)
      "", // Tel (excluded)
      data.data.created_at,
      data.data.updated_at,
      detail.id,
      detail.title,
      detail.sku,
      detail.qty,
      detail.price,
      detail.product_price,
      detail.properties_desc,
      detail.property_info,
      detail.properties_desc2,
      detail.property_info2,
      detail.property_option,
      detail.feature_img,
      "", // Customer note (excluded)
      "", // Note (excluded)
    ];

    // Insert the detail row
    sheet.appendRow(detailRow);
    Logger.log("Inserted orderItem row for detail id: %s", detail.id);
  });
}

function flattenObject(obj, prefix = "", res = {}) {
  for (let key in obj) {
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      flattenObject(obj[key], prefix + key + ".", res);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item, index) => {
        flattenObject(item, prefix + key + "." + index + ".", res);
      });
    } else {
      res[prefix + key] = obj[key];
    }
  }
  return res;
}
