import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { D } from '../../components/admin/theme';
import { Badge, BtnPrimary, EmptyState, TableHead, FilterTabs, SearchBar } from '../../components/admin/ui';

const COL = '1fr 1fr 1fr 1fr 110px 100px';

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const bookings = []; // will be fetched once the trip API is available

  const filtered = bookings.filter((b) =>
    b.pickupAddress?.toLowerCase().includes(search.toLowerCase()) ||
    b.dropoffAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px', fontFamily: D.font }}>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <FilterTabs
          options={[
            ['all', 'All (0)'],
            ['REQUESTED', 'Requested (0)'],
            ['ACCEPTED', 'Accepted (0)'],
            ['IN_PROGRESS', 'En Route (0)'],
            ['COMPLETED', 'Completed (0)'],
          ]}
          value={filter} onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…" />
        <div style={{ marginLeft: 'auto' }}>
          <BtnPrimary disabled title="Booking creation is coming soon">+ New Booking</BtnPrimary>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: D.ivory, borderRadius: 10, border: `1px solid ${D.rule}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}><div style={{ minWidth: 720 }}>
          <TableHead cols={['Pickup', 'Dropoff', 'Member', 'Driver', 'Status', 'Fare']} template={COL} />
          {filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={32} color={D.mute} />}
              title="No bookings yet"
              desc="Trip booking management will appear here once the booking module is connected."
            />
          ) : filtered.map((b) => (
            <div key={b.id} className="d-row" style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '13px 20px', borderTop: `1px solid ${D.rule}`, alignItems: 'center', background: D.ivory }}>
              <div style={{ fontSize: 13, color: D.ink }}>{b.pickupAddress}</div>
              <div style={{ fontSize: 13, color: D.slate }}>{b.dropoffAddress}</div>
              <div style={{ fontSize: 13, color: D.slate }}>{b.member?.names || '—'}</div>
              <div style={{ fontSize: 13, color: D.slate }}>{b.driver?.names || 'Unassigned'}</div>
              <div><Badge status={b.status} /></div>
              <div style={{ fontSize: 13, color: D.ink }}>{b.fare ? `$${b.fare.toFixed(2)}` : '—'}</div>
            </div>
          ))}
        </div></div>
      </div>
    </div>
  );
}
