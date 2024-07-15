import React from "react";
import Policies from "../../components/policies";

export default function AffiliateMembershipPolicy() {
  return (
    <Policies>
      <h1>MorPhiC Affiliate Membership</h1>

      <p>
        The MorPhiC Program offers researchers not currently funded by the
        MorPhiC Consortium the opportunity to apply to join the program as
        non-voting affiliate members. MorPhiC expects to benefit from the unique
        expertise affiliated members can bring to the Consortium. MorPhiC
        anticipates an affiliated member’s benefits will include the highly
        interactive research environment, participating in Consortium
        discussions across a broad range of activities, participating in
        Consortium analyses, and access to data prior to QC.
      </p>

      <p>
        Affiliate members are expected to contribute to the goals of the MorPhiC
        Consortium by generating data, analyses, or software tools, by sharing
        data and/or analyses freely through the MorPhiC Data Resource and
        Administrative Coordinating Center (DRACC), and/or by contributing to
        cross- consortium integrative analyses. Alternatives to this are
        possible e.g., a direct collaboration between a MorPhiC member and an
        external researcher, without sharing MorPhiC resources beyond what that
        MorPhiC member has created. Affiliate members are also expected to be
        actively engaged in MorPhiC activities (i.e. participate in working
        groups as appropriate, attend the MorPhiC annual meeting) and to abide
        by all policies approved by the consortium and any other pertinent NIH
        policies. Failure to abide by these rules and policies may result in
        suspension of membership.
      </p>

      <p>
        Affiliate membership does not directly or indirectly imply a commitment
        to funding by the NIH.
      </p>

      <h1>Steps in the process: </h1>
      <ul>
        <li>
          Submit application to NHGRI Staff via their Institutional Signing
          Official (example below for US researchers){" "}
        </li>
        <li>Bring application SC for approval (NHGRI will do this) </li>
        <li>
          Sign Data Use Agreement for access to data before public availability
          (this will follow standard institutional signature as all MorPhiC
          members)
        </li>
        <li>
          Investigators who are members of non-US institutions will have to go
          through a different process for approval (no formal procedure for this
          has been established yet).
        </li>
      </ul>

      <h2>MorPhiC Affiliate Membership Application</h2>

      <p>
        <b>
          Application process for joining the MorPhiC Consortium as an affiliate
          member
        </b>
      </p>
      <p>
        An investigator who is interested in applying for affiliate membership
        to the MorPhiC Consortium should fill out the application form and
        submit it via their Institutional Signing Official to MorPhiC NHGRI
        Program Staff (Adam Felsenfeld, Ajay Pillai and Colin Fletcher). The
        application will be reviewed by NHGRI staff to determine whether an
        investigator will be accepted into the Consortium. NHGRI staff will take
        recommendations to the Steering Committee for approval. Once accepted,
        affiliate members must sign the MorPhiC Data Use Agreement (DUA).
        Participation of members in Consortium activities may be reviewed yearly
        by NHGRI staff to ensure active participation. At any time, an
        affiliated member may ask to leave the Consortium, but is expected to
        honor the confidentiality of any information obtained during Consortium
        membership as appropriate through standard research collaboration
        practices.
      </p>

      <p>Affiliate Members please note: </p>
      <ul>
        <li>
          Follow MorPhiC policies including tracking MorPhiC related
          publications.{" "}
        </li>
        <li>
          If you intend to use pre-published data we are requesting a
          description of your proposed activities. This will help us respect
          MorPhiC graduate students, postdocs and other scientists who might be
          working on similar goals. If there is a potential for such conflicts
          we can resolve these by converting it potentially into a collaborative
          activity.{" "}
        </li>
        <li>
          If you propose to work on additional projects please submit a separate
          description for the MorPhiC Steering Committee’s consideration. We
          might request a brief yearly update on the project at a convenient
          forum.
        </li>
        <li>
          The MorPhiC Data Use Agreement you (and your institution sign) gives
          you access to pre-publication data for the purposes described below.
        </li>
      </ul>

      <p>
        Affiliate membership does not directly or indirectly imply a commitment
        to funding by the NIH.
      </p>

      <p>Please fill out each section below:</p>

      <table>
        <tr>
          <td>Name</td>
          <td colSpan={2}></td>
        </tr>

        <tr>
          <td>Institutional Affiliation</td>
          <td colSpan={2}></td>
        </tr>

        <tr>
          <td>Date</td>
          <td colSpan={2}></td>
        </tr>

        <tr>
          <td>
            Personnel (who will be part of the agreement, their Names, Titles,
            Institutional Affiliation and Email—one per row)
          </td>
          <td colSpan={2}></td>
        </tr>

        <tr>
          <td>Are you requesting access to Morphic pre-public release data?</td>
          <td colSpan={2}></td>
        </tr>
      </table>

      <p>
        Provide a concise description of the planned contribution (proposed
        experimental and/or analysis plans), specifying the focus of the project
        as: a) experimental, b) computational analysis, or c) a combination of
        these.
        <br></br>Response (no more than 2 pages)
      </p>

      <p>
        Indicate how the proposed work will contribute to the goals of the
        MorPhiC Consortium and is aligned with MorPhiC activities
        <br></br>Response (no more than half a page):
      </p>

      <p>
        Provide evidence of funding to conduct the proposed research (grant # or
        equivalent)
        <br></br>Response:
      </p>

      <p>
        Indicate agreement to abide by all current (and as agreed to, future
        policies) MorPhiC policies and not disclose confidential information
        obtained from members of the Consortium and those fully participating in
        MorPhiC Consortium activities.
        <br></br>Response:
      </p>

      <p>PI Signature: _________</p>
      <p>PI Name:</p>
      <p>PI Affiliation:</p>
    </Policies>
  );
}

export function Head() {
  return (
    <>
      <title>MorPhiC program: Molecular Phenotypes of Null Alleles in Cells</title>
      <link id="icon" rel="icon" href="favicon.svg" />
    </>
  )
}