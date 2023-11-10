import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = import.meta.env.HEAD || import.meta.env.VERCEL_GIT_COMMIT_REF || "main";
const tina_clientID = import.meta.env.TINA_CLIENT_ID;
const tina_token = import.meta.env.TINA_TOKEN;

export default defineConfig({
  branch,
  clientId: tina_clientID, // Get this from tina.io
  token: tina_token, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "posted",
            label: "Date Posted",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
