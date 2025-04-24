import type { Config } from "sst/node/config";

export default {
  config(_input: unknown) {
    return {
      name: "wedding-backend",
      region: "eu-north-1", // You can change this to your preferred region
      sso: {
        accountId: "890474693339",
        roleName: "AdministratorAccess"
      }
    };
  },
  async stacks(app: any) {
    const { WeddingStack } = await import("./stacks/WeddingStack");
    app.stack(WeddingStack);
  }
}; 