import React, { useState } from "react";
import { RxPlus, RxMinus, RxCheck } from "react-icons/rx";
import "./Entities.css";

// Compact, flexible UI scaffold. No persistence yet.
// Contract: derives model name from prop, allows managing 1..10 texture slots.
export interface EntitiesPanelProps {
  // Current selected model name (from Models section)
  modelName?: string;
}

interface TextureSlot {
  id: number; // 1-based index of the slot
  ids: string[]; // small numeric inputs (as text); parsed on confirm
}

const MIN_SLOTS = 1;
const MAX_SLOTS = 5;
const MAX_IDS = 4;

const EntitiesPanel: React.FC<EntitiesPanelProps> = ({ modelName }) => {
  const [slots, setSlots] = useState<TextureSlot[]>([{ id: 1, ids: [""] }]);

  const canAdd = slots.length < MAX_SLOTS;
  const canRemove = slots.length > MIN_SLOTS;

  const addSlot = () => {
    if (!canAdd) return;
    setSlots((s) => [...s, { id: s.length + 1, ids: [""] }]);
  };
  const removeSlot = () => {
    if (!canRemove) return;
    setSlots((s) => s.slice(0, -1));
  };
  const addIdToSlot = (slotIdx: number) => {
    setSlots((s) =>
      s.map((slot, i) => {
        if (i !== slotIdx) return slot;
        if (slot.ids.length >= MAX_IDS) return slot;
        return { ...slot, ids: [...slot.ids, ""] };
      })
    );
  };
  const removeIdFromSlot = (slotIdx: number) => {
    setSlots((s) =>
      s.map((slot, i) => {
        if (i !== slotIdx) return slot;
        if (slot.ids.length <= 1) return slot; // keep at least one input
        return { ...slot, ids: slot.ids.slice(0, -1) };
      })
    );
  };
  const changeIdValue = (slotIdx: number, idIdx: number, nextVal: string) => {
    // Sanitize to digits only; allow empty
    const cleaned = nextVal.replace(/[^0-9]/g, "");
    setSlots((s) =>
      s.map((slot, i) => {
        if (i !== slotIdx) return slot;
        const ids = [...slot.ids];
        ids[idIdx] = cleaned;
        return { ...slot, ids };
      })
    );
  };
  const confirmEntity = () => {
    // Future: build entity JSON and persist. For now, just console.log.
    const entity = {
      model: modelName || "(no model)",
      textures: slots.map((slot) => ({
        slot: slot.id,
        materialIds: slot.ids
          .map((v) => (v.trim() === "" ? NaN : Number(v)))
          .filter((n) => Number.isFinite(n)) as number[],
      })),
    };
    // eslint-disable-next-line no-console
    console.log("[Entity]", entity);
  };

  return (
    <section className="en-section">
      <div className="en-header">
        <h2 className="sp-title">Create</h2>
        <div className="en-actions">
          <button
            type="button"
            className="en-btn"
            title="Add texture slot"
            onClick={addSlot}
            disabled={!canAdd}
          >
            <RxPlus />
          </button>
          <button type="button" className="en-btn" title="Confirm entity" onClick={confirmEntity}>
            <RxCheck />
          </button>
          <button
            type="button"
            className="en-btn"
            title="Remove texture slot"
            onClick={removeSlot}
            disabled={!canRemove}
          >
            <RxMinus />
          </button>
        </div>
      </div>

      <div className="en-body">
        <div className="en-preview" aria-label="Preview placeholder" />
        <div className="en-slots" aria-label="Texture slots">
          {slots.map((slot, slotIdx) => (
            <div key={slot.id} className="en-slot">
              <div className="en-slot-thumb" aria-label={`Texture slot ${slot.id}`} />
              <div className="en-slot-meta">
                <span className="en-slot-label">texture</span>
                <div className="en-ids">
                  {slot.ids.map((val, idIdx) => (
                    <input
                      key={idIdx}
                      className="en-id-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={val}
                      onChange={(e) => changeIdValue(slotIdx, idIdx, e.target.value)}
                      placeholder="0"
                      title="Material ID"
                    />
                  ))}
                  <button
                    type="button"
                    className="en-id-add"
                    title="Agregar ID"
                    onClick={() => addIdToSlot(slotIdx)}
                    disabled={slot.ids.length >= MAX_IDS}
                  >
                    <RxPlus />
                  </button>
                  <button
                    type="button"
                    className="en-id-remove"
                    title="Quitar ID"
                    onClick={() => removeIdFromSlot(slotIdx)}
                    disabled={slot.ids.length <= 1}
                  >
                    <RxMinus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EntitiesPanel;
