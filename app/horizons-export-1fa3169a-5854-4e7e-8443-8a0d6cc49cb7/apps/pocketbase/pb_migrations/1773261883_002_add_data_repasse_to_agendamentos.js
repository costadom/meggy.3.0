/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");

  const existing = collection.fields.getByName("data_repasse");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("data_repasse"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "data_repasse"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");
  collection.fields.removeByName("data_repasse");
  return app.save(collection);
})