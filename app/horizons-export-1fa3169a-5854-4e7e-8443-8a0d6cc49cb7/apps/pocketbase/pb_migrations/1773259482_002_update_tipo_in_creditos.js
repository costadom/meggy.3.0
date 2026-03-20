/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("creditos");
  const field = collection.fields.getByName("tipo");
  field.values = ["Recarga", "Consumo", "Reembolso"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("creditos");
  const field = collection.fields.getByName("tipo");
  field.values = ["Recarga", "Consumo"];
  return app.save(collection);
})