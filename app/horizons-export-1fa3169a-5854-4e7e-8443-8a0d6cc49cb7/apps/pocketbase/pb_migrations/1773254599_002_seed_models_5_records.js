/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("models");

  const record0 = new Record(collection);
    record0.set("artistic_name", "Juju Bates");
    record0.set("full_name", "Juliana Bates");
    record0.set("email", "juju@meggy.com");
    record0.setPassword("juju123");
    record0.set("phone", "11999999999");
    record0.set("birth_date", "1998-05-15");
    record0.set("city", "S\u00e3o Paulo");
    record0.set("state", "SP");
    record0.set("bio", "Parceira ideal para sua jogatina ou para fazer companhia em s\u00e9ries e filmes. Engra\u00e7ada, descontra\u00edda e com atendimento personalizado.");
    record0.set("hourly_rate", 50);
    record0.set("credits_per_hour", 50);
    record0.set("category", "Gameplay");
    record0.set("status", "aprovado");
    record0.set("verified", true);
    record0.set("rating", 4.8);
    record0.set("reviews_count", 45);
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
    record1.set("artistic_name", "Luna");
    record1.set("full_name", "Luna Silva");
    record1.set("email", "luna@meggy.com");
    record1.setPassword("luna123");
    record1.set("phone", "11988888888");
    record1.set("birth_date", "1999-08-22");
    record1.set("city", "Rio de Janeiro");
    record1.set("state", "RJ");
    record1.set("bio", "Luna oferece sess\u00f5es leves, divertidas e personalizadas para quem quer joga junto, assistir junto, joga e reata");
    record1.set("hourly_rate", 79);
    record1.set("credits_per_hour", 79);
    record1.set("category", "Gameplay");
    record1.set("status", "aprovado");
    record1.set("verified", true);
    record1.set("rating", 4.9);
    record1.set("reviews_count", 78);
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
    record2.set("artistic_name", "Maya");
    record2.set("full_name", "Maria Oliveira");
    record2.set("email", "maya@meggy.com");
    record2.setPassword("maya123");
    record2.set("phone", "11987654321");
    record2.set("birth_date", "1997-03-10");
    record2.set("city", "Belo Horizonte");
    record2.set("state", "MG");
    record2.set("bio", "Maya tem um perfil mais intenso e competitivo, ideal para uma sess\u00e3o com energia, intera\u00e7\u00e3o e partidas agitadas");
    record2.set("hourly_rate", 99);
    record2.set("credits_per_hour", 99);
    record2.set("category", "FPS");
    record2.set("status", "aprovado");
    record2.set("verified", true);
    record2.set("rating", 4.7);
    record2.set("reviews_count", 62);
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
    record3.set("artistic_name", "Jefferson Queiroz");
    record3.set("full_name", "Jefferson Queiroz");
    record3.set("email", "jefferson@meggy.com");
    record3.setPassword("jeff123");
    record3.set("phone", "11986543210");
    record3.set("birth_date", "1996-11-05");
    record3.set("city", "Curitiba");
    record3.set("state", "PR");
    record3.set("bio", "Gameplay intenso com foco em competi\u00e7\u00e3o e estrat\u00e9gia");
    record3.set("hourly_rate", 60);
    record3.set("credits_per_hour", 60);
    record3.set("category", "MOBA");
    record3.set("status", "aprovado");
    record3.set("verified", true);
    record3.set("rating", 4.6);
    record3.set("reviews_count", 38);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("artistic_name", "Rafael Costa");
    record4.set("full_name", "Rafael Costa");
    record4.set("email", "rafael@meggy.com");
    record4.setPassword("rafael123");
    record4.set("phone", "11985432109");
    record4.set("birth_date", "2000-07-18");
    record4.set("city", "Salvador");
    record4.set("state", "BA");
    record4.set("bio", "Conversa descontra\u00edda e companhia agrad\u00e1vel para qualquer momento");
    record4.set("hourly_rate", 45);
    record4.set("credits_per_hour", 45);
    record4.set("category", "Conversa");
    record4.set("status", "aprovado");
    record4.set("verified", true);
    record4.set("rating", 4.5);
    record4.set("reviews_count", 29);
  try {
    app.save(record4);
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