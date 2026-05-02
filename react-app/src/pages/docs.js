import React from "react"
import { Link, graphql } from "gatsby"

export default function Docs({ data }) {
  return (
    <main>
        <h1>Documention</h1>
        <ul>
            {data.allMdx.nodes.map(doc => (
                <li key={doc.id}>
                    <Link to={doc.frontmatter.slug}>
                        {doc.frontmatter.title}
                    </Link>
                </li>
            ))}
        </ul>
    </main>
  )
}

export const query = graphql`
    {
        allMdx {
            nodes {
                frontmatter {
                    title
                    slug
                }
                id
            }
        }
    }
`;
