import React from "react";
import Policies from "../../components/policies";

export default function CodeOfConduct() {
  return (
    <Policies>
      <h1>Morphic Code of Conduct for Events</h1>
      <p>Draft provided to SC - May 3, 2023; FINAL approval by SC on……</p>
      <p>
        Primary Authors: Mazhar Adli (Adapted from HuBMAP code of conduct
        policy)
      </p>
      <p>
        MorPhic is dedicated to maintaining an inclusive, safe, and respectful
        environment for everyone attending or participating in events such as
        annual meetings, demo days, webinars, and other events. We do not
        tolerate harassment of people in any form, and we empower all
        participants in our community to actively engage in creating a friendly
        and safe environment for all.
      </p>
      <p>
        Furthermore, MorPhic recognizes that a diversity of perspectives is not
        only beneficial but critical to doing the best scientific work and aims
        to provide an atmosphere conducive to the open exchange of ideas and
        collaboration. As stated in{" "}
        <a
          href="https://grants.nih.gov/grants/guide/notice-files/NOTOD21053.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://grants.nih.gov/grants/guide/notice-files/NOTOD21053.html
        </a>
        , NIH's ability to ensure that the nation remains a global leader in
        scientific discovery and innovation is dependent upon a pool of highly
        talented scientists from diverse backgrounds who will help to further
        the NIH's mission. Supporting a diverse scientific workforce fosters
        creativity and innovation, helps to ensure that different perspectives
        are considered when addressing complex scientific problems, and
        ultimately improves the quality of research
      </p>

      <h2>Expectations of Behavior</h2>
      <p>
        Our world is rich in diversity, and MorPhic embraces those differences,
        including in ability, age, color, ethnicity, race, family or marital
        status, sex, gender identity and expression, sexual orientation,
        pregnancy and related medical conditions, language, national origin,
        political affiliation, religion, socioeconomic status, veteran status,
        health status, and other dimensions of diversity.
      </p>
      <p>
        As an attendee, presenter, researcher, sponsor, or guest at all Morphic
        meetings, events or programs organized by MorPhic, I will:
      </p>
      <ul>
        <li>
          Embrace MorPhic's diverse community of professionals, and be inclusive
          of all audiences in my presentations, demonstrations, and
          conversations.
        </li>
        <li>
          Exercise consideration and respect toward all persons in my speech and
          actions
        </li>
        <li>
          Encourage and contribute to productive scientific discourse. Refrain
          from demeaning, discriminatory, or harassing behavior, speech, and
          imagery.
        </li>
        <li>
          Seek advice from MorPhic personnel if I do not know how to fulfill
          these responsibilities.
        </li>
      </ul>
      <p>
        Examples of inappropriate behavior include but are not restricted to:
      </p>
      <ul>
        <li>
          Disrupting the meeting or engaging in harm or threats of harm of any
          kind, including implied threats of physical, professional, or
          financial harm.
        </li>
        <li>
          Creating or contributing to a safety threat or unsafe or exclusionary
          situation. This includes deliberately engaging in intimidation,
          micro-aggression, stalking, or following.
        </li>
        <li>
          Making harmful or prejudicial verbal or written comments or using
          visual images related to gender, gender identity and expression, age,
          sexual orientation, disability, physical appearance, body size,
          personal characteristics, political ideology/identity, race,
          ethnicity, or religion (or lack thereof). Using inappropriate nudity
          and/or sexual images (including presentations, slides, or video
          chats).
        </li>
        <li>
          Retaliating against an individual for reporting discrimination or
          harassment, or intentionally filing a false report of discrimination
          or harassment.
        </li>
        <li>
          Making audio or visual recordings of the meeting in any medium or
          distributing audio or visual recordings of the meeting (via social
          media or any other means), with the exception of recordings made by
          event organizers. Screen shots and photographs of presentation slides
          are fine for personal use within the consortium, but are not for
          distribution outside the consortium.
        </li>
      </ul>

      <h2>Reporting</h2>
      <p>
        This Code of Conduct is in place to protect the safety of all
        participants. Contact, language, or imagery of a violent, threatening,
        sexual, discriminatory, demeaning, or disruptive nature is not
        appropriate during either in-person or online conferences,
        presentations, and events. If you witness any misconduct of this code,
        please report it to any Morphic program project PIs and the conference
        chair and organizing committee or in-person through the conference
        facility, including at the registration desk.
      </p>
      <p>Criminal activity should be reported to the police.</p>
      <p>
        Attendees or project participants asked to stop any harassing or
        discriminatory behavior are expected to comply immediately. Morphic
        leadership, at their sole discretion, may take action to redress
        behavior that is disruptive or that is making the environment unsafe for
        participants. This may include asking individuals to leave the event at
        their own expense and without a refund of any fees paid.
      </p>

      <h2>Resources:</h2>
      <p>
        NIH Policy:{" "}
        <a
          href="https://grants.nih.gov/grants/guide/notice-files/NOT-OD-21-053.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://grants.nih.gov/grants/guide/notice-files/NOT-OD-21-053.html
        </a>
      </p>
      <p>
        ASTC Code of Conduct:{" "}
        <a
          href="https://www.astc.org/membership/code-of-conduct/#:~:text=Conduct%20myself%20with%20integrity%2C%20respect,organization%2C%20ASTC%2C%20or%20myself"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.astc.org/membership/code-of-conduct/#:~:text=Conduct%20myself%20with%20integrity%2C%20respect,organization%2C%20ASTC%2C%20or%20myself
        </a>
        .
      </p>
      <p>
        Experimental Biology Code of Conduct:{" "}
        <a
          href="https://www.experimentalbiology.org/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.experimentalbiology.org/code-of-conduct
        </a>
      </p>
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