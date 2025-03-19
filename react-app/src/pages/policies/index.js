import React from "react"
import Policies from "../../components/policies"
import { Seo } from "../../utils/Seo";

export default function IndexPolicies() {
  return (
    <Policies>
      <h1>Policies</h1>
    </Policies>
  )
}

export function Head() {
  return <Seo title="MorPhiC program: Molecular Phenotypes of Null Alleles in Cells" />;
}
