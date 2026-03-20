/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.updateRule = "id = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  collection.updateRule = "id = @request.auth.id";
  return app.save(collection);
})