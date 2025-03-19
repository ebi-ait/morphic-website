import { Link } from "gatsby"
import React from "react"
import { Seo } from "../utils/Seo";

export default function PageNotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Sorry this pages does not exist.</p>
      <Link to="/">Visit the homepage</Link>
    </div>
  )
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}