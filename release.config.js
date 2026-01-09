/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ["main", { name: "develop", prerelease: "beta", channel: "beta" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle:
          "# Changelog\n\nAll notable changes to this project will be documented in this file.",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        pkgRoot: "./",
        tarballDir: "release",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
