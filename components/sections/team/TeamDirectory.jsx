'use client';

import { useMemo, useState } from 'react';
import SegmentedControl from '@/components/ui/SegmentedControl';
import DoctorCard from '@/components/cards/DoctorCard';

/**
 * /team: every dentist as a portrait card. Once the team grows past six, a
 * filter by role appears automatically — nothing to configure.
 */
export default function TeamDirectory({ doctors = [], labels = {} }) {
  const all = labels.all || 'All';
  const roles = useMemo(() => [all, ...Array.from(new Set(doctors.map((d) => d.role).filter(Boolean)))], [doctors, all]);
  const [filter, setFilter] = useState(all);
  const visible = filter === all ? doctors : doctors.filter((d) => d.role === filter);
  const showFilter = doctors.length > 6 && roles.length > 2;

  return (
    <>
      {showFilter ? (
        <div className="mb-10 flex justify-center">
          <SegmentedControl label={labels.filter} value={filter} onChange={setFilter} items={roles.map((r) => ({ value: r, label: r }))} />
        </div>
      ) : null}
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((doctor) => (
          <li key={doctor.href}>
            <DoctorCard doctor={doctor} href={doctor.href} labels={labels} />
          </li>
        ))}
      </ul>
    </>
  );
}
