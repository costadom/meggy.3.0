/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");

  const existing = collection.fields.getByName("status_repasse");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("status_repasse"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "status_repasse",
    values: ["Pendente", "Processado"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");
  collection.fields.removeByName("status_repasse");
  return app.save(collection);
})