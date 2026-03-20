/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("credits");

  const record0 = new Record(collection);
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='cliente@meggy.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='cliente@meggy.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("balance", 500);
    record0.set("total_purchased", 500);
    record0.set("total_spent", 0);
  try {
    app.save(record0);
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