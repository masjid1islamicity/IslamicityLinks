import React from 'react';

interface IslamicityLogoProps {
  variant?: 'full' | 'wordmark' | 'emblem' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showSubtitle?: boolean;
  showLynkBadge?: boolean;
  customColor?: string;
  themeAdapt?: boolean;
}

/**
 * High-fidelity vector rendition of the official Islamicity logo
 * Featuring the signature stylized calligraphy, central mosque dome with minaret finial,
 * and diacritic details.
 */
export const IslamicityLogo: React.FC<IslamicityLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
  showLynkBadge = true,
  customColor,
  themeAdapt = true,
}) => {
  // Dimension presets
  const sizeMap = {
    xs: { h: 'h-6', iconSize: 24, textScale: 'text-sm' },
    sm: { h: 'h-8', iconSize: 32, textScale: 'text-base' },
    md: { h: 'h-10', iconSize: 40, textScale: 'text-lg' },
    lg: { h: 'h-12', iconSize: 48, textScale: 'text-xl' },
    xl: { h: 'h-16', iconSize: 64, textScale: 'text-2xl' },
    '2xl': { h: 'h-24', iconSize: 96, textScale: 'text-4xl' },
    custom: { h: '', iconSize: 40, textScale: '' },
  };

  const currentSize = sizeMap[size];

  // Base fill colors
  const primaryFill = customColor || (themeAdapt ? 'currentColor' : '#141A14');

  // Vector for the Islamicity Mosque Dome Silhouette with Minaret Finial
  const DomeSilhouette = ({ w = 48, h = 48, fill = primaryFill }) => (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full inline-block"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Minaret Crescent / Spire Finial */}
      <path
        d="M50 4 C51 4 52 5 52 7 L52 14 C55 14.5 56.5 17 55 19 C53.5 21 51.5 20.5 51.5 22 L51.5 27 C54 27.5 56 29 56 32 C56 34.5 54 36 51.5 36.5 L51.5 39 C51.5 39 53 39 54 39.5 C57 41 57.5 44 55 45 C53 45.8 51.5 45.5 51.5 46.5 C68 49 84 62 84 78 L84 84 L16 84 L16 78 C16 62 32 49 48.5 46.5 C48.5 45.5 47 45.8 45 45 C42.5 44 43 41 46 39.5 C47 39 48.5 39 48.5 39 L48.5 36.5 C46 36 44 34.5 44 32 C44 29 46 27.5 48.5 27 L48.5 22 C48.5 20.5 46.5 21 45 19 C43.5 17 45 14.5 48 14 L48 7 C48 5 49 4 50 4 Z"
      />
    </svg>
  );

  // Full Vector Typography for "islamicity" matching the official logo graphic
  const IslamicityWordmarkSvg = ({ width = 240, height = 75 }) => (
    <svg
      viewBox="0 0 320 100"
      className="h-full w-auto max-h-full select-none"
      fill={primaryFill}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* 1. Dome over the middle letters 'ami' */}
      <g transform="translate(112, 12) scale(0.96)">
        {/* Crescent / Spire Pin on top */}
        <path
          d="M50 2 C50.8 2 51.5 2.8 51.5 4 L51.5 10 C53.5 10.5 54.8 12.2 53.8 14 C52.8 15.5 51.5 15.2 51.5 16.5 L51.5 20.5 C53.2 21 54.5 22.2 54.5 24.5 C54.5 26.5 53.2 27.8 51.5 28.2 L51.5 30.5 C64 34 76 45 76 58 L76 63 L24 63 L24 58 C24 45 36 34 48.5 30.5 L48.5 28.2 C46.8 27.8 45.5 26.5 45.5 24.5 C45.5 22.2 46.8 21 48.5 20.5 L48.5 16.5 C48.5 15.2 47.2 15.5 46.2 14 C45.2 12.2 46.5 10.5 48.5 10 L48.5 4 C48.5 2.8 49.2 2 50 2 Z"
        />
      </g>

      {/* 2. Stylized Calligraphic Wordmark "islamicity" */}
      <g transform="translate(10, 52)">
        {/* 'i' */}
        <rect x="12" y="10" width="10" height="23" rx="1.5" />
        <rect x="13.5" y="-1" width="7" height="7" rx="1" transform="rotate(45 17 2.5)" />

        {/* 's' */}
        <path
          d="M27 10 L48 10 C50 10 51 11.5 51 13.5 L51 19 C51 21 49.5 22 47 22 L37 22 L37 25 L49 25 C51 25 52 26.5 52 28.5 L52 33 L27 33 L27 27 C27 25 28.5 24 31 24 L41 24 L41 21 L29 21 C27 21 27 19.5 27 17.5 Z"
        />

        {/* 'l' */}
        <rect x="56" y="-6" width="9.5" height="39" rx="1.5" />
        <rect x="56" y="24" width="18" height="9" rx="1" />

        {/* 'a' */}
        <path
          d="M74 10 L94 10 C96.5 10 98 11.5 98 14 L98 33 L88.5 33 L88.5 28 C87 31.5 83.5 33 79 33 C75 33 73 30.5 73 26.5 C73 22 76 19.5 83 19.5 L88.5 19.5 L88.5 18 C88.5 16 87 15 84 15 C81 15 78 16 75 17 L74 10 Z M88.5 23 L83.5 23 C79.5 23 78.5 24.5 78.5 26.5 C78.5 28 79.5 29 82 29 C86 29 88.5 27 88.5 24.5 Z"
        />

        {/* 'm' with Islamic baseline connection */}
        <path
          d="M102 10 L146 10 C148.5 10 150 11.5 150 14 L150 33 L140.5 33 L140.5 20 L131.5 20 L131.5 33 L122 33 L122 20 L112.5 20 L112.5 33 L102 33 Z"
        />
        {/* Two signature sub-dots beneath 'm' / 'i' */}
        <rect x="122" y="38" width="5.5" height="5.5" rx="0.8" />
        <rect x="130" y="38" width="5.5" height="5.5" rx="0.8" />

        {/* 'i' */}
        <rect x="154" y="10" width="9.5" height="23" rx="1.5" />
        <rect x="155.5" y="-1" width="6.5" height="6.5" rx="1" transform="rotate(45 158.75 2.25)" />

        {/* 'c' */}
        <path
          d="M188 16 C186 12 181 10 176 10 C170 10 166 14.5 166 21.5 C166 28.5 170 33 176 33 C181 33 186 31 188 27 L181 25 C179.5 27 178 28 176 28 C173 28 171.5 25.5 171.5 21.5 C171.5 17.5 173 15 176 15 C178 15 179.5 16 181 18 Z"
        />

        {/* 'i' */}
        <rect x="193" y="10" width="9.5" height="23" rx="1.5" />
        <rect x="194.5" y="-1" width="6.5" height="6.5" rx="1" transform="rotate(45 197.75 2.25)" />

        {/* 't' */}
        <path
          d="M211 -2 L211 10 L220 10 L220 16 L211 16 L211 26 C211 28 212 28.5 214 28.5 L220 28.5 L220 33 L212 33 C207 33 205.5 30.5 205.5 26 L205.5 16 L202 16 L202 10 L205.5 10 L205.5 -2 Z"
        />

        {/* 'y' with extended Arabic-style calligraphic swash */}
        <path
          d="M224 10 L230 10 L236 24 L242 10 L248 10 L238 31 C235 37 230 40 224 40 L218 40 L218 35 L224 35 C227 35 229.5 33.5 231 30 Z"
        />
      </g>
    </svg>
  );

  // Variant: Emblem Badge (Icon Box with Dome + Islamic Mark)
  if (variant === 'emblem' || variant === 'icon') {
    return (
      <div
        id="islamicity-emblem"
        className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1B4D20] text-white shadow-md shadow-[#2E7D32]/25 overflow-hidden p-1.5 transition-transform hover:scale-105 ${className}`}
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="w-4/5 h-4/5 -mt-1">
            <DomeSilhouette fill="#FFFFFF" />
          </div>
          <span className="text-[9px] font-black tracking-tighter -mt-2.5 font-sans">
            islamicity
          </span>
        </div>
      </div>
    );
  }

  // Variant: Wordmark Only
  if (variant === 'wordmark') {
    return (
      <div 
        id="islamicity-wordmark"
        className={`inline-flex items-center ${currentSize.h} ${className}`}
      >
        <IslamicityWordmarkSvg />
      </div>
    );
  }

  // Variant: Full Brand with "Link" and optional "x Lynk.id"
  return (
    <div 
      id="islamicity-full-logo"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      {/* Authentic Islamicity Wordmark / Logo Emblem */}
      <div className="flex items-center">
        {/* Emblem Dome Badge */}
        <div 
          className="rounded-xl bg-gradient-to-br from-[#2E7D32] via-[#256629] to-[#17381A] p-2 flex items-center justify-center text-white shadow-md shadow-[#2E7D32]/20 shrink-0"
          style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-3/4">
              <DomeSilhouette fill="#FFFFFF" />
            </div>
            <span className="text-[7.5px] font-black tracking-tighter leading-none text-emerald-100">
              islamicity
            </span>
          </div>
        </div>
      </div>

      {/* Typography & Ecosystem text */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-baseline">
            <span className="font-black text-[#141A14] dark:text-[#E4E8E4] tracking-tight text-lg leading-none">
              Islamicity
            </span>
            <span className="font-black text-[#2E7D32] dark:text-[#4CAF50] tracking-tight text-lg leading-none">
              Link
            </span>
          </div>

          {showLynkBadge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#4CAF50] border border-[#2E7D32]/20">
              x Lynk.id
            </span>
          )}
        </div>

        {showSubtitle && (
          <p className="text-[10px] text-[#5A665B] dark:text-[#A0A8A0] font-medium leading-tight mt-0.5">
            Smart Global Ummah & Zakat Blockchain L2
          </p>
        )}
      </div>
    </div>
  );
};
