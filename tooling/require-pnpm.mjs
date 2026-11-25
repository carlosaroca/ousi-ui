// Run by `prepublishOnly` in the published packages.
// Only pnpm turns `workspace:` ranges into real versions. A package published with npm keeps them,
// and then `npm install` fails with EUNSUPPORTEDPROTOCOL.
if (!process.env.npm_config_user_agent?.startsWith('pnpm/')) {
  console.error('\nPublish with `pnpm publish`. npm would leave "workspace:" versions in the package.\n')
  process.exit(1)
}
