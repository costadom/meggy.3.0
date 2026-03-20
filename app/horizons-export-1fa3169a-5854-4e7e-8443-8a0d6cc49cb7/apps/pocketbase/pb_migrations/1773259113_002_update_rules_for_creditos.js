/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("creditos");
  collection.listRule = "usuario_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "usuario_id = @request.auth.id";
  collection.deleteRule = "usuario_id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("creditos");
  collection.listRule = "user_id = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "user_id = @request.auth.id";
  collection.deleteRule = "user_id = @request.auth.id";
  return app.save(collection);
})