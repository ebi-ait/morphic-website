import React from "react"

import Policies from "../../components/policies"

export default function IndexPolicies() {
  return (
    <Policies>
        <h1>Policies</h1>
    </Policies>
  )
}

export function Head() {
  return (
    <>
      <title>Study Tracker</title>
      <link id="icon" rel="icon" href="favicon.svg" />
    </>
  )
}