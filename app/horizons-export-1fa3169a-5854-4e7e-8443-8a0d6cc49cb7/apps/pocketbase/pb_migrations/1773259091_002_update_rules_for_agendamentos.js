/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");
  collection.listRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  collection.deleteRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("agendamentos");
  collection.listRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  collection.deleteRule = "cliente_id = @request.auth.id || modelo_id = @request.auth.id";
  return app.save(collection);
})