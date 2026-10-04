/**
 * The refraction filter — one definition shared by every refracting surface,
 * so they are provably the same material (ported from QuickLocal's
 * GlassFilter). Three displacement taps at slightly different scales give the
 * chromatic fringe; the map's blue channel carries the Fresnel rim.
 */
import { FILTER_UNITS, LENS_BLEED } from '@/lib/glass/liquidGlass';

export default function GlassFilter({ id, map, width, height, dispersion = 1, saturation = 1.25, blur = 1.6 }) {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      /* Not display:none — a filter in a hidden subtree is skipped by the compositor. */
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id={id}
          filterUnits={FILTER_UNITS}
          primitiveUnits={FILTER_UNITS}
          x={-LENS_BLEED}
          y={-LENS_BLEED}
          width={width + 2 * LENS_BLEED}
          height={height + 2 * LENS_BLEED}
          colorInterpolationFilters="sRGB"
        >
          {/* Neutral grey wherever the map does not reach, so nothing is thrown sideways. */}
          <feFlood floodColor="rgb(128,128,0)" floodOpacity="1" result="neutral" />
          <feImage
            href={map.url}
            xlinkHref={map.url}
            x={0}
            y={0}
            width={width}
            height={height}
            preserveAspectRatio="none"
            result="mapImg"
          />
          <feComposite in="mapImg" in2="neutral" operator="over" result="map" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dR"
            data-chroma={1 - dispersion * 0.12}
            scale={map.scale * (1 - dispersion * 0.12)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dG"
            data-chroma={1}
            scale={map.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dB"
            data-chroma={1 + dispersion * 0.12}
            scale={map.scale * (1 + dispersion * 0.12)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix in="dR" type="matrix" result="cR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feColorMatrix in="dG" type="matrix" result="cG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feColorMatrix in="dB" type="matrix" result="cB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" result="refracted" />

          <feColorMatrix in="refracted" type="saturate" values={String(saturation)} result="vibrant" />
          <feGaussianBlur in="vibrant" stdDeviation={blur} result="soft" />

          <feColorMatrix in="map" type="matrix" result="rimAlpha" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0" />
          <feFlood floodColor="#ffffff" floodOpacity="1" result="white" />
          <feComposite in="white" in2="rimAlpha" operator="in" result="rim" />
          <feComposite in="rim" in2="soft" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
