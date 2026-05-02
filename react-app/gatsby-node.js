// gatsby-node.js
const { graphql } = require("gatsby");
const path = require("path");

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Only update the `/genes/[geneId]` page.
  if (page.path.match(/^\/genes\/[^/]+\/$/)) {
    const oldPage = { ...page };

    // Remove the trailing slash if your paths don't have it
    page.matchPath = "/genes/:geneId";

    // Replace the old page with the new one
    deletePage(oldPage);
    createPage(page);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allMdx {
          nodes {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    `
  );

  // Page for every doc file, asumes slug path starts with '/docs'
  result.data.allMdx.nodes.forEach(node => {
    createPage({
      path: node.frontmatter.slug,
      component: path.resolve(`./src/templates/doc-template.js`),
      context: {
        id: node.id,
      },
    });
  });
};