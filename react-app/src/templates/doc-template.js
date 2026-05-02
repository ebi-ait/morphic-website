import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
// import { components } from "../components/mdx-components";

const components = {
    h1: (props) => <h1 {...props} style={{ color: "red" }} />,
    h2: (props) => <h2 {...props} style={{ color: "red" }} />,
    h3: (props) => <h3 {...props} style={{ color: "red" }} />,
    ul: (props) => <ul {...props} style={{ color: "red" }} />,
    li: (props) => <li {...props} style={{ color: "red" }} />,
}

export default function DocTemplate({ data }) {
    const { mdx } = data;

    return (
        <main>
            <h1>{mdx.frontmatter.title}</h1>
            <article>
                <MDXProvider components={components}>
                    {mdx.body}
                </MDXProvider>
            </article>
        </main>
    )
}

export const query = graphql`
    query($id: String!) {
        mdx(id: { eq: $id }) {
            body
            frontmatter {
                title
            }
        }
    }
`;
