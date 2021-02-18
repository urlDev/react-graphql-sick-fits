import gql from 'graphql-tag';
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    // this is to tell apollo that we will take care
    // of everything
    keyArgs: false,
    // apollo first will get the read function
    // existing is existing items
    // args is first and skip values
    // cache is apollo cache values
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      // ++++++++++++++
      // getting pagination query to read data from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      // Using new chaining method to check if those properties exist
      const count = data?._allProductsMeta?.count;
      // Finding the page
      const page = skip / first + 1;
      // Amount of total pages with rounding to higher number
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      // ++++++++++++

      // Since we want 2 items per page, we start at 2(skip) and finish at 4(skip + first)
      // Filter method will filter out the undefined ones
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If
      // There are items
      // AND there arent enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we dont have any items so we should fetch them
        return false;
      }

      // If there are items just return them from the cache
      // and we dont need to go to network
      if (items.length) {
        return items;
      }

      return false; // Fallback to network
    },
    // This runs when the Apollo client comes back from
    // the network with our product
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        // adding incoming to the merged
        merged[i] = incoming[i - skip];
      }

      // finally we return the merged items from the cache
      return merged;
    },
  };
}
