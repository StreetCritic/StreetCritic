import { Container, Title, Text } from "@/components";
import { Link } from "react-router-dom";
import useMeta from "@/hooks/useMeta";

export default function TermsOfUse() {
  useMeta({ title: "Terms of Use" });
  return (
    <main>
      <Container>
        <Title order={1}>StreetCritic Services Terms of Use</Title>

        <Title order={2}>I. Introduction</Title>

        <Text>
          Thank you for using StreetCritic. These terms cover your use of
          services officially operated and provided by StreetCritic. In
          particular these are:
        </Text>

        <ul>
          <li>
            the StreetCritic.org website and associated services and APIs,
          </li>
          <li>the StreetCritic data distribution,</li>
        </ul>

        <Text>(together, the “Services”).</Text>

        <Text>
          By using these Services, you agree to be bound by the following Terms
          of Service, as updated from time to time (collectively, the "Terms"').
          Please read them carefully. If you don’t agree to these Terms, you may
          not use the Services.
        </Text>

        <Text>Please be aware of the following:</Text>

        <ol>
          <li>
            <strong>StreetCritic as host:</strong> StreetCritic.org is a
            collaborative project. StreeCritic and volunteers operate the
            infrastructure and websites (many of which are collaborative Open
            Source projects), but the map data are contributed by users.
            StreetCritic does not and cannot proactively review all edits or
            other contributions. Therefore, we do not represent or guarantee the
            truthfulness, accuracy, or reliability of any submitted community
            content. Suspected data problems may be reported to StreetCritic.
          </li>
          <li>
            <strong>You are responsible for your own actions:</strong> You are
            legally responsible for your edits and contributions, so for your
            own protection you should exercise caution and avoid contributing
            any content that may result in criminal or civil liability under any
            applicable laws. Although we may not agree with such actions, we
            warn editors and contributors that authorities may seek to apply
            other countries’ laws to you, including local laws where you live or
            where you view or edit content. OSMF generally cannot offer any
            protection, guarantee, immunity or indemnification.
          </li>
        </ol>

        <Text>
          StreetCritic data available through these Services is licensed under
          the{" "}
          <a
            href="https://opendatacommons.org/licenses/odbl/1-0/"
            target="_blank"
          >
            Open Database License
          </a>
          . Contributions to StreetCritic are governed by the{" "}
          <Link to={"/contributor-terms"}>StreetCritic Contributor Terms</Link>.
        </Text>

        <Text>
          Though we hope StreetCritic and its supporting projects will continue
          for the foreseeable future, we reserve the right to suspend or end the
          Services at any time, with or without cause, and with or without
          notice.
        </Text>

        <Title order={2}>II. Privacy</Title>

        <Text>
          We ask that you review the terms of our{" "}
          <Link to={"/privacy-policy"}>Privacy Policy</Link>, so that you are
          aware of how we collect and use your information. Certain aspects of
          the Services require you to have an StreetCritic account and to be
          logged into that account while you access those aspects.
        </Text>

        <Text>
          Because our Services are used by people all over the world, personal
          information that we collect may be stored and processed in any other
          country in which we or our agents maintain facilities. If you are a
          resident of the EU, EEA, or EFTA, your information will be stored and
          processed in accordance with the GDPR. If you are a resident of
          another country, you consent to any such transfer of information
          outside your country by using our Services.
        </Text>

        <Text>
          You agree to keep the contact information associated with your
          StreetCritic account current and complete. Your contact information
          will be used in accordance with the Privacy Policy.
        </Text>

        <Title order={3}>Use by minors</Title>

        <Text>You must be 13 years or older to use the Services.</Text>

        <Text>
          If you are at least 13 but under 16 years of age, a parent or other
          adult authorized by your parent may create an account for you to use.
          The account must not contain any personal data about you, and you must
          not add any personal data about yourself. For example, your parent may
          create an account using your parent’s email address and a username
          that is not associated with you, which your parent may permit you to
          use to contribute map edits. For your protection, you are not allowed
          to use the social aspects of the Services, but you may contribute
          edits to the map. You should not reveal any personal data in any
          communications you have regarding your map edits.
        </Text>

        <Text>
          By registering as a user or providing personal information on the
          Services, you represent that you are at least 16 years old.
        </Text>

        <Title order={2}>III. Unlawful and other unauthorized uses</Title>

        <Text>
          You are solely responsible for your compliance with all applicable
          laws, regulations, and third party agreements in your use of the
          Services. You represent you are not, and are not controlled by, an
          individual, organization or entity organized or located in a country
          or territory that is the target of sanctions imposed, or on any
          restricted or sanctioned party list maintained by the European Union
          or the Federal Republic of Germany.
        </Text>

        <Text>
          You may not use the Services in any manner that could damage or
          overburden the Services or interfere with any other party's use of the
          Services. You agree to abide by StreetCritics’s Usage Policies and
          other policies posted on the StreetCritic website in conjunction with
          the Services, including accompanying documentation. Those policies are
          incorporated by reference into these Terms.
        </Text>

        <Text>You may not use the Services to:</Text>

        <ul>
          <li>
            Disseminate or store material that infringes the copyright,
            trademark, patent, trade secret, or other intellectual property
            right of any person;
          </li>
          <li>
            Impersonate any person, create a false identity (a pseudonym does
            not count as a false identity) or otherwise attempt to mislead
            others as to the identity or origin of any communication, or engage
            in fraud;
          </li>
          <li>
            Interfere with or attempt to gain unauthorized access to any
            computer network;
          </li>
          <li>
            Host with, transmit to or provide to us any information that is
            subject to specific European Union or Federal Republic of Germany
            government regulation, including, without limitation, personal data
            revealing racial or ethnic origin, political opinions, religious or
            philosophical beliefs, or trade union membership, or genetic data,
            biometric data for the purpose of uniquely identifying a natural
            person, data concerning health, data concerning a natural person’s
            sex life or sexual orientation (other than personal data about
            yourself that you contribute to your user page or diary posts, which
            is completely voluntary on your part and you can delete at any
            time), or data relating to criminal convictions and offences or
            related security measures, and information subject to export control
            or economic sanction laws;
          </li>
          <li>
            Operate dangerous businesses such as emergency services or air
            traffic control, where the use or failure of the Services could lead
            to death, personal injury or significant property damage;
          </li>
          <li>
            Transmit viruses, trojan horses, or any other malicious code or
            program;
          </li>
          <li>Engage in any form of unsolicited advertising;</li>
          <li>
            Recreate or proxy any part of the Services in order to evade these
            Terms (including aiding anyone else in doing so);
          </li>
          <li>
            Store data available through the Services in order to evade these
            Terms (including aiding anyone else in doing so); or
          </li>
          <li>
            Engage in any other activity reasonably deemed by StreetCritic to be
            in conflict with the spirit or intent of these Terms.
          </li>
        </ul>

        <Title order={3}>Additional limitations on use of personal data:</Title>

        <Text>
          Through your StreetCritic account, you may have access to some
          personal data from other StreetCritic contributors. You may not use,
          store, or process any personal data available through the Services for
          any purpose other than:
        </Text>

        <ul>
          <li>
            If you are a natural person, in the course of a purely personal or
            household activity
          </li>
          <li>
            As necessary for compliance with a legal obligation to which you are
            subject;
          </li>
          <li>
            As necessary for the performance of a task carried out in the public
            interest
          </li>
          <li>
            As necessary for the purposes of the legitimate interests pursued by
            you or by a third party, except where such interests are overridden
            by the interests or fundamental rights and freedoms of the data
            subject which require protection of personal data, in particular
            where the data subject is a child.
          </li>
          <li>
            Any other purpose authorised by the{" "}
            <a href="https://gdpr-info.eu/" target="_blank">
              General Data Privacy Regulation
            </a>
            .
          </li>
        </ul>

        <Text>
          For the avoidance of doubt, you may not use personal data available
          through the Services to:
        </Text>

        <ul>
          <li>Attempt to re-identify any natural person</li>
          <li>Attempt to stalk or harass any natural person</li>
          <li>
            Gather or collect email addresses, real names, home addresses or
            phone numbers without express consent
          </li>
          <li>
            Seek personal data from any minor without the express consent of
            their parent or legal guardian
          </li>
        </ul>

        <Text>
          To fulfill the goal of distributing data that is truly open,
          untethered by rights of third parties and of high quality, we do not
          support anonymous contributions and retain additional, non-geographic,
          data on a legitimate interest base (see{" "}
          <a href="https://gdpr-info.eu/art-6-gdpr/" target="_blank">
            GDPR article 6.1f
          </a>
          ). Common legitimate interests for which StreetCritic and StreetCritic
          data users often process personal data include map editing and data
          integrity efforts that involve:
        </Text>

        <ul>
          <li>identifying all the contributions made by an account,</li>
          <li>
            contacting the contributor in the case of questions in respect to
            the nature and source of the contributions,
          </li>
          <li>
            detection, removal and correction of spam accounts, vandalism and
            violations of the rights of third parties,
          </li>
          <li>facilitating communication between StreetCritic contributors.</li>
          <li>
            research and analysis on aggregate contributions to improve or
            prioritise StreetCritic services, such as evaluating mapping
            *efficacy, map completeness, determining if locations or mappers are
            disproportionately represented.
          </li>
        </ul>

        <Text>
          Please see StreetCritics’s{" "}
          <Link to={"/privacy-policy"}>Privacy Policy</Link> for more
          information.
        </Text>

        <Title order={2}>IV. Use by an entity</Title>

        <Text>
          If you are entering into this agreement on behalf of your company or
          another legal entity, you represent that you have the authority to
          bind that entity to these Terms, in which case "you" will mean the
          entity you represent.
        </Text>

        <Title order={2}>V. End users and notification</Title>

        <Text>
          You may not permit your end users or other third parties to use the
          Services in any way that would be a violation of these Terms if done
          by you, and you agree to take reasonable efforts to prevent such use.
          You agree to promptly notify StreetCritic in writing if you become
          aware of any misappropriation or unauthorized use of the Services.
        </Text>

        <Title order={2}>VI. Account cancellation or suspension</Title>

        <Text>You are free to stop using the Services any time.</Text>

        <Text>
          In addition, we may cancel or suspend your account for violation of
          any policy. Upon cancellation or suspension, your right to use the
          Services will stop immediately. Attempting to evade a cancellation or
          suspension (such as by creating a new account or using an alternate
          account) is a violation of these Terms.
        </Text>

        <Text>
          You may not have access to data that you stored on the Services after
          we cancel or suspend your account. You are responsible for backing up
          data that you use with the Services.
        </Text>

        <Text>
          If your account or access is blocked or otherwise terminated for any
          reason, your public contributions will remain publicly available
          (subject to applicable policies), and, unless we notify you otherwise,
          you may still access our public pages for the sole purpose of reading
          publicly available content. In such circumstances, however, you may
          not be able to access your account or settings.
        </Text>

        <Text>
          Even after your use and participation are banned, blocked or otherwise
          suspended, these Terms of Use will remain in effect with respect to
          relevant provisions, including Sections I-X.
        </Text>

        <Title order={2}>VII. Additional terms</Title>

        <Text>
          You agree that we may freely exploit and make available any and all
          feedback, suggestions, ideas, enhancement requests, recommendations or
          other information you provide relating to the Services.
        </Text>

        <Text>
          If any provision of these Terms is held to be unlawful, void, or for
          any reason unenforceable, then that provision shall be deemed
          severable from these Terms and shall not affect the validity and
          enforceability of any remaining provisions. Headings are for
          convenience only and have no legal or contractual effect.
        </Text>

        <Text>
          You agree that no joint venture, partnership, employment, or agency
          relationship exists between you and StreetCritic as a result of these
          Terms or your use of the Services. You further acknowledge no
          confidential, fiduciary, contractually implied, or other relationship
          is created between you and StreetCritic other than pursuant to these
          Terms.
        </Text>

        <Title order={2}>VIII. Disputes and jurisdiction</Title>

        <Text>Highlighted for emphasis</Text>

        <Text>
          <strong>
            We hope that no serious disagreements arise involving you, but, in
            the event there is a dispute, we encourage you to seek resolution
            through the dispute resolution procedures or mechanisms provided by
            the Services.
          </strong>
        </Text>

        <Text>
          <strong>
            If you seek to file a legal claim against us, you agree to file and
            resolve it exclusively in a court located in Frankfurt am Main,
            Federal Republic of Germany. You also agree that German law will
            govern these Terms, as well as any legal claim that might arise
            between you and us (without reference to conflict of laws
            principles). You agree to submit to the personal jurisdiction of,
            and agree that venue is proper in, the courts located in Frankfurt
            am Main, Federal Republic of Germany, in any legal action or
            proceeding relating to us or these Terms.
          </strong>
        </Text>

        <Text>
          <strong>
            To ensure that disputes are dealt with soon after they arise, you
            agree that regardless of any statute or law to the contrary, any
            claim or cause of action you might have arising out of or related to
            use of our Services or these Terms must be filed within the
            applicable statute of limitations or, if earlier, one (1) year after
            the pertinent facts underlying such claim or cause of action could
            have been discovered with reasonable diligence (or be forever
            barred).
          </strong>
        </Text>

        <Title order={2}>IX. Disclaimers</Title>

        <Text>Highlighted for emphasis</Text>

        <Text>
          <strong>
            Your use of the Services is at your sole risk. We provide the
            Services on an "as is" and "as available" basis, and we expressly
            disclaim all express or implied warranties of all kinds, including
            but not limited to the implied warranties of merchantability,
            fitness for a particular purpose, and non-infringement. We make no
            warranty that our Services will meet your requirements, be safe,
            secure, uninterrupted, timely, accurate, or error-free, or that your
            information will be secure.
          </strong>
        </Text>

        <Text>
          <strong>
            We are not responsible for the content, data, or actions of third
            parties, and you release us, our directors, officers, employees, and
            agents from any claims and damages, known and unknown, arising out
            of or in any way connected with any claim you have against any such
            third parties. No advice or information, whether oral or written,
            obtained by you from us or through or from our Services creates any
            warranty not expressly stated in these Terms.
          </strong>
        </Text>

        <Text>
          <strong>
            Any material downloaded or otherwise obtained through your use of
            our Services is done at your own discretion and risk, and you will
            be solely responsible for any damage to your computer system or loss
            of data that results from the download of any such material. You
            agree that we have no responsibility or liability for the deletion
            of, or the failure to store or to transmit, any content or
            communication maintained by the service. We retain the right to
            create limits on use and storage at our sole discretion at any time
            with or without notice.
          </strong>
        </Text>

        <Text>
          <strong>
            We may add, change, replace, remove, or discontinue the features and
            functions of the Services, including APIs. It is your responsibility
            to ensure that calls or requests you make to the Services are
            compatible with then-current APIs and authentication methods, and
            that you handle responses properly.
          </strong>
        </Text>

        <Text>
          <strong>
            Some states or jurisdictions do not allow the types of disclaimers
            in this section, so they may not apply to you either in part or in
            full depending on the law.
          </strong>
        </Text>

        <Title order={2}>X. Limitation on liability</Title>

        <Text>Highlighted for emphasis</Text>

        <Text>
          <strong>
            StreetCritic will not be liable to you or to any other party for any
            direct, indirect, incidental, special, consequential or exemplary
            damages, including but not limited to, damages for loss of profits,
            goodwill, use, data, or other intangible losses, regardless of
            whether we were advised of the possibility of such damage. In no
            event shall our liability exceed one thousand EUR (EUR 1000.00) in
            aggregate. In the case that applicable law may not allow the
            limitation or exclusion of liability or incidental or consequential
            damages, the above limitation or exclusion may not apply to you,
            although our liability will be limited to the fullest extent
            permitted by applicable law.
          </strong>
        </Text>

        <Title order={2}>XI. Changes to Services or Terms</Title>

        <Text>
          We may modify these Terms and other terms related to your use of the
          Services (like our Privacy Policy) from time to time, by posting the
          changed terms on the StreetCritic. All changes will be effective
          immediately upon posting to the StreetCritic website unless they
          specify a later date. Changes will not apply retroactively. Please
          check these Terms periodically for changes -- your continued use of
          the Services after new Terms become effective constitutes your binding
          acceptance of the new Terms.
        </Text>

        <Text>
          The text of these terms is adapted from the{" "}
          <a href="https://osmfoundation.org/wiki/Terms_of_Use" target="_blank">
            OpenStreetMap Foundation Terms of Use
          </a>{" "}
          (which is based on the{" "}
          <a
            href="https://wikimediafoundation.org/wiki/Terms_of_Use/en"
            target="_blank"
          >
            Wikimedia Foundation Terms of Use
          </a>
          ) and available under a{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
          >
            Creative Commons Attribution-ShareAlike License.
          </a>
        </Text>
      </Container>
    </main>
  );
}
