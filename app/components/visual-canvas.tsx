"use client";

import type { CSSProperties } from "react";
import type { VisualItem, VisualSpec, VisualType } from "@/lib/schema";

type Props = {
  spec: VisualSpec;
  type: VisualType;
  accent: string;
  brandName: string;
  logoDataUrl: string;
  fontFamily: string;
  selectedItemId: string | null;
  onSelect: (item: VisualItem) => void;
};

const ink = "#172139";
const muted = "#64718B";
const paper = "#FBFCFF";

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function CanvasHeader({ spec, accent, brandName, logoDataUrl }: Pick<Props, "spec" | "accent" | "brandName" | "logoDataUrl">) {
  const labelX = logoDataUrl ? 86 : 56;
  return (
    <>
      {logoDataUrl ? <image href={logoDataUrl} x="56" y="45" width="22" height="22" preserveAspectRatio="xMidYMid meet" /> : null}
      <text x={labelX} y="66" fill={muted} fontSize="13" fontWeight="600" letterSpacing="1.8">
        {truncate(brandName || "映言", 12)} · VISUAL NOTE
      </text>
      <text x="56" y="112" fill={ink} fontSize="34" fontWeight="750">
        {truncate(spec.title, 20)}
      </text>
      <rect x="56" y="132" width="48" height="5" rx="2.5" fill={accent} />
      <text x="56" y="167" fill={muted} fontSize="16">
        {truncate(spec.conclusion, 42)}
      </text>
    </>
  );
}

function ProcessVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const count = spec.items.length;
  const startX = 72;
  const endX = 828;
  const gap = count > 1 ? (endX - startX) / (count - 1) : 0;
  return (
    <>
      <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
      <line x1={startX} y1="338" x2={endX} y2="338" stroke="#D8DEEA" strokeWidth="3" />
      {spec.items.map((item, index) => {
        const x = startX + gap * index;
        const selected = item.id === selectedItemId;
        return (
          <g
            key={item.id}
            data-item-id={item.id}
            onClick={() => onSelect(item)}
            className="svg-item"
            tabIndex={0}
            role="button"
          >
            <circle cx={x} cy="338" r={selected ? 28 : 23} fill={selected ? accent : paper} stroke={accent} strokeWidth={selected ? 0 : 3} />
            <text x={x} y="344" textAnchor="middle" fill={selected ? "white" : accent} fontSize="16" fontWeight="750">
              {index + 1}
            </text>
            <text x={x} y={index % 2 ? 406 : 270} textAnchor="middle" fill={ink} fontSize="17" fontWeight="700">
              {truncate(item.label, 9)}
            </text>
            <text x={x} y={index % 2 ? 432 : 294} textAnchor="middle" fill={muted} fontSize="12">
              {truncate(item.description, 13)}
            </text>
            {item.value ? (
              <text x={x} y={index % 2 ? 458 : 318} textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">
                {truncate(item.value, 12)}
              </text>
            ) : null}
          </g>
        );
      })}
      <text x="56" y="554" fill="#95A0B5" fontSize="12">点击任一节点，查看它在原文中的依据</text>
    </>
  );
}

function CardsVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const cols = spec.items.length <= 4 ? 2 : 3;
  const cardWidth = cols === 2 ? 360 : 232;
  const startX = cols === 2 ? 72 : 66;
  return (
    <>
      <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
      {spec.items.map((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (cardWidth + 28);
        const y = 220 + row * 156;
        const selected = item.id === selectedItemId;
        return (
          <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
            <rect x={x} y={y} width={cardWidth} height="128" rx="7" fill={selected ? `${accent}12` : "white"} stroke={selected ? accent : "#DFE4EE"} strokeWidth={selected ? 2.5 : 1.5} />
            <rect x={x} y={y} width="7" height="128" rx="3.5" fill={accent} />
            <text x={x + 28} y={y + 37} fill={ink} fontSize="18" fontWeight="750">{truncate(item.label, cols === 2 ? 16 : 10)}</text>
            <text x={x + 28} y={y + 70} fill={muted} fontSize="13">{truncate(item.description, cols === 2 ? 31 : 18)}</text>
            {item.value ? <text x={x + 28} y={y + 103} fill={accent} fontSize="16" fontWeight="750">{truncate(item.value, 18)}</text> : null}
          </g>
        );
      })}
    </>
  );
}

function OrbitVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const centerX = 450;
  const centerY = 370;
  const radiusX = 302;
  const radiusY = 145;
  return (
    <>
      <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
      <ellipse cx={centerX} cy={centerY} rx={radiusX} ry={radiusY} fill="none" stroke="#E0E5EF" strokeWidth="2" strokeDasharray="7 8" />
      <circle cx={centerX} cy={centerY} r="82" fill={ink} />
      <text x={centerX} y={centerY - 6} textAnchor="middle" fill="white" fontSize="17" fontWeight="700">核心结论</text>
      <text x={centerX} y={centerY + 22} textAnchor="middle" fill="#C8D1E5" fontSize="12">{truncate(spec.conclusion, 16)}</text>
      {spec.items.map((item, index) => {
        const angle = (Math.PI * 2 * index) / spec.items.length - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;
        const selected = item.id === selectedItemId;
        return (
          <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
            <line x1={centerX + Math.cos(angle) * 84} y1={centerY + Math.sin(angle) * 84} x2={x} y2={y} stroke={selected ? accent : "#CED5E3"} strokeWidth={selected ? 2.5 : 1.5} />
            <circle cx={x} cy={y} r={selected ? 51 : 45} fill={selected ? accent : "white"} stroke={accent} strokeWidth="2" />
            <text x={x} y={y - 2} textAnchor="middle" fill={selected ? "white" : ink} fontSize="15" fontWeight="750">{truncate(item.label, 7)}</text>
            <text x={x} y={y + 19} textAnchor="middle" fill={selected ? "#E9EEFF" : muted} fontSize="10">{truncate(item.description, 10)}</text>
          </g>
        );
      })}
    </>
  );
}

function StepsVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const count = spec.items.length;
  const vertical = count > 5;
  if (vertical) {
    const cols = 2;
    const rows = Math.ceil(count / cols);
    const cardW = 380;
    const cardH = 90;
    const colGap = 40;
    const startX = (900 - (cardW * cols + colGap)) / 2;
    const startY = 210;
    const rowGap = 20;
    return (
      <>
        <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
        {spec.items.map((item, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = startX + col * (cardW + colGap);
          const y = startY + row * (cardH + rowGap);
          const selected = item.id === selectedItemId;
          return (
            <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
              <rect x={x} y={y} width={cardW} height={cardH} rx="10" fill={selected ? `${accent}12` : "white"} stroke={selected ? accent : "#DFE4EE"} strokeWidth={selected ? 2.5 : 1.5} />
              <rect x={x} y={y} width="6" height={cardH} rx="3" fill={accent} />
              <circle cx={x + 32} cy={y + cardH / 2} r="18" fill={accent} opacity={selected ? 1 : 0.12} />
              <text x={x + 32} y={y + cardH / 2 + 6} textAnchor="middle" fill={selected ? "white" : accent} fontSize="16" fontWeight="800">{index + 1}</text>
              <text x={x + 62} y={y + 36} fill={ink} fontSize="16" fontWeight="750">{truncate(item.label, 16)}</text>
              <text x={x + 62} y={y + 60} fill={muted} fontSize="12">{truncate(item.description, 30)}</text>
              {item.value ? <text x={x + 62} y={y + 80} fill={accent} fontSize="13" fontWeight="700">{truncate(item.value, 18)}</text> : null}
            </g>
          );
        })}
      </>
    );
  }
  const baseY = 470;
  const stepHeight = count > 1 ? 240 / (count - 1) : 0;
  const startX = 90;
  const gap = count > 1 ? 720 / (count - 1) : 0;
  return (
    <>
      <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
      {spec.items.map((item, index) => {
        const x = startX + gap * index;
        const y = baseY - stepHeight * index;
        const selected = item.id === selectedItemId;
        return (
          <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
            {index < count - 1 ? (
              <line x1={x + 30} y1={y} x2={startX + gap * (index + 1) - 30} y2={baseY - stepHeight * (index + 1)} stroke={accent} strokeWidth="3" strokeDasharray="6 5" opacity="0.5" />
            ) : null}
            <rect x={x - 38} y={y - 30} width="76" height="60" rx="10" fill={selected ? accent : "white"} stroke={accent} strokeWidth={selected ? 0 : 2.5} />
            <text x={x} y={y - 4} textAnchor="middle" fill={selected ? "white" : accent} fontSize="22" fontWeight="800">{index + 1}</text>
            <text x={x} y={y + 17} textAnchor="middle" fill={selected ? "#E9EEFF" : muted} fontSize="11">{truncate(item.value || item.label, 8)}</text>
            <text x={x} y={y + 52} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{truncate(item.label, 8)}</text>
            <text x={x} y={y + 70} textAnchor="middle" fill={muted} fontSize="11">{truncate(item.description, 12)}</text>
          </g>
        );
      })}
    </>
  );
}

function SplitVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const mid = Math.ceil(spec.items.length / 2);
  const left = spec.items.slice(0, mid);
  const right = spec.items.slice(mid);
  const cardW = 360;
  const cardH = 104;
  const rowGap = 16;
  const leftX = 60;
  const rightX = 480;
  const maxRows = Math.max(left.length, right.length);
  const totalH = maxRows * cardH + (maxRows - 1) * rowGap;
  const startY = 200 + (360 - totalH) / 2;
  const renderCol = (items: VisualItem[], x: number) => {
    const colStartY = startY + (maxRows - items.length) * (cardH + rowGap) / 2;
    return items.map((item, index) => {
      const y = colStartY + index * (cardH + rowGap);
      const selected = item.id === selectedItemId;
      return (
        <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
          <rect x={x} y={y} width={cardW} height={cardH} rx="8" fill={selected ? `${accent}12` : "white"} stroke={selected ? accent : "#DFE4EE"} strokeWidth={selected ? 2.5 : 1.5} />
          <rect x={x} y={y} width="6" height={cardH} rx="3" fill={accent} />
          <text x={x + 24} y={y + 34} fill={ink} fontSize="16" fontWeight="750">{truncate(item.label, 14)}</text>
          <text x={x + 24} y={y + 60} fill={muted} fontSize="12">{truncate(item.description, 28)}</text>
          {item.value ? <text x={x + 24} y={y + 86} fill={accent} fontSize="14" fontWeight="750">{truncate(item.value, 16)}</text> : null}
        </g>
      );
    });
  };
  return (
    <>
      <CanvasHeader spec={spec} accent={accent} brandName={props.brandName} logoDataUrl={props.logoDataUrl} />
      <line x1="450" y1="200" x2="450" y2="560" stroke="#E0E5EF" strokeWidth="2" strokeDasharray="6 6" />
      {renderCol(left, leftX)}
      {renderCol(right, rightX)}
    </>
  );
}

function SignalVisual(props: Props) {
  const { spec, accent, selectedItemId, onSelect } = props;
  const count = spec.items.length;
  const wrap = count > 4;
  const cols = wrap ? Math.ceil(count / 2) : count;
  const cardW = wrap ? 240 : Math.min(200, 760 / count);
  const cardH = wrap ? 150 : 230;
  const gapX = 24;
  const gapY = 20;
  const totalW = cols * cardW + (cols - 1) * gapX;
  const startX = (900 - totalW) / 2;
  const startY = wrap ? 250 : 270;
  return (
    <>
      <text x="450" y="90" textAnchor="middle" fill={muted} fontSize="13" fontWeight="600" letterSpacing="2">
        {truncate(props.brandName || "映言", 12)} · VISUAL NOTE
      </text>
      <text x="450" y={wrap ? 150 : 160} textAnchor="middle" fill={ink} fontSize={wrap ? 32 : 38} fontWeight="800">
        {truncate(spec.title, wrap ? 20 : 18)}
      </text>
      <rect x="402" y={wrap ? 168 : 178} width="96" height="6" rx="3" fill={accent} />
      <text x="450" y={wrap ? 208 : 218} textAnchor="middle" fill={accent} fontSize="18" fontWeight="700">
        {truncate(spec.conclusion, wrap ? 32 : 30)}
      </text>
      {spec.items.map((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);
        const selected = item.id === selectedItemId;
        return (
          <g key={item.id} data-item-id={item.id} onClick={() => onSelect(item)} className="svg-item" tabIndex={0} role="button">
            <rect x={x} y={y} width={cardW} height={cardH} rx="14" fill={selected ? accent : "white"} stroke={accent} strokeWidth={selected ? 0 : 2} />
            <circle cx={x + 30} cy={y + 32} r="18" fill={selected ? "white" : accent} opacity={selected ? 1 : 0.12} />
            <text x={x + 30} y={y + 38} textAnchor="middle" fill={selected ? accent : "white"} fontSize="15" fontWeight="800">{index + 1}</text>
            <text x={x + 58} y={y + 30} fill={selected ? "white" : ink} fontSize="16" fontWeight="750">{truncate(item.label, wrap ? 12 : 10)}</text>
            <text x={x + 18} y={y + 64} fill={selected ? "#E9EEFF" : muted} fontSize="12">{truncate(item.description, wrap ? 22 : 16)}</text>
            {item.value ? (
              <text x={x + cardW / 2} y={y + cardH - 20} textAnchor="middle" fill={selected ? "white" : accent} fontSize="20" fontWeight="800">{truncate(item.value, 12)}</text>
            ) : null}
          </g>
        );
      })}
      <text x="450" y="578" textAnchor="middle" fill="#95A0B5" fontSize="12">点击任一节点，查看它在原文中的依据</text>
    </>
  );
}

export function VisualCanvas(props: Props & { svgRef?: React.RefObject<SVGSVGElement | null>; compact?: boolean }) {
  const { svgRef, compact } = props;
  const style = { "--accent": props.accent, fontFamily: props.fontFamily } as CSSProperties;
  return (
    <svg
      ref={svgRef}
      className={compact ? "visual-svg visual-svg--compact" : "visual-svg"}
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${props.spec.title} 信息图`}
      style={style}
    >
      <rect width="900" height="600" fill={paper} />
      <path d="M690 0H900V210C832 162 765 99 690 0Z" fill={`${props.accent}0B`} />
      {props.type === "process" ? <ProcessVisual {...props} /> : null}
      {props.type === "cards" ? <CardsVisual {...props} /> : null}
      {props.type === "orbit" ? <OrbitVisual {...props} /> : null}
      {props.type === "steps" ? <StepsVisual {...props} /> : null}
      {props.type === "split" ? <SplitVisual {...props} /> : null}
      {props.type === "signal" ? <SignalVisual {...props} /> : null}
    </svg>
  );
}
