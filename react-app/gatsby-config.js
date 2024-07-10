/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          quality: 90, // Adjust quality as needed
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          placeholder: `blurred`,
        },
      },
    },
    `gatsby-transformer-sharp`, // Needed for dynamic images
  ],
}
