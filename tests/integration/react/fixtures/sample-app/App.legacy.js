// Representative React application fixture using legacy GovAU/Pancake
// component imports. This is a planning-level sample and is not wired
// into any build tooling yet – it documents the kind of imports the
// unified package must be compatible with.

/* eslint-disable no-unused-vars */
import React from 'react';

import AUheader, { AUheaderBrand } from '@truecms/header';
import AUbutton from '@truecms/buttons';
import AUaccordion from '@truecms/accordion';

export const LegacySampleApp = () => (
  <div className="govau-react-fixture">
    <AUheader>
      <AUheaderBrand title="GovAU" />
    </AUheader>

    <main id="content">
      <AUbutton as="primary">
        Primary action
      </AUbutton>

      <AUaccordion header="Accordion heading">
        <p>Accordion body content for migration validation.</p>
      </AUaccordion>
    </main>
  </div>
);

export default LegacySampleApp;

