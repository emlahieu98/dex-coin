import React from 'react';
import { useSelector } from 'react-redux';
import * as Store from '../styles';
import Item from './Item';
import { selectStores } from '../slice/selectors';

export default function StoreListing() {
  const stores = useSelector(selectStores);

  return (
    <Store.List>
      {stores.map(store => (
        <Item store={store} key={store.id} />
      ))}
    </Store.List>
  );
}
