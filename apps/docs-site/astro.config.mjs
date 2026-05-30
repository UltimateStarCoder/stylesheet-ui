import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://stylesheet-ui.dev",
  integrations: [
    starlight({
      title: "stylesheet-ui",
      description:
        "Copy-paste React Native components for Expo, distributed as source you own. Plain StyleSheet. No DSL. No lock-in.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/UltimateStarCoder/stylesheet-ui",
        },
      ],
      // Component groups are generated from the folder tree: a new page added
      // under any group directory shows up in the sidebar automatically, so
      // this list can't drift from the pages on disk. Each group's pages sort
      // alphabetically by title; add `sidebar.order` frontmatter to a page to
      // override its position within its group.
      sidebar: [
        { label: "Getting started", slug: "getting-started" },
        { label: "Theme", slug: "theme" },
        { label: "Hooks", slug: "hooks" },
        { label: "Layout", items: [{ autogenerate: { directory: "components/layout" } }] },
        { label: "Display", items: [{ autogenerate: { directory: "components/display" } }] },
        { label: "Inputs", items: [{ autogenerate: { directory: "components/inputs" } }] },
        { label: "Feedback", items: [{ autogenerate: { directory: "components/feedback" } }] },
        { label: "Overlays", items: [{ autogenerate: { directory: "components/overlays" } }] },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/Head.astro",
      },
    }),
    mdx(),
  ],
});
