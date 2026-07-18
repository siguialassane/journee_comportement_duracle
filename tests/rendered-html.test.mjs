import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("rend la page publique et ses informations essentielles", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Journée du Comportement Durable/i);
  assert.match(html, /10 et 11 septembre 2026/i);
  assert.match(html, /Abidjan, Côte d(?:&#x27;|')Ivoire/i);
  assert.match(html, /Partenaire institutionnel/i);
  assert.match(html, /Je m(?:&#x27;|'|’)inscris/i);
});

test("conserve les ressources de marque et la configuration sécurisée", async () => {
  const [layout, route, config, envExample] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/inscriptions/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /lang="fr"/);
  assert.match(layout, /\/og\.png/);
  assert.match(config, /SUPABASE_SECRET_KEY/);
  assert.match(route, /parsePhoneNumberFromString/);
  assert.match(envExample, /EMAILJS_PRIVATE_KEY=/);

  await Promise.all([
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/images/brand/jcd-logo.png", import.meta.url)),
    access(new URL("../public/images/brand/difference-group.png", import.meta.url)),
    access(new URL("../supabase/migrations/202607180001_initial.sql", import.meta.url)),
  ]);
});
