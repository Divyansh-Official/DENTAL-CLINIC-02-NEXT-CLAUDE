'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';

/**
 * iOS UISegmentedControl. The selected pill is one element that slides
 * between segments on a spring rather than fading in place.
 *
 *   mode 'tabs'    a real tablist: arrow keys, Home and End move focus *and*
 *                  selection together, as the ARIA tabs pattern requires.
 *   mode 'filter'  a group of toggle buttons (aria-pressed).
 *
 * Before JavaScript measures the segments, the selected segment paints its
 * own background (see .segmented in globals.css), so there is no jump.
 */
export default function SegmentedControl({ items = [], value, onChange, mode = 'filter', label, idPrefix = 'seg', className = '' }) {
  const trackRef = useRef(null);
  const [pill, setPill] = useState(null);
  const [fade, setFade] = useState('');
  const tabs = mode === 'tabs';

  /* When the segments overflow (a phone, many categories), fade whichever
     edge has more to scroll to, so the hidden segments read as "more". */
  const updateFade = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setFade(max <= 1 ? '' : `${track.scrollLeft > 1 ? 's' : ''}${track.scrollLeft < max - 1 ? 'e' : ''}`);
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector('[data-active="true"]');
    if (!active) return;
    setPill({ x: active.offsetLeft, w: active.offsetWidth });
    updateFade();
  }, [updateFade]);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure, value]);

  /* Keep the selected segment visible when the track scrolls on a phone. */
  useEffect(() => {
    const track = trackRef.current;
    const active = track?.querySelector('[data-active="true"]');
    if (!track || !active || track.scrollWidth <= track.clientWidth) return;
    const left = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }, [value]);

  const onKeyDown = (event) => {
    if (!tabs) return;
    const index = items.findIndex((item) => item.value === value);
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next == null) return;
    event.preventDefault();
    onChange(items[next].value);
    trackRef.current?.querySelector(`[data-index="${next}"]`)?.focus();
  };

  return (
    <div
      ref={trackRef}
      role={tabs ? 'tablist' : 'group'}
      aria-label={label}
      onKeyDown={onKeyDown}
      onScroll={updateFade}
      className={`segmented ${className}`}
      data-ready={pill ? '' : undefined}
      data-fade={fade || undefined}
      style={pill ? { '--x': `${pill.x}px`, '--w': `${pill.w}px` } : undefined}
    >
      <span className="segmented-pill sheen" aria-hidden="true" />
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            data-index={index}
            data-active={selected ? 'true' : 'false'}
            className="segmented-btn"
            onClick={() => onChange(item.value)}
            {...(tabs
              ? {
                  role: 'tab',
                  id: `${idPrefix}-tab-${item.value}`,
                  'aria-selected': selected,
                  'aria-controls': `${idPrefix}-panel`,
                  tabIndex: selected ? 0 : -1
                }
              : { 'aria-pressed': selected })}
          >
            {item.icon ? <Icon name={item.icon} size={16} /> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
