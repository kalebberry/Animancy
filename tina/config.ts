import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
const tina_clientID = process.env.PUBLIC_TINA_CLIENT_ID;
const tina_token = process.env.PUBLIC_TINA_TOKEN;
const tina_search = process.env.PUBLIC_TINA_SEARCH;

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
      mediaRoot: "media",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "datetime",
            name: "posted",
            label: "Date Posted",
            required: true,
          },
          {
            type: 'image',
            label: 'Hero image',
            name: 'imgSrc',
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
    search: {
    tina: {
      indexerToken: tina_search,
      stopwordLanguages: ['eng']
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100
  }
});
