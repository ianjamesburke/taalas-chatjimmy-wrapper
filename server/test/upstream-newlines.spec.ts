import { describe, expect, it } from "vitest";
import {
  UpstreamChunkParser,
  parseUpstreamChunk,
} from "../src/stream/upstream-data-parser.js";

const text = (events: { type: string; delta?: string }[]) =>
  events.map((e) => e.delta ?? "").join("");

describe("raw-text newlines", () => {
  it("preserves line breaks and blank lines", () => {
    expect(text(parseUpstreamChunk("a\nb\n\nc"))).toBe("a\nb\n\nc");
  });

  it("preserves breaks split across chunks", () => {
    const p = new UpstreamChunkParser();
    const out = [
      ...p.parseChunk("one\ntw"),
      ...p.parseChunk("o\n"),
      ...p.flush(),
    ];
    expect(text(out)).toBe("one\ntwo\n");
  });

  it("still drops blank separators between protocol records", () => {
    const events = parseUpstreamChunk('0:"hi"\n\n0:" there"\n');
    expect(text(events)).toBe("hi there");
  });
});
