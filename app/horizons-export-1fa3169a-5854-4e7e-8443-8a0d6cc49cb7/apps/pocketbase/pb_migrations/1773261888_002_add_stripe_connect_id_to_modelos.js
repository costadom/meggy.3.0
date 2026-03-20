/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("stripe_connect_id");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("stripe_connect_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "stripe_connect_id"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("stripe_connect_id");
  return app.save(collection);
})