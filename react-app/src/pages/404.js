import { Link } from "gatsby"
import React from "react"

export default function PageNotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Sorry this pages does not exist.</p>
      <Link to="/">Visit the homepage</Link>
    </div>
  )
}
