"use client";

import { useState, useCallback } from "react";

/* ──────────────────────────────────────────
   Types
────────────────────────────────────────── */
interface WorkItem {
  title: string;
  detail: string;
  progress: number;
}

/* ──────────────────────────────────────────
   Utility
────────────────────────────────────────── */
function escHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTodayString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${d}.`;
}

/* ──────────────────────────────────────────
   Report HTML builder (shared by preview & export)
────────────────────────────────────────── */
function buildReportHTML(
  name: string,
  rank: string,
  date: string,
  checkin: string,
  checkout: string,
  workItems: WorkItem[],
  specialItems: string[]
): string {
  const workRows = workItems
    .map(
      (item) => `
      <tr>
        <td
          colspan="6"
          style="
            border: 1px solid #c1c7d0;
            padding: 20px;
            vertical-align: top;
            min-height: 80px;
          "
        >
          <p
            style="
              font-size: 16px;
              font-weight: 700;
              color: #0052cc;
              margin: 0 0 8px 0;
            "
          >
            ◆ ${escHtml(item.title || "(제목 없음)")}
          </p>
          <p
            style="
              margin: 0 0 4px;
              color: #444;
              font-size: 14px;
            "
          >
            ${escHtml(item.detail).replace(/\n/g, "<br>")}
          </p>
        </td>
        <td
          style="
            border: 1px solid #c1c7d0;
            padding: 15px;
            vertical-align: middle;
          "
        >
          <p
            style="
              margin: 0;
              display: block;
              background-color: #abacad;
              width: 100%;
              height: 24px;
              border-radius: 12px;
              position: relative;
              overflow: hidden;
            "
          >
            <span
              style="
                display: block;
                background-color: #0052cc;
                height: 100%;
                border-radius: 12px;
                width: ${item.progress}%;
              "
            >&nbsp;</span>
            <span
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: 700;
              "
            >
              ${item.progress}%
            </span>
          </p>
        </td>
      </tr>`
    )
    .join("");

  const specialRows = specialItems
    .map(
      (s) => `
        <p
          style="
            margin: 0 0 4px;
            color: #444;
            font-size: 14px;
          "
        >
          • ${escHtml(s)}
        </p>`
    )
    .join("");

  return `
    <p><br /><br /></p>
    <table
      style="
        border-collapse: collapse;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        table-layout: fixed;
        border: 1px solid #c1c7d0;
        margin-bottom: 20px;
      "
    >
      <tbody style="text-align: center;">
        <tr>
          <td
            rowspan="4"
            style="
              border: 1px solid #c1c7d0;
              background-color: #f4f5f7;
              font-weight: 600;
              color: #444;
            "
          >
            <p
              style="
                font-size: 32px;
                font-weight: 800;
                margin: 0;
                color: #172b4d;
              "
            >
              일 일 업 무 일 지
            </p>
          </td>
          <td
            style="
              width: 120px;
              height: 40px;
              border: 1px solid #c1c7d0;
              background-color: #f4f5f7;
              font-weight: 600;              
              color: #444;
              font-size: 18px;
            "
          >
            소속
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              font-size: 18px;
            "
          >
            렉스이노베이션 주식회사
          </td>
        </tr>
        <tr>
          <td
            style="
              height: 40px;
              border: 1px solid #c1c7d0;
              background-color: #f4f5f7;
              font-weight: 600;
              color: #444;
              font-size: 18px;
            "
          >
            성명
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              font-size: 18px;
            "
          >
            ${escHtml(name)}
          </td>
        </tr>
        <tr>
          <td
            style="
              height: 40px;
              border: 1px solid #c1c7d0;
              background-color: #f4f5f7;
              font-weight: 600;
              color: #444;
              font-size: 18px;
            "
          >
            직급
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              font-size: 18px;
            "
          >
            ${escHtml(rank)}
          </td>
        </tr>
        <tr>
          <td
            style="
              height: 40px;
              border: 1px solid #c1c7d0;
              background-color: #f4f5f7;
              font-weight: 600;
              color: #444;
              font-size: 18px;
            "
          >
            작성일
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              font-size: 18px;
            "
          >
            ${escHtml(date)}
          </td>
        </tr>
      </tbody>
    </table>

    <table
      style="
        border-collapse: collapse;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        table-layout: fixed;
        border: 1px solid #c1c7d0;
        margin-bottom: 20px;
      "
    >
      <tbody>
        <tr>
          <td
            colspan="6"
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              background-color: #f4f5f7;
              height: 45px;
              text-align: center;
              font-weight: 700;
              font-size: 18px;
              color: #172b4d;
            "
          >
            업무내용
          </td>
          <td
            style="
              width: 215px;
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              background-color: #f4f5f7;
              height: 45px;
              text-align: center;
              font-weight: 700;
              font-size: 18px;
              color: #172b4d;
            "
          >
            진행률
          </td>
        </tr>

        ${workRows}

        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              background-color: #f4f5f7;
              height: 45px;
              text-align: center;
              font-weight: 700;
              font-size: 18px;
              color: #172b4d;
            "
          >
            특이사항 / 건의사항
          </td>
        </tr>
        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid #c1c7d0;
              padding: 20px;
              vertical-align: top;
              height: 100px;
            "
          >
            ${specialRows}
          </td>
        </tr>
      </tbody>
    </table>

    <table
      style="
        border-collapse: collapse;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        table-layout: fixed;
        border: 1px solid #c1c7d0;
      "
    >
      <tbody>
        <tr>
          <td
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              background-color: #f4f5f7;
              text-align: center;
              font-weight: 600;
              color: #444;
            "
          >
            출근 시간
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              text-align: center;
              font-size: 18px;
              font-weight: 700;
              color: #0052cc;
            "
          >
            ${escHtml(checkin)}
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              background-color: #f4f5f7;
              text-align: center;
              font-weight: 600;
              color: #444;
            "
          >
            퇴근 시간
          </td>
          <td
            style="
              border: 1px solid #c1c7d0;
              padding: 12px;
              vertical-align: middle;
              text-align: center;
              font-size: 18px;
              font-weight: 700;
              color: #0052cc;
            "
          >
            ${escHtml(checkout)}
          </td>
        </tr>
      </tbody>
    </table>
    <p><br /><br /></p>
  `;
}

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */

/** 기본 정보 패널 */
function BasicInfoPanel({
  name,
  rank,
  date,
  onNameChange,
  onRankChange,
}: {
  name: string;
  rank: string;
  date: string;
  onNameChange: (v: string) => void;
  onRankChange: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-[#d1d9e0] overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#d1d9e0] bg-[#fafbfc]">
        <div className="w-7 h-7 bg-[#e8f0fe] rounded-[7px] flex items-center justify-center text-sm">
          👤
        </div>
        <h2 className="text-sm font-semibold text-[#1e293b]">기본 정보</h2>
      </div>
      {/* body */}
      <div className="px-5 py-[18px] flex flex-col gap-3">
        <FieldRow label="소속" value="렉스이노베이션 주식회사" readOnly />
        <FieldRow
          label="성명"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <FieldRow
          label="직급"
          value={rank}
          onChange={(e) => onRankChange(e.target.value)}
        />
        <FieldRow label="작성일" value={date} readOnly />
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  readOnly?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-semibold text-[#64748b] w-[52px] shrink-0 uppercase tracking-[0.5px]">
        {label}
      </span>
      <input
        className={`flex-1 h-9 border border-[#d1d9e0] rounded-[7px] px-3 text-[13px] font-noto text-[#1e293b] outline-none transition-all
          focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)]
          ${
            readOnly ? "bg-[#f8fafc] text-[#64748b] cursor-default" : "bg-white"
          }`}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
}

/** 근태 관리 패널 */
function AttendancePanel({
  checkin,
  checkout,
  onCheckinChange,
  onCheckoutChange,
}: {
  checkin: string;
  checkout: string;
  onCheckinChange: (v: string) => void;
  onCheckoutChange: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-[#d1d9e0] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#d1d9e0] bg-[#fafbfc]">
        <div className="w-7 h-7 bg-[#e8f0fe] rounded-[7px] flex items-center justify-center text-sm">
          🕐
        </div>
        <h2 className="text-sm font-semibold text-[#1e293b]">근태 관리</h2>
      </div>
      <div className="px-5 py-[18px]">
        <div className="flex gap-5 items-center">
          <AttField
            label="출근 시간"
            value={checkin}
            onChange={(e) => onCheckinChange(e.target.value)}
          />
          <AttField
            label="퇴근 시간"
            value={checkout}
            onChange={(e) => onCheckoutChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function AttField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex items-center gap-2.5 flex-1">
      <span className="text-xs font-semibold text-[#64748b] w-[60px]">
        {label}
      </span>
      <input
        type="time"
        className="flex-1 h-9 border border-[#d1d9e0] rounded-[7px] px-3 text-[13px] font-noto outline-none transition-all
          focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)]"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/** 업무 항목 카드 */
function WorkItemCard({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: WorkItem;
  index: number;
  onChange: (field: keyof WorkItem, value: string | number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-[#d1d9e0] rounded-lg p-3.5 bg-[#fdfdfe] relative">
      {/* remove */}
      <button
        onClick={onRemove}
        className="absolute top-2.5 right-2.5 w-6 h-6 border-none bg-[#fef2f2] text-[#ef4444] rounded-[6px] cursor-pointer text-sm flex items-center justify-center hover:bg-[#fecaca] transition-colors"
        title="삭제"
      >
        ✕
      </button>

      {/* title row */}
      <div className="flex gap-2.5 mb-2.5">
        <div className="w-[22px] h-[22px] text-[11px] font-bold text-[#1a56db] bg-[#e8f0fe] rounded-full flex items-center justify-center shrink-0 mt-[7px]">
          {index + 1}
        </div>
        <input
          className="flex-1 h-9 border border-[#d1d9e0] rounded-[7px] px-2.5 text-[13px] font-noto outline-none transition-all
            focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)]"
          placeholder="업무 제목"
          value={item.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      {/* detail */}
      <textarea
        className="w-full min-h-14 border border-[#d1d9e0] rounded-[7px] px-2.5 py-2 text-xs font-noto resize-y outline-none transition-all
          focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)]"
        placeholder="업무 상세 내용"
        value={item.detail}
        onChange={(e) => onChange("detail", e.target.value)}
      />

      {/* progress */}
      <div className="flex items-center gap-2.5 mt-2.5">
        <span className="text-[11px] text-[#64748b] font-semibold w-9">
          진행률
        </span>
        <input
          type="range"
          className="flex-1 accent-[#1a56db] cursor-pointer"
          min={0}
          max={100}
          value={item.progress}
          onChange={(e) => onChange("progress", Number(e.target.value))}
        />
        <span className="text-xs font-bold text-[#1a56db] w-9 text-right">
          {item.progress}%
        </span>
      </div>
    </div>
  );
}

/** 특이사항 행 */
function SpecialItemRow({
  value,
  index,
  onChange,
  onRemove,
}: {
  value: string;
  index: number;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 items-center mb-2 last:mb-0">
      <span className="text-sm text-[#1a56db] shrink-0">•</span>
      <input
        className="flex-1 h-[34px] border border-[#d1d9e0] rounded-[7px] px-2.5 text-[13px] font-noto outline-none transition-all
          focus:border-[#1a56db] focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)]"
        placeholder="특이사항 / 건의사항 입력"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={onRemove}
        className="w-6 h-6 border-none bg-[#fef2f2] text-[#ef4444] rounded-[6px] cursor-pointer text-sm flex items-center justify-center hover:bg-[#fecaca] transition-colors shrink-0"
        title="삭제"
      >
        ✕
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────
   Panel shell
────────────────────────────────────────── */
function Panel({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] border border-[#d1d9e0] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#d1d9e0] bg-[#fafbfc]">
        <div className="w-7 h-7 bg-[#e8f0fe] rounded-[7px] flex items-center justify-center text-sm">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-[#1e293b]">{title}</h2>
      </div>
      <div className="px-5 py-[18px]">{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Page
────────────────────────────────────────── */
export default function DailyReportPage() {
  const [name, setName] = useState("배중권");
  const [rank, setRank] = useState("사원");
  const [date] = useState(getTodayString());
  const [checkin, setCheckin] = useState("09:00");
  const [checkout, setCheckout] = useState("18:00");

  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { title: "첫번째 업무내용", detail: "첫번째 업무내용 상세", progress: 30 },
  ]);

  const [specialItems, setSpecialItems] = useState<string[]>([
    "첫번째 특이사항",
  ]);

  /* ── preview HTML ── */
  const previewHTML = useCallback(
    () =>
      buildReportHTML(
        name,
        rank,
        date,
        checkin,
        checkout,
        workItems,
        specialItems
      ),
    [name, rank, date, checkin, checkout, workItems, specialItems]
  );

  /* ── work item helpers ── */
  function updateWork(
    i: number,
    field: keyof WorkItem,
    value: string | number
  ) {
    setWorkItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    );
  }

  function addWork() {
    setWorkItems((prev) => [...prev, { title: "", detail: "", progress: 0 }]);
  }

  function removeWork(i: number) {
    setWorkItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  /* ── special item helpers ── */
  function updateSpecial(i: number, value: string) {
    setSpecialItems((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function addSpecial() {
    setSpecialItems((prev) => [...prev, ""]);
  }

  function removeSpecial(i: number) {
    setSpecialItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  /* ── export ── */
  function exportHTML() {
    const reportBody = buildReportHTML(
      name,
      rank,
      date,
      checkin,
      checkout,
      workItems,
      specialItems
    );

    const html = reportBody;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeDate = date
      .replace(/\s/g, "")
      .replace(/\./g, "-")
      .replace(/-$/, "");
    a.href = url;
    a.download = `일일업무일지_${name}_${safeDate}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── render ── */
  return (
    <main className="font-noto bg-[#f0f4f8] text-[#1e293b] min-h-screen p-20">
      <div className="mx-auto flex flex-col gap-5">
        {/* PAGE HEADER */}
        <div className="text-center mb-2">
          <h1 className="text-[22px] font-bold text-[#1241a3] tracking-[2px]">
            일 일 업 무 일 지 편 집 기
          </h1>
          <p className="text-[13px] text-[#64748b] mt-1">
            하단 실시간 미리보기를 확인하며 내용을 편집하세요
          </p>
        </div>

        <div className="flex 2xl:flex-row flex-col gap-16 2xl:items-start">
          <div className="flex flex-col gap-5 w-full">
            {/* TOP ROW: 기본정보 + 근태 */}
            <div className="grid grid-cols-2 gap-5">
              <BasicInfoPanel
                name={name}
                rank={rank}
                date={date}
                onNameChange={setName}
                onRankChange={setRank}
              />
              <AttendancePanel
                checkin={checkin}
                checkout={checkout}
                onCheckinChange={setCheckin}
                onCheckoutChange={setCheckout}
              />
            </div>

            {/* 업무 내용 */}
            <Panel icon="📋" title="업무 내용">
              <div className="flex flex-col gap-2.5">
                {workItems.map((item, i) => (
                  <WorkItemCard
                    key={i}
                    item={item}
                    index={i}
                    onChange={(field, value) => updateWork(i, field, value)}
                    onRemove={() => removeWork(i)}
                  />
                ))}
              </div>
              <button
                onClick={addWork}
                className="flex items-center gap-1.5 mt-3 px-3.5 py-[7px] border border-dashed border-[#1a56db] bg-[#e8f0fe] text-[#1a56db] rounded-[7px] text-xs font-semibold cursor-pointer font-noto hover:bg-[#d0e2fb] transition-colors"
              >
                ＋ 업무 항목 추가
              </button>
            </Panel>

            {/* 특이사항 / 건의사항 */}
            <Panel icon="📌" title="특이사항 / 건의사항">
              <div>
                {specialItems.map((val, i) => (
                  <SpecialItemRow
                    key={i}
                    value={val}
                    index={i}
                    onChange={(v) => updateSpecial(i, v)}
                    onRemove={() => removeSpecial(i)}
                  />
                ))}
              </div>
              <button
                onClick={addSpecial}
                className="flex items-center gap-1.5 mt-3 px-3.5 py-[7px] border border-dashed border-[#1a56db] bg-[#e8f0fe] text-[#1a56db] rounded-[7px] text-xs font-semibold cursor-pointer font-noto hover:bg-[#d0e2fb] transition-colors"
              >
                ＋ 항목 추가
              </button>
            </Panel>
            {/* EXPORT */}
            <div className="flex justify-end">
              <button
                onClick={exportHTML}
                className="flex items-center gap-2 px-[22px] py-2.5 bg-[#1a56db] text-white border-none rounded-lg text-sm font-semibold font-noto cursor-pointer transition-all shadow-[0_2px_8px_rgba(26,86,219,0.3)] hover:bg-[#1241a3] hover:-translate-y-px active:translate-y-0"
              >
                <span>⬇</span> HTML로 내보내기
              </button>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-white w-full rounded-[10px] border border-[#d1d9e0] p-6 overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: previewHTML() }} />
          </div>
        </div>
      </div>
    </main>
  );
}
