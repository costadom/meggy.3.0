/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("documento_rg");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("documento_rg"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "documento_rg",
    required: false,
    maxSelect: 1,
    maxSize: 10485760
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("documento_rg");
  return app.save(collection);
})