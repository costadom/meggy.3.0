/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.listRule = "status_aprovacao = 'Aprovada' || @request.auth.id != ''";
  collection.viewRule = "status_aprovacao = 'Aprovada' || @request.auth.id != ''";
  collection.updateRule = "id = @request.auth.id || @request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.listRule = "status_aprovacao = 'Aprovada'";
  collection.viewRule = "status_aprovacao = 'Aprovada'";
  collection.updateRule = "id = @request.auth.id";
  return app.save(collection);
})