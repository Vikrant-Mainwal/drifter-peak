'use client';

import { useEffect, useState } from 'react';
import type { AddressInsert } from './types';
import { useIsDesktop } from './lib/useMediaQuery';
import { useAddressStore } from './lib/store/addressStore';
import { AddNewAddressDesktop } from './components/AddNewAddressDesktop';
import { AddNewAddressMobile } from './components/AddNewAddressMobile';
import { SavedAddressListDesktop } from './components/SavedAddressListDesktop';
import { SavedAddressListMobile } from './components/SavedAddressListMobile';

type View = 'list' | 'form';

interface AddressManagerProps {
  // user_id: string;
  onClose: () => void;
  /** Skip the list and open straight into the form (e.g. from an empty cart state). */
  initialView?: View;
}

export function AddressManager({  onClose, initialView = 'list' }: AddressManagerProps) {
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<View>(initialView);

  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);
  const createAddress = useAddressStore((s) => s.createAddress);
  const selectAddress = useAddressStore((s) => s.selectAddress);

  useEffect(() => {
    fetchAddresses();
  }, [ fetchAddresses]);

  const handleCreate = async (values: AddressInsert) => {
    await createAddress( values);
    setView('list');
  };

  if (view === 'form') {
    return isDesktop ? (
      <AddNewAddressDesktop onClose={onClose} onSubmit={handleCreate} />
    ) : (
      <AddNewAddressMobile onBack={() => setView('list')} onSubmit={handleCreate} />
    );
  }

  const listProps = {
    addresses,
    selectedId,
    onSelect: selectAddress,
    onAddNew: () => setView('form'),
    onClose,
  };

  return isDesktop ? (
    <SavedAddressListDesktop {...listProps} />
  ) : (
    <SavedAddressListMobile {...listProps} />
  );
}
