/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("models");

  const record0 = new Record(collection);
    record0.set("email", "juju.bates@meggy.com");
    record0.setPassword("juju123456");
    record0.set("artistic_name", "Juju Bates");
    record0.set("full_name", "Juliana Bates");
    record0.set("phone", "+55 11 98765-4321");
    record0.set("birth_date", "1998-05-15");
    record0.set("city", "S\u00e3o Paulo");
    record0.set("state", "SP");
    record0.set("bio", "Gameplay e conversa! Adoro jogar casual games e conversar com meus seguidores. Vamos se divertir juntos!");
    record0.set("hourly_rate", 50);
    record0.set("credits_per_hour", 50);
    record0.set("status", "aprovado");
    record0.set("verified", true);
    record0.set("category", "Casual");
    record0.set("rating", 4.8);
    record0.set("reviews_count", 127);
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
    record1.set("email", "luna.gamer@meggy.com");
    record1.setPassword("luna123456");
    record1.set("artistic_name", "Luna");
    record1.set("full_name", "Luna Silva");
    record1.set("phone", "+55 21 99876-5432");
    record1.set("birth_date", "2000-08-22");
    record1.set("city", "Rio de Janeiro");
    record1.set("state", "RJ");
    record1.set("bio", "FPS pro player! Gameplay + conversa. Vem jogar comigo e aprenda algumas t\u00e9cnicas!");
    record1.set("hourly_rate", 79);
    record1.set("credits_per_hour", 79);
    record1.set("status", "aprovado");
    record1.set("verified", true);
    record1.set("category", "FPS");
    record1.set("rating", 4.9);
    record1.set("reviews_count", 256);
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
    record2.set("email", "maya.moba@meggy.com");
    record2.setPassword("maya123456");
    record2.set("artistic_name", "Maya");
    record2.set("full_name", "Maria Oliveira");
    record2.set("phone", "+55 31 98765-4321");
    record2.set("birth_date", "1997-03-10");
    record2.set("city", "Belo Horizonte");
    record2.set("state", "MG");
    record2.set("bio", "MOBA enthusiast! Jogo junto com voc\u00ea. Vamos conquistar a vit\u00f3ria!");
    record2.set("hourly_rate", 99);
    record2.set("credits_per_hour", 99);
    record2.set("status", "aprovado");
    record2.set("verified", true);
    record2.set("category", "MOBA");
    record2.set("rating", 4.7);
    record2.set("reviews_count", 189);
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
    record3.set("email", "jefferson.queiroz@meggy.com");
    record3.setPassword("jefferson123456");
    record3.set("artistic_name", "Jefferson Queiroz");
    record3.set("full_name", "Jefferson Queiroz Santos");
    record3.set("phone", "+55 85 99876-5432");
    record3.set("birth_date", "1995-11-28");
    record3.set("city", "Fortaleza");
    record3.set("state", "CE");
    record3.set("bio", "Gameplay FPS! Experi\u00eancia de 10 anos em competitive gaming. Vem aprender!");
    record3.set("hourly_rate", 60);
    record3.set("credits_per_hour", 60);
    record3.set("status", "aprovado");
    record3.set("verified", true);
    record3.set("category", "FPS");
    record3.set("rating", 4.6);
    record3.set("reviews_count", 98);
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
    record4.set("email", "rafael.costa@meggy.com");
    record4.setPassword("rafael123456");
    record4.set("artistic_name", "Rafael Costa");
    record4.set("full_name", "Rafael Costa Mendes");
    record4.set("phone", "+55 47 98765-4321");
    record4.set("birth_date", "2001-07-05");
    record4.set("city", "Blumenau");
    record4.set("state", "SC");
    record4.set("bio", "Conversa e divers\u00e3o! Adoro conhecer pessoas novas e bater papo enquanto jogamos.");
    record4.set("hourly_rate", 45);
    record4.set("credits_per_hour", 45);
    record4.set("status", "aprovado");
    record4.set("verified", true);
    record4.set("category", "Casual");
    record4.set("rating", 4.5);
    record4.set("reviews_count", 76);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("email", "ana.gameplay@meggy.com");
    record5.setPassword("ana123456");
    record5.set("artistic_name", "Ana Gamer");
    record5.set("full_name", "Ana Carolina Ferreira");
    record5.set("phone", "+55 61 99876-5432");
    record5.set("birth_date", "1999-02-14");
    record5.set("city", "Bras\u00edlia");
    record5.set("state", "DF");
    record5.set("bio", "Gameplay multiplayer! Especialista em jogos cooperativos. Vamos jogar em equipe!");
    record5.set("hourly_rate", 55);
    record5.set("credits_per_hour", 55);
    record5.set("status", "aprovado");
    record5.set("verified", true);
    record5.set("category", "Gameplay");
    record5.set("rating", 4.7);
    record5.set("reviews_count", 142);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("email", "carlos.moba@meggy.com");
    record6.setPassword("carlos123456");
    record6.set("artistic_name", "Carlos Pro");
    record6.set("full_name", "Carlos Alberto Silva");
    record6.set("phone", "+55 71 98765-4321");
    record6.set("birth_date", "1996-09-19");
    record6.set("city", "Salvador");
    record6.set("state", "BA");
    record6.set("bio", "MOBA master! Ranked player. Vem subir de elo comigo!");
    record6.set("hourly_rate", 85);
    record6.set("credits_per_hour", 85);
    record6.set("status", "aprovado");
    record6.set("verified", true);
    record6.set("category", "MOBA");
    record6.set("rating", 4.8);
    record6.set("reviews_count", 203);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("email", "beatriz.casual@meggy.com");
    record7.setPassword("beatriz123456");
    record7.set("artistic_name", "Bia Casual");
    record7.set("full_name", "Beatriz Martins");
    record7.set("phone", "+55 92 99876-5432");
    record7.set("birth_date", "2002-04-08");
    record7.set("city", "Manaus");
    record7.set("state", "AM");
    record7.set("bio", "Casual games e conversa! Relaxante e divertido. Perfeito para desestressar!");
    record7.set("hourly_rate", 40);
    record7.set("credits_per_hour", 40);
    record7.set("status", "aprovado");
    record7.set("verified", true);
    record7.set("category", "Casual");
    record7.set("rating", 4.4);
    record7.set("reviews_count", 64);
  try {
    app.save(record7);
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