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
      sidebar: [
        { label: "Getting started", slug: "getting-started" },
        { label: "Theme", slug: "theme" },
        { label: "Hooks", slug: "hooks" },
        {
          label: "Layout",
          items: [
            "components/screen",
            "components/stack",
            "components/divider",
          ],
        },
        {
          label: "Display",
          items: [
            "components/text",
            "components/avatar",
            "components/badge",
            "components/card",
            "components/list-item",
            "components/list",
            "components/section",
            "components/settings-row",
            "components/skeleton",
            "components/table",
          ],
        },
        {
          label: "Inputs",
          items: [
            "components/button",
            "components/input",
            "components/switch",
            "components/checkbox",
            "components/radio",
            "components/slider",
            "components/select",
          ],
        },
        {
          label: "Feedback",
          items: [
            "components/spinner",
            "components/progress",
            "components/alert",
            "components/toast",
          ],
        },
        {
          label: "Overlays",
          items: [
            "components/modal",
            "components/alert-dialog",
            "components/tabs",
            "components/accordion",
            "components/bottom-sheet",
            "components/menu",
            "components/tooltip",
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        Head: "./src/components/Head.astro",
      },
    }),
    mdx(),
  ],
});
