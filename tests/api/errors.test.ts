import { describe, expect, it } from "vitest";

import { normalizeApiErrorBody } from "@/lib/api/errors";

describe("normalizeApiErrorBody", () => {
  it("returns default message for non-objects", () => {
    expect(normalizeApiErrorBody(null)).toEqual({ message: "Request failed" });
  });

  it("returns message when errors object is missing", () => {
    expect(normalizeApiErrorBody({ message: "Bad request" })).toEqual({
      message: "Bad request",
    });
  });

  it("extracts field errors and first message", () => {
    const body = {
      message: "Validation failed",
      errors: {
        email: ["Email is invalid"],
        password: ["Password is too short"],
      },
    };
    expect(normalizeApiErrorBody(body)).toEqual({
      message: "Email is invalid",
      fieldErrors: body.errors,
    });
  });

  it("ignores invalid errors payload", () => {
    expect(normalizeApiErrorBody({ message: "x", errors: ["bad"] })).toEqual({
      message: "x",
    });
  });
});
