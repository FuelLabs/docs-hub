import { test } from "./utils/fixtures";
import { runTest } from "./utils/runTest";
import { setupFolders, startServers, stopServers } from "./utils/setup";
import { useFuelWallet } from "./utils/wallet";

test.describe("Guides", () => {
  test("quickstart", async ({ context, extensionId, page }) => {
    const CONTRACT_QUICKSTART_PAGE_URL = "guides/contract-quickstart";

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    await setupFolders("fuel-project");
    await startServers(page);

    // TEST CONTRACT QUICKSTART
    await runTest(page, context, CONTRACT_QUICKSTART_PAGE_URL);

    // SHUT DOWN
    stopServers();
    // context.close();
  });

  test("counter-dapp", async ({ context, extensionId, page }) => {
    const CONTRACT_PAGE_URL = "guides/counter-dapp/building-a-smart-contract";
    const FRONTEND_PAGE_URL = "guides/counter-dapp/building-a-frontend";

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    await setupFolders("fuel-project");
    await startServers(page);

    // TEST CONTRACT
    await runTest(page, context, CONTRACT_PAGE_URL);

    // TEST FRONTEND
    await runTest(page, context, FRONTEND_PAGE_URL);

    // SHUT DOWN
    stopServers();
    // context.close();
  });

  test("intro to sway", async ({ context, extensionId, page }) => {
    const PREREQUISITES_PAGE_URL = "guides/intro-to-sway/prerequisites";
    const IMPORTS_PAGE_URL = "guides/intro-to-sway/contract-imports";
    const STRUCTS_PAGE_URL = "guides/intro-to-sway/contract-structs";
    const ABI_PAGE_URL = "guides/intro-to-sway/contract-abi";
    const STORAGE_PAGE_URL = "guides/intro-to-sway/contract-storage";
    const ERRORS_PAGE_URL = "guides/intro-to-sway/contract-errors";
    const FUNCTIONS_PAGE_URL = "guides/intro-to-sway/contract-functions";
    const CHECKPOINT_PAGE_URL = "guides/intro-to-sway/checkpoint";
    const FUELS_RS_PAGE_URL = "guides/intro-to-sway/rust-sdk";
    const FUELS_TS_PAGE_URL = "guides/intro-to-sway/typescript-sdk";

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    await setupFolders("fuel-project");
    await startServers(page);

    // TEST CONTRACT
    await runTest(page, context, PREREQUISITES_PAGE_URL);
    await runTest(page, context, IMPORTS_PAGE_URL);
    await runTest(page, context, STRUCTS_PAGE_URL);
    await runTest(page, context, ABI_PAGE_URL);
    await runTest(page, context, STORAGE_PAGE_URL);
    await runTest(page, context, ERRORS_PAGE_URL);
    await runTest(page, context, FUNCTIONS_PAGE_URL);
    await runTest(page, context, CHECKPOINT_PAGE_URL);
    await runTest(page, context, FUELS_RS_PAGE_URL);
    await runTest(page, context, FUELS_TS_PAGE_URL);

    // SHUT DOWN
    stopServers();
    // context.close();
  });

  test("intro to predicates", async ({ context, extensionId, page }) => {
    const PREREQUISITES_PAGE_URL = "guides/intro-to-predicates/prerequisites";
    const PREDICATE_ROOT_PAGE_URL = "guides/intro-to-predicates/predicate-root";
    const IMPORTS_PAGE_URL = "guides/intro-to-predicates/imports";
    const CONFIGURABLES_PAGE_URL = "guides/intro-to-predicates/configurables";
    const SIGNATURE_VERIFICATION_PAGE_URL =
      "guides/intro-to-predicates/signature-verification";
    const MAIN_PAGE_URL = "guides/intro-to-predicates/main";
    const CHECKPOINT_PAGE_URL = "guides/intro-to-predicates/checkpoint";
    const SCRIPT_DEBUG_PAGE_URL =
      "guides/intro-to-predicates/debugging-with-scripts";
    const SCRIPT_LOGS_PAGE_URL =
      "guides/intro-to-predicates/debugging-with-scripts-rust";
    const FUELS_RS_PAGE_URL = "guides/intro-to-predicates/rust-sdk";

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    await setupFolders("fuel-project");
    await startServers(page);

    // TEST CONTRACT
    await runTest(page, context, PREREQUISITES_PAGE_URL);
    await runTest(page, context, PREDICATE_ROOT_PAGE_URL);
    await runTest(page, context, IMPORTS_PAGE_URL);
    await runTest(page, context, CONFIGURABLES_PAGE_URL);
    await runTest(page, context, SIGNATURE_VERIFICATION_PAGE_URL);
    await runTest(page, context, MAIN_PAGE_URL);
    await runTest(page, context, CHECKPOINT_PAGE_URL);

    // TEST RUST
    await runTest(page, context, SCRIPT_DEBUG_PAGE_URL);
    await runTest(page, context, SCRIPT_LOGS_PAGE_URL);
    await runTest(page, context, FUELS_RS_PAGE_URL);

    // SHUT DOWN
    stopServers();
    // context.close();
  });
});
