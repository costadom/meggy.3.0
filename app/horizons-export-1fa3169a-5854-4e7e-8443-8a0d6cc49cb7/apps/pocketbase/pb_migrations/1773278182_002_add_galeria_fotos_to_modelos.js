/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("galeria_fotos");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("galeria_fotos"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "galeria_fotos",
    required: false,
    maxSelect: 10,
    maxSize: 5242880
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("galeria_fotos");
  return app.save(collection);
})