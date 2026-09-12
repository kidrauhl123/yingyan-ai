"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Download,
  FileText,
  History,
  X,
  LoaderCircle,
  LocateFixed,
  Palette,
  PenLine,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { Audience, VisualItem, VisualSpec, VisualType } from "@/lib/schema";
import { VisualCanvas } from "./visual-canvas";

const demoText = `越来越多的团队使用 AI 提高内容生产效率，但真正的瓶颈已经从“写不出来”变成“表达不清楚”。一份好的方案需要先提炼结论，再组织证据，最后选择合适的视觉结构。图解能让读者更快发现重点，也能减少沟通中的理解偏差。我们的工作流分为四步：输入原文、识别结构、生成视觉方案、根据受众调整表达。`;

const demoSpec: VisualSpec = {
  title: "从生成内容到清晰表达",
  conclusion: "AI 时代，表达结构正在成为新的效率瓶颈",
  sourceText: demoText,
  items: [
    { id: "item-1", label: "输入原文", description: "保留完整上下文和事实", value: "01", sourceQuote: "输入原文" },
    { id: "item-2", label: "识别结构", description: "提炼结论、证据与关系", value: "02", sourceQuote: "识别结构" },
    { id: "item-3", label: "生成图解", description: "选择匹配内容的视觉语法", value: "03", sourceQuote: "生成视觉方案" },
    { id: "item-4", label: "适配受众", description: "调整措辞和信息密度", value: "04", sourceQuote: "根据受众调整表达" },
  ],
};

const audienceOptions: { value: Audience; label: string; hint: string }[] = [
  { value: "leader", label: "管理者", hint: "结论先行" },
  { value: "client", label: "客户", hint: "强调价值" },
  { value: "student", label: "学习者", hint: "解释清晰" },
  { value: "social", label: "社交媒体", hint: "短而有力" },
];

const visualOptions: { value: VisualType; label: string; note: string }[] = [
  { value: "process", label: "路径", note: "适合步骤与变化" },
  { value: "cards", label: "摘要", note: "适合并列观点" },
  { value: "orbit", label: "焦点", note: "适合中心主题" },
];

const accents = ["#315EFB", "#F05A3D", "#12856A", "#8C4FF7", "#C58A13"];

type HistoryEntry = {
  id: number;
  title: string;
  createdAt: string;
  spec: VisualSpec;
  text: string;
  visualType: VisualType;
  accent: string;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function VisualStudio() {
  const [text, setText] = useState(demoText);
  const [audience, setAudience] = useState<Audience>("leader");
  const [spec, setSpec] = useState<VisualSpec>(demoSpec);
  const [visualType, setVisualType] = useState<VisualType>("process");
  const [accent, setAccent] = useState(accents[0]);
  const [selectedItem, setSelectedItem] = useState<VisualItem | null>(null);
  const [instruction, setInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const storageReadyRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("yingyan-latest");
    if (stored) {
      try {
        const state = JSON.parse(stored);
        /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from browser-owned storage */
        if (state.text) setText(state.text);
        if (state.spec) setSpec(state.spec);
        if (state.audience) setAudience(state.audience);
        if (state.visualType) setVisualType(state.visualType);
        if (state.accent) setAccent(state.accent);
        const storedHistory = localStorage.getItem("yingyan-history");
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch {
        localStorage.removeItem("yingyan-latest");
      }
    }
    window.setTimeout(() => { storageReadyRef.current = true; }, 0);
  }, []);

  useEffect(() => {
    if (!storageReadyRef.current) return;
    localStorage.setItem("yingyan-latest", JSON.stringify({ text, spec, audience, visualType, accent }));
    const showTimer = window.setTimeout(() => setSaved(true), 0);
    const timer = window.setTimeout(() => setSaved(false), 900);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(timer);
    };
  }, [text, spec, audience, visualType, accent]);

  function addHistory(nextSpec: VisualSpec, nextText = text, nextType = visualType) {
    setHistory((current) => {
      const entry: HistoryEntry = {
        id: Date.now(),
        title: nextSpec.title,
        createdAt: new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date()),
        spec: nextSpec,
        text: nextText,
        visualType: nextType,
        accent,
      };
      const next = [entry, ...current].slice(0, 12);
      localStorage.setItem("yingyan-history", JSON.stringify(next));
      return next;
    });
  }

  function restoreHistory(entry: HistoryEntry) {
    setText(entry.text);
    setSpec(entry.spec);
    setVisualType(entry.visualType);
    setAccent(entry.accent);
    setSelectedItem(null);
    setHistoryOpen(false);
  }

  const highlightedSource = useMemo(() => {
    if (!selectedItem) return null;
    const index = text.indexOf(selectedItem.sourceQuote);
    if (index < 0) return { before: text, quote: "", after: "" };
    return {
      before: text.slice(0, index),
      quote: text.slice(index, index + selectedItem.sourceQuote.length),
      after: text.slice(index + selectedItem.sourceQuote.length),
    };
  }, [selectedItem, text]);

  async function generate() {
    if (text.trim().length < 20) {
      setError("再多写一点，至少需要 20 个字才能提炼结构。");
      return;
    }
    setIsGenerating(true);
    setError("");
    setSelectedItem(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, audience }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "生成失败");
      setSpec(payload.spec);
      setVisualType(payload.suggestedTypes[0]);
      addHistory(payload.spec, text, payload.suggestedTypes[0]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "生成失败，请重试。");
    } finally {
      setIsGenerating(false);
    }
  }

  async function refine() {
    if (!instruction.trim()) return;
    setIsRefining(true);
    setError("");
    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, audience, spec, selectedItemId: selectedItem?.id ?? null }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "修改失败");
      setSpec(payload.spec);
      addHistory(payload.spec);
      setSelectedItem(payload.spec.items.find((item: VisualItem) => item.id === selectedItem?.id) ?? null);
      setInstruction("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "修改失败，请重试。");
    } finally {
      setIsRefining(false);
    }
  }

  function updateSelected(field: "label" | "description" | "value", value: string) {
    if (!selectedItem) return;
    const nextItem = { ...selectedItem, [field]: value };
    setSelectedItem(nextItem);
    setSpec((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === nextItem.id ? nextItem : item)),
    }));
  }

  function exportSvg() {
    if (!svgRef.current) return;
    const markup = new XMLSerializer().serializeToString(svgRef.current);
    downloadBlob(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }), `${spec.title}.svg`);
  }

  function exportPng() {
    if (!svgRef.current) return;
    const markup = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1800;
      canvas.height = 1200;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((result) => result && downloadBlob(result, `${spec.title}.png`), "image/png");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">映言</span>
          <span className="brand-tagline">把文字变成看得懂的图</span>
        </div>
        <div className="topbar-actions">
          <span className={`save-state ${saved ? "save-state--on" : ""}`}><Check size={14} /> 已保存在本机</span>
          <button className="ghost-button" type="button" onClick={() => setHistoryOpen(true)}><History size={16} /> 历史</button>
          <div className="export-menu">
            <button className="export-button" type="button" onClick={exportPng}><Download size={16} /> 导出 PNG</button>
            <button className="export-caret" type="button" onClick={exportSvg} title="导出 SVG"><ChevronDown size={16} /></button>
          </div>
        </div>
      </header>

      <section className="workspace">
        <aside className="source-panel">
          <div className="panel-heading">
            <div><span className="step-dot">1</span><h1>放入你的内容</h1></div>
            <span>{text.length.toLocaleString()} 字</span>
          </div>
          <div className="source-editor-wrap">
            <FileText size={17} />
            {highlightedSource?.quote ? (
              <div className="source-highlight" onClick={() => setSelectedItem(null)}>
                {highlightedSource.before}<mark>{highlightedSource.quote}</mark>{highlightedSource.after}
              </div>
            ) : (
              <textarea value={text} onChange={(event) => setText(event.target.value)} aria-label="需要转换为图解的文字" />
            )}
          </div>
          {selectedItem ? (
            <button className="back-to-edit" type="button" onClick={() => setSelectedItem(null)}><PenLine size={15} /> 返回编辑原文</button>
          ) : null}

          <div className="control-block">
            <div className="control-title"><LocateFixed size={17} /><span>这张图给谁看？</span></div>
            <div className="audience-grid">
              {audienceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={audience === option.value ? "audience-option audience-option--active" : "audience-option"}
                  onClick={() => setAudience(option.value)}
                >
                  <strong>{option.label}</strong><span>{option.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="generate-button" type="button" onClick={generate} disabled={isGenerating}>
            {isGenerating ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? "正在理解并设计…" : "生成三种视觉表达"}
            {!isGenerating ? <ArrowUpRight size={18} /> : null}
          </button>
          {error ? <p className="error-message">{error}</p> : null}
          <p className="privacy-note">原文只用于本次生成，项目默认保存在你的浏览器中。</p>
        </aside>

        <section className="canvas-panel">
          <div className="canvas-toolbar">
            <div className="variant-tabs">
              {visualOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={visualType === option.value ? "variant-tab variant-tab--active" : "variant-tab"}
                  onClick={() => setVisualType(option.value)}
                >
                  <span>{option.label}</span><small>{option.note}</small>
                </button>
              ))}
            </div>
            <div className="color-tools"><Palette size={16} />{accents.map((color) => (
              <button key={color} type="button" aria-label={`选择颜色 ${color}`} className={accent === color ? "color-dot color-dot--active" : "color-dot"} style={{ background: color }} onClick={() => setAccent(color)} />
            ))}</div>
          </div>

          <div className="canvas-stage">
            <div className="canvas-paper">
              <VisualCanvas spec={spec} type={visualType} accent={accent} selectedItemId={selectedItem?.id ?? null} onSelect={setSelectedItem} svgRef={svgRef} />
            </div>
          </div>

          <div className="bottom-editor">
            {selectedItem ? (
              <div className="item-editor">
                <div className="item-editor-title"><span style={{ background: accent }} /> 编辑「{selectedItem.label}」<small>依据已在左侧原文中标出</small></div>
                <input value={selectedItem.label} onChange={(event) => updateSelected("label", event.target.value)} aria-label="节点标题" />
                <input value={selectedItem.description} onChange={(event) => updateSelected("description", event.target.value)} aria-label="节点描述" />
                <input value={selectedItem.value ?? ""} onChange={(event) => updateSelected("value", event.target.value)} placeholder="数字或短标签" aria-label="节点数值" />
              </div>
            ) : (
              <div className="refine-copy"><WandSparkles size={18} /><div><strong>继续用一句话调整</strong><span>例如：让标题更有结论感，减少每个节点的文字</span></div></div>
            )}
            <div className="refine-input">
              <input
                value={instruction}
                onChange={(event) => setInstruction(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && !event.nativeEvent.isComposing && refine()}
                placeholder={selectedItem ? `只调整「${selectedItem.label}」…` : "告诉 AI 你希望怎么改…"}
                aria-label="AI 修改指令"
              />
              <button type="button" onClick={refine} disabled={isRefining || !instruction.trim()}>
                {isRefining ? <LoaderCircle className="spin" size={17} /> : <ArrowUpRight size={17} />}
              </button>
            </div>
          </div>
        </section>
      </section>
      {historyOpen ? (
        <div className="history-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setHistoryOpen(false)}>
          <section className="history-drawer" role="dialog" aria-modal="true" aria-label="生成历史">
            <div className="history-heading"><div><History size={18} /><h2>生成历史</h2></div><button type="button" onClick={() => setHistoryOpen(false)} aria-label="关闭历史"><X size={18} /></button></div>
            <p>最近 12 次生成保存在当前浏览器。</p>
            {history.length ? (
              <div className="history-list">
                {history.map((entry) => (
                  <button key={entry.id} type="button" onClick={() => restoreHistory(entry)}>
                    <span className="history-swatch" style={{ background: entry.accent }} />
                    <span><strong>{entry.title}</strong><small>{entry.createdAt} · {visualOptions.find((option) => option.value === entry.visualType)?.label}</small></span>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            ) : <div className="history-empty">生成第一张图后，版本会出现在这里。</div>}
          </section>
        </div>
      ) : null}
    </main>
  );
}
