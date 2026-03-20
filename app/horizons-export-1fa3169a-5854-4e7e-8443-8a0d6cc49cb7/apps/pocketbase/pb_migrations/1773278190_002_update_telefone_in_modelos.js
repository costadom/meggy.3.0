/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  const field = collection.fields.getByName("telefone");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("modelos");
  const field = collection.fields.getByName("telefone");
  field.required = false;
  return app.save(collection);
})