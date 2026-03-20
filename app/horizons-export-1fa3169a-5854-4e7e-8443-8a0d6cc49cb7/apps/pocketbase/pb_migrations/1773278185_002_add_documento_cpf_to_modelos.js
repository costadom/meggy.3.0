/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");

  const existing = collection.fields.getByName("documento_cpf");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("documento_cpf"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "documento_cpf",
    required: false,
    maxSelect: 1,
    maxSize: 10485760
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.fields.removeByName("documento_cpf");
  return app.save(collection);
})