/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("model_schedules");

  const record0 = new Record(collection);
    const record0_model_idLookup = app.findFirstRecordByFilter("models", "email='juju@meggy.com'");
    if (!record0_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='juju@meggy.com'\""); }
    record0.set("model_id", record0_model_idLookup.id);
    record0.set("day_of_week", "segunda");
    record0.set("start_time", "14:00");
    record0.set("end_time", "22:00");
    record0.set("is_available", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    const record1_model_idLookup = app.findFirstRecordByFilter("models", "email='juju@meggy.com'");
    if (!record1_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='juju@meggy.com'\""); }
    record1.set("model_id", record1_model_idLookup.id);
    record1.set("day_of_week", "quarta");
    record1.set("start_time", "15:00");
    record1.set("end_time", "23:00");
    record1.set("is_available", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    const record2_model_idLookup = app.findFirstRecordByFilter("models", "email='juju@meggy.com'");
    if (!record2_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='juju@meggy.com'\""); }
    record2.set("model_id", record2_model_idLookup.id);
    record2.set("day_of_week", "sexta");
    record2.set("start_time", "13:00");
    record2.set("end_time", "21:00");
    record2.set("is_available", true);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    const record3_model_idLookup = app.findFirstRecordByFilter("models", "email='juju@meggy.com'");
    if (!record3_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='juju@meggy.com'\""); }
    record3.set("model_id", record3_model_idLookup.id);
    record3.set("day_of_week", "s\u00e1bado");
    record3.set("start_time", "10:00");
    record3.set("end_time", "20:00");
    record3.set("is_available", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    const record4_model_idLookup = app.findFirstRecordByFilter("models", "email='luna@meggy.com'");
    if (!record4_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='luna@meggy.com'\""); }
    record4.set("model_id", record4_model_idLookup.id);
    record4.set("day_of_week", "ter\u00e7a");
    record4.set("start_time", "16:00");
    record4.set("end_time", "23:00");
    record4.set("is_available", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    const record5_model_idLookup = app.findFirstRecordByFilter("models", "email='luna@meggy.com'");
    if (!record5_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='luna@meggy.com'\""); }
    record5.set("model_id", record5_model_idLookup.id);
    record5.set("day_of_week", "quinta");
    record5.set("start_time", "14:00");
    record5.set("end_time", "22:00");
    record5.set("is_available", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    const record6_model_idLookup = app.findFirstRecordByFilter("models", "email='luna@meggy.com'");
    if (!record6_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='luna@meggy.com'\""); }
    record6.set("model_id", record6_model_idLookup.id);
    record6.set("day_of_week", "s\u00e1bado");
    record6.set("start_time", "12:00");
    record6.set("end_time", "21:00");
    record6.set("is_available", true);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    const record7_model_idLookup = app.findFirstRecordByFilter("models", "email='luna@meggy.com'");
    if (!record7_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='luna@meggy.com'\""); }
    record7.set("model_id", record7_model_idLookup.id);
    record7.set("day_of_week", "domingo");
    record7.set("start_time", "15:00");
    record7.set("end_time", "22:00");
    record7.set("is_available", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    const record8_model_idLookup = app.findFirstRecordByFilter("models", "email='maya@meggy.com'");
    if (!record8_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='maya@meggy.com'\""); }
    record8.set("model_id", record8_model_idLookup.id);
    record8.set("day_of_week", "segunda");
    record8.set("start_time", "18:00");
    record8.set("end_time", "23:00");
    record8.set("is_available", true);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    const record9_model_idLookup = app.findFirstRecordByFilter("models", "email='maya@meggy.com'");
    if (!record9_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='maya@meggy.com'\""); }
    record9.set("model_id", record9_model_idLookup.id);
    record9.set("day_of_week", "quarta");
    record9.set("start_time", "17:00");
    record9.set("end_time", "23:00");
    record9.set("is_available", true);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    const record10_model_idLookup = app.findFirstRecordByFilter("models", "email='maya@meggy.com'");
    if (!record10_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='maya@meggy.com'\""); }
    record10.set("model_id", record10_model_idLookup.id);
    record10.set("day_of_week", "sexta");
    record10.set("start_time", "19:00");
    record10.set("end_time", "23:00");
    record10.set("is_available", true);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    const record11_model_idLookup = app.findFirstRecordByFilter("models", "email='maya@meggy.com'");
    if (!record11_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='maya@meggy.com'\""); }
    record11.set("model_id", record11_model_idLookup.id);
    record11.set("day_of_week", "s\u00e1bado");
    record11.set("start_time", "14:00");
    record11.set("end_time", "23:00");
    record11.set("is_available", true);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    const record12_model_idLookup = app.findFirstRecordByFilter("models", "email='jefferson@meggy.com'");
    if (!record12_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='jefferson@meggy.com'\""); }
    record12.set("model_id", record12_model_idLookup.id);
    record12.set("day_of_week", "ter\u00e7a");
    record12.set("start_time", "13:00");
    record12.set("end_time", "21:00");
    record12.set("is_available", true);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    const record13_model_idLookup = app.findFirstRecordByFilter("models", "email='jefferson@meggy.com'");
    if (!record13_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='jefferson@meggy.com'\""); }
    record13.set("model_id", record13_model_idLookup.id);
    record13.set("day_of_week", "quinta");
    record13.set("start_time", "15:00");
    record13.set("end_time", "23:00");
    record13.set("is_available", true);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    const record14_model_idLookup = app.findFirstRecordByFilter("models", "email='jefferson@meggy.com'");
    if (!record14_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='jefferson@meggy.com'\""); }
    record14.set("model_id", record14_model_idLookup.id);
    record14.set("day_of_week", "domingo");
    record14.set("start_time", "16:00");
    record14.set("end_time", "23:00");
    record14.set("is_available", true);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    const record15_model_idLookup = app.findFirstRecordByFilter("models", "email='rafael@meggy.com'");
    if (!record15_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='rafael@meggy.com'\""); }
    record15.set("model_id", record15_model_idLookup.id);
    record15.set("day_of_week", "segunda");
    record15.set("start_time", "10:00");
    record15.set("end_time", "18:00");
    record15.set("is_available", true);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    const record16_model_idLookup = app.findFirstRecordByFilter("models", "email='rafael@meggy.com'");
    if (!record16_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='rafael@meggy.com'\""); }
    record16.set("model_id", record16_model_idLookup.id);
    record16.set("day_of_week", "quarta");
    record16.set("start_time", "11:00");
    record16.set("end_time", "19:00");
    record16.set("is_available", true);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    const record17_model_idLookup = app.findFirstRecordByFilter("models", "email='rafael@meggy.com'");
    if (!record17_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='rafael@meggy.com'\""); }
    record17.set("model_id", record17_model_idLookup.id);
    record17.set("day_of_week", "sexta");
    record17.set("start_time", "10:00");
    record17.set("end_time", "18:00");
    record17.set("is_available", true);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    const record18_model_idLookup = app.findFirstRecordByFilter("models", "email='rafael@meggy.com'");
    if (!record18_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='rafael@meggy.com'\""); }
    record18.set("model_id", record18_model_idLookup.id);
    record18.set("day_of_week", "s\u00e1bado");
    record18.set("start_time", "09:00");
    record18.set("end_time", "17:00");
    record18.set("is_available", true);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    const record19_model_idLookup = app.findFirstRecordByFilter("models", "email='rafael@meggy.com'");
    if (!record19_model_idLookup) { throw new Error("Lookup failed for model_id: no record in 'models' matching \"email='rafael@meggy.com'\""); }
    record19.set("model_id", record19_model_idLookup.id);
    record19.set("day_of_week", "domingo");
    record19.set("start_time", "14:00");
    record19.set("end_time", "20:00");
    record19.set("is_available", true);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})