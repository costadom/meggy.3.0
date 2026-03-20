/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("agenda_disponibilidade");
  collection.listRule = "";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "modelo_id = @request.auth.id";
  collection.deleteRule = "modelo_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("agenda_disponibilidade");
  collection.listRule = "";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "modelo_id = @request.auth.id";
  collection.deleteRule = "modelo_id = @request.auth.id";
  return app.save(collection);
})