/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pacotes_creditos");

  const record0 = new Record(collection);
    record0.set("nome", "Pacote Pequeno");
    record0.set("quantidade_creditos", 100);
    record0.set("preco_reais", 29.9);
    record0.set("desconto_percentual", 0);
    record0.set("preco_final", 29.9);
    record0.set("ativo", true);
    record0.set("ordem", 1);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("nome", "Pacote M\u00e9dio");
    record1.set("quantidade_creditos", 250);
    record1.set("preco_reais", 69.9);
    record1.set("desconto_percentual", 10);
    record1.set("preco_final", 62.91);
    record1.set("ativo", true);
    record1.set("ordem", 2);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("nome", "Pacote Grande");
    record2.set("quantidade_creditos", 500);
    record2.set("preco_reais", 129.9);
    record2.set("desconto_percentual", 15);
    record2.set("preco_final", 110.42);
    record2.set("ativo", true);
    record2.set("ordem", 3);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("nome", "Pacote Premium");
    record3.set("quantidade_creditos", 1000);
    record3.set("preco_reais", 249.9);
    record3.set("desconto_percentual", 20);
    record3.set("preco_final", 199.92);
    record3.set("ativo", true);
    record3.set("ordem", 4);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})