/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("foto_perfil_arquivo");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("foto_perfil_arquivo"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "foto_perfil_arquivo",
    required: false,
    maxSelect: 1,
    maxSize: 5242880
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("foto_perfil_arquivo");
  return app.save(collection);
})