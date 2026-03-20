/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  const field = collection.fields.getByName("status_aprovacao");
  field.values = ["Em an\u00e1lise", "Aprovada", "Recusada", "Publicada"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  const field = collection.fields.getByName("status_aprovacao");
  field.values = ["Pendente", "Aprovada", "Recusada"];
  return app.save(collection);
})