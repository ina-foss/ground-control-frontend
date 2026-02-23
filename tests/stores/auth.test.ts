import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useAuth } from "../../app/stores/auth";

describe("useAuth store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should have default values", () => {
    const auth = useAuth();
    expect(auth.user).toBe(null);
    expect(auth.access_token).toBe("");
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.tenantId).toBe("");
  });

  it("should clear user session", () => {
    const auth = useAuth();
    const fakeUser = {
      access_token: "token",
      profile: { email: "user@example.com", Tenant: "tenant-1" },
    } as any;

    auth.setUpUserCredentials(fakeUser);
    expect(auth.isLoggedIn).toBe(true);

    auth.clearUserSession();
    expect(auth.isLoggedIn).toBe(false);
  });
});
