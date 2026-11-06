// The site is also served through Purdue's CS homepage proxy at
// www.cs.purdue.edu/homes/varkey/, which forwards everything under that prefix
// to this deployment. Routes and same-origin API calls need the prefix there so
// they stay inside the proxied path.
const PURDUE_PREFIX = '/homes/varkey'

export const BASENAME =
  typeof location !== 'undefined' && location.pathname.startsWith(PURDUE_PREFIX)
    ? PURDUE_PREFIX
    : ''
