/**
 * Compatibility exports for legacy GovAU React components.
 *
 * This module re-exports components under the same names and prop
 * signatures expected by existing consumers. Initially it forwards
 * to the existing @truecms component packages so that React apps
 * can migrate by updating import paths only.
 */

export { default as AUbutton } from '@truecms/buttons';
export { default as AUaccordion } from '@truecms/accordion';
export { default as AUheader, AUheaderBrand } from '@truecms/header';
