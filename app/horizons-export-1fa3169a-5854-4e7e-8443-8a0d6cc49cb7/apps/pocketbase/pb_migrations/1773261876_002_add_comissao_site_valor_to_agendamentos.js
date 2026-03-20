/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");

  const existing = collection.fields.getByName("comissao_site_valor");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("comissao_site_valor"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "comissao_site_valor"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");
  collection.fields.removeByName("comissao_site_valor");
  return app.save(collection);
})