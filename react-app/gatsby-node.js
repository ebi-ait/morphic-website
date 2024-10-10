// gatsby-node.js

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
