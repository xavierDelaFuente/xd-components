import { screen } from '@testing-library/react';

// A native <video> has no ARIA role mapping and no implicit accessible name,
// so getByRole/getByLabelText don't apply — a data-testid (which the component
// sets to "video" by default, like Layout/Grid/Table) is the query of record.
export function getVideo(testId: string | RegExp = 'video'): HTMLVideoElement {
  return screen.getByTestId(testId) as HTMLVideoElement;
}
