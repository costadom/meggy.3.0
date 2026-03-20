/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("saldo_a_receber");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("saldo_a_receber"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "saldo_a_receber"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("saldo_a_receber");
  return app.save(collection);
})