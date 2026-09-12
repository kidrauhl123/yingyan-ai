"use client";

import type { CSSProperties } from "react";
import type { VisualItem, VisualSpec, VisualType } from "@/lib/schema";

type Props = {
  spec: VisualSpec;
  type: VisualType;
  accent: string;
  selectedItemId: string | null;
  onSelect: (item: VisualItem) => void;
};

const ink = "#172139";
const muted = "#64718B";
const paper = "#FBFCFF";

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function CanvasHeader({ spec, accent }: { spec: VisualSpec; accent: string }) {
  return (
    <>
      <text x="56" y="66" fill={muted} fontSize="13" fontWeight="600" letterSpacing="1.8">
        映言 · VISUAL NOTE
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
      <CanvasHeader spec={spec} accent={accent} />
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
      <CanvasHeader spec={spec} accent={accent} />
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
      <CanvasHeader spec={spec} accent={accent} />
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

export function VisualCanvas(props: Props & { svgRef?: React.RefObject<SVGSVGElement | null>; compact?: boolean }) {
  const { svgRef, compact } = props;
  const style = { "--accent": props.accent } as CSSProperties;
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
    </svg>
  );
}
