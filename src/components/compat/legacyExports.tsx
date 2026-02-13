/**
 * Compatibility exports for legacy GovAU React components.
 *
 * This module re-exports components under the same names and prop
 * signatures expected by existing consumers. Initially it forwards
 * to the existing @truecms component packages so that React apps
 * can migrate by updating import paths only.
 */

import AUbutton from '@truecms/buttons';
import AUaccordion from '@truecms/accordion';
import AUheader, { AUheaderBrand } from '@truecms/header';

export {
  AUbutton,
  AUaccordion,
  AUheader,
  AUheaderBrand,
};
