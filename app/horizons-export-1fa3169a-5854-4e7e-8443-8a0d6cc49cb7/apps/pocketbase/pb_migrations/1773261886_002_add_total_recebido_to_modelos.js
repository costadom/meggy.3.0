/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("total_recebido");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("total_recebido"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "total_recebido"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("total_recebido");
  return app.save(collection);
})