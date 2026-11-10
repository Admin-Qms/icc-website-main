import assert from "node:assert/strict";
import test from "node:test";
import { imageKitSrc } from "../lib/imagekit-loader.ts";

const ENDPOINT = "https://ik.imagekit.io/ysgvhleg8";

test("site images are served from ImageKit at the requested width", () => {
  assert.equal(
    imageKitSrc(ENDPOINT, { src: "/images/platform/platform-electronics.webp", width: 640 }),
    "https://ik.imagekit.io/ysgvhleg8/images/platform/platform-electronics.webp?tr=w-640,c-at_max,q-80,f-auto",
  );
  assert.ok(imageKitSrc(`${ENDPOINT}/`, { src: "/a.png", width: 96, quality: 60 }).endsWith("/ysgvhleg8/a.png?tr=w-96,c-at_max,q-60,f-auto"));
});

test("without an endpoint, or for outside images, the src is left alone", () => {
  assert.equal(imageKitSrc(undefined, { src: "/images/logo-mark.png", width: 48 }), "/images/logo-mark.png");
  assert.equal(imageKitSrc(ENDPOINT, { src: "https://example.com/a.jpg", width: 48 }), "https://example.com/a.jpg");
});
